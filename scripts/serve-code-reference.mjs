import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import {
  extname,
  isAbsolute,
  relative,
  resolve,
} from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const docsRoot = resolve(projectRoot, "docs/code-reference");
const indexPath = resolve(docsRoot, "index.html");
const host = process.env.DOCS_API_HOST ?? "127.0.0.1";
const rawPort = process.env.DOCS_API_PORT ?? "4173";
const port = Number.parseInt(rawPort, 10);

const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".js", "application/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".map", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
]);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error(
    `Invalid DOCS_API_PORT: ${rawPort}. Use an integer between 1 and 65535.`
  );
  process.exit(1);
}

if (!existsSync(indexPath)) {
  console.error(
    "TypeDoc output was not found. Run `pnpm run docs:api` before `pnpm run docs:api:serve`."
  );
  process.exit(1);
}

function isInsideDocsRoot(filePath) {
  const relativePath = relative(docsRoot, filePath);
  return relativePath === "" || (!relativePath.startsWith("..") && !isAbsolute(relativePath));
}

function sendText(response, statusCode, message) {
  response.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
  });
  response.end(message);
}

function resolveRequestPath(pathname) {
  const decodedPathname = decodeURIComponent(pathname);
  const requestPath = decodedPathname.replace(/^\/+/, "");
  let filePath = resolve(docsRoot, requestPath);

  if (!isInsideDocsRoot(filePath)) {
    return { status: "forbidden" };
  }

  const fileStat = statSync(filePath, { throwIfNoEntry: false });

  if (!fileStat) {
    return { status: "notFound" };
  }

  if (fileStat.isDirectory()) {
    filePath = resolve(filePath, "index.html");

    if (!isInsideDocsRoot(filePath)) {
      return { status: "forbidden" };
    }

    const indexStat = statSync(filePath, { throwIfNoEntry: false });

    if (!indexStat?.isFile()) {
      return { status: "notFound" };
    }

    return { status: "found", filePath, fileStat: indexStat };
  }

  if (!fileStat.isFile()) {
    return { status: "notFound" };
  }

  return { status: "found", filePath, fileStat };
}

const server = createServer((request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, {
      Allow: "GET, HEAD",
      "Content-Type": "text/plain; charset=utf-8",
    });
    response.end("Method Not Allowed");
    return;
  }

  let requestUrl;

  try {
    requestUrl = new URL(request.url ?? "/", `http://${host}:${port}`);
  } catch {
    sendText(response, 400, "Bad Request");
    return;
  }

  let resolvedPath;

  try {
    resolvedPath = resolveRequestPath(requestUrl.pathname);
  } catch {
    sendText(response, 400, "Bad Request");
    return;
  }

  if (resolvedPath.status === "forbidden") {
    sendText(response, 403, "Forbidden");
    return;
  }

  if (resolvedPath.status === "notFound") {
    sendText(response, 404, "Not Found");
    return;
  }

  const contentType =
    mimeTypes.get(extname(resolvedPath.filePath)) ??
    "application/octet-stream";

  response.writeHead(200, {
    "Cache-Control": "no-store",
    "Content-Length": resolvedPath.fileStat.size,
    "Content-Type": contentType,
  });

  if (request.method === "HEAD") {
    response.end();
    return;
  }

  createReadStream(resolvedPath.filePath)
    .on("error", () => {
      if (!response.headersSent) {
        sendText(response, 500, "Internal Server Error");
      } else {
        response.destroy();
      }
    })
    .pipe(response);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use.`);
  } else {
    console.error(error);
  }

  process.exit(1);
});

server.listen(port, host, () => {
  console.log(`TypeDoc code reference: http://${host}:${port}/`);
});

function shutdown() {
  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
