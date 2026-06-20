import { existsSync, statSync } from "node:fs";
import { isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import type { MiddlewareHandler } from "hono";

type ResolvedRequestPath =
  | { status: "found" }
  | { status: "forbidden" }
  | { status: "notFound" };

const projectRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const docsRoot = resolve(projectRoot, "docs/code-reference");
const indexPath = resolve(docsRoot, "index.html");
const host = process.env.DOCS_API_HOST ?? "127.0.0.1";
const rawPort = process.env.DOCS_API_PORT ?? "4173";
const port = Number.parseInt(rawPort, 10);

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

function isInsideDocsRoot(filePath: string) {
  const relativePath = relative(docsRoot, filePath);
  return (
    relativePath === "" ||
    (!relativePath.startsWith("..") && !isAbsolute(relativePath))
  );
}

function resolveRequestPath(pathname: string): ResolvedRequestPath {
  const decodedPathname = decodeURIComponent(pathname);
  const requestPath = decodedPathname.replace(/^\/+/, "");
  let filePath = resolve(docsRoot, requestPath);

  // serveStatic に渡す前に TypeDoc 出力外への path traversal を明示的に拒否する。
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

    return { status: "found" };
  }

  if (!fileStat.isFile()) {
    return { status: "notFound" };
  }

  return { status: "found" };
}

const restrictMethods: MiddlewareHandler = async (c, next) => {
  if (c.req.method !== "GET" && c.req.method !== "HEAD") {
    return c.text("Method Not Allowed", 405, {
      Allow: "GET, HEAD",
    });
  }

  await next();
};

const guardStaticPath: MiddlewareHandler = async (c, next) => {
  let requestUrl: URL;
  let resolvedPath: ResolvedRequestPath;

  try {
    // Hono の c.req.path は正規化後なので、traversal 判定は raw URL で行う。
    requestUrl = new URL(c.req.raw.url);
    resolvedPath = resolveRequestPath(requestUrl.pathname);
  } catch {
    return c.text("Bad Request", 400);
  }

  if (resolvedPath.status === "forbidden") {
    return c.text("Forbidden", 403);
  }

  if (resolvedPath.status === "notFound") {
    return c.text("Not Found", 404);
  }

  await next();
};

function isPortInUseError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const errorWithCode = error as Error & { code?: string };

  return (
    errorWithCode.code === "EADDRINUSE" ||
    error.message.includes("EADDRINUSE") ||
    (error.message.includes("Failed to start server") &&
      error.message.includes("port"))
  );
}

function startServer() {
  try {
    const server = Bun.serve({
      fetch: app.fetch,
      hostname: host,
      port,
    });

    console.log(`TypeDoc code reference: http://${host}:${port}/`);

    return server;
  } catch (error) {
    if (isPortInUseError(error)) {
      console.error(`Port ${port} is already in use.`);
    } else {
      console.error(error);
    }

    process.exit(1);
  }
}

const app = new Hono();

app.use("*", restrictMethods);
app.use("*", guardStaticPath);
app.use(
  "*",
  serveStatic({
    root: docsRoot,
    onFound: (_path, c) => {
      c.header("Cache-Control", "no-store");
    },
  })
);

app.notFound((c) => c.text("Not Found", 404));
app.onError((_error, c) => c.text("Internal Server Error", 500));

const server = startServer();

let isShuttingDown = false;

async function shutdown() {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  try {
    // signal 受信時は Bun の server を停止してから process を終了する。
    await server.stop();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
