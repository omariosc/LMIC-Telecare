declare module "next-pwa" {
  import { NextConfig } from "next";

  type PWAConfig = {
    dest?: string;
    disable?: boolean;
    register?: boolean;
    skipWaiting?: boolean;
    runtimeCaching?: Array<{
      urlPattern: RegExp | string | ((_url: URL) => boolean);
      handler: string;
      options?: Record<string, unknown>;
    }>;
    buildExcludes?: (string | RegExp)[];
    exclude?: (string | RegExp)[];
    publicExcludes?: string[];
    fallbacks?: Record<string, string>;
    sw?: string;
    mode?: "production" | "development";
  };

  function withPWA(_config: PWAConfig): (_nextConfig: NextConfig) => NextConfig;

  export = withPWA;
}