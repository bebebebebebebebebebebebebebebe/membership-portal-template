import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { defineConfig, globalIgnores } from "eslint/config";
import importPlugin from "eslint-plugin-import";
import tsdocPlugin from "eslint-plugin-tsdoc";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const sourceRoot = "./src";
const appLayer = `${sourceRoot}/app`;
const featuresLayer = `${sourceRoot}/features`;
const sharedLayers = [
  `${sourceRoot}/components`,
  `${sourceRoot}/config`,
  `${sourceRoot}/hooks`,
  `${sourceRoot}/lib`,
  `${sourceRoot}/types`,
  `${sourceRoot}/utils`,
];

function getFeatureNames() {
  if (!existsSync(featuresLayer)) {
    return [];
  }

  return readdirSync(featuresLayer).filter((entry) =>
    statSync(join(featuresLayer, entry)).isDirectory()
  );
}

const sharedBoundaryZones = sharedLayers.flatMap((target) => [
  {
    target,
    from: appLayer,
    message:
      "shared 層から app 層への import は禁止です。依存方向は shared -> features -> app です。",
  },
  {
    target,
    from: featuresLayer,
    message:
      "shared 層から features 層への import は禁止です。依存方向は shared -> features -> app です。",
  },
]);

const featureBoundaryZones = getFeatureNames().map((featureName) => ({
  target: `${featuresLayer}/${featureName}`,
  from: featuresLayer,
  except: [`./${featureName}`],
  message:
    "feature 間の直接 import は禁止です。複数 feature の合成は app 層で行ってください。",
}));

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      import: importPlugin,
      tsdoc: tsdocPlugin,
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
    rules: {
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            {
              target: featuresLayer,
              from: appLayer,
              message:
                "features 層から app 層への import は禁止です。app 層で feature を合成してください。",
            },
            ...sharedBoundaryZones,
            ...featureBoundaryZones,
          ],
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/features/contents/server/mock-content-repository",
              message:
                "旧 mock-content-repository を直接 import しないでください。content-read-service 経由に移行してください。",
            },
            {
              name: "@/features/contents/server/repositories/mock-content-repository",
              message:
                "mock-content-repository を直接 import しないでください。server では content-read-service、repository 差し替えでは content-repository-provider を使ってください。",
            },
          ],
        },
      ],
      "tsdoc/syntax": "error",
    },
  },
  {
    files: [
      "src/features/contents/server/repositories/content-repository-provider.ts",
      "src/features/contents/server/repositories/mock-content-repository.ts",
      "src/features/contents/server/repositories/__tests__/**/*.ts",
    ],
    rules: {
      "no-restricted-imports": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "public/mockServiceWorker.js",
    ".agents/**",
    ".claude/**",
  ]),
]);

export default eslintConfig;
