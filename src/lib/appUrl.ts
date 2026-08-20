const DEVELOPMENT_APP_URL = "http://localhost:3000";

export function getAppUrl() {
  const configuredUrl =
    process.env.APP_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined);

  return (configuredUrl ?? DEVELOPMENT_APP_URL).replace(/\/$/, "");
}
