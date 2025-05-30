import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "zh"],
  defaultLocale: "en"
});

export const config = {
  matcher: ["/((?!_next|favicon.ico|public|api).*)"]
};
