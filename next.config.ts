import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components / PPR を有効化する。UI route は static shell + request-time
  // streaming slot で構成し、認証・認可・ユーザー別表示は Suspense 内に隔離する。
  cacheComponents: true,
};

export default nextConfig;
