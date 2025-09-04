import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    // Unauthenticated users will be sent here; NextAuth will show provider(s) and redirect to Keycloak
    // point to the actual UI page that renders the sign-in form
    signIn: "/auth/signin",
  },
});

export const config = {
  matcher: ["/dashboard/:path*", "/account/:path*"],
};
