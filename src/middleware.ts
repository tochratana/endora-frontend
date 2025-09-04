import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    // Unauthenticated users will be sent here; NextAuth will show provider(s) and redirect to Keycloak
    signIn: "/api/auth/signin",
  },
})

export const config = {
  matcher: ["/dashboard/:path*", "/account/:path*"],
}
