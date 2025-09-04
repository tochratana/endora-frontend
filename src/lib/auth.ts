import type { NextAuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import type { JWT } from "next-auth/jwt";

const issuer = process.env.KEYCLOAK_ISSUER;
if (!issuer) throw new Error("KEYCLOAK_ISSUER is required");

/**
 * Refresh the access token using the refresh token.
 * Keeps refresh_token server-side in the NextAuth JWT only.
 */
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: process.env.KEYCLOAK_CLIENT_ID!,
      refresh_token: String(token.refreshToken),
    });
    if (process.env.KEYCLOAK_CLIENT_SECRET) {
      body.set("client_secret", process.env.KEYCLOAK_CLIENT_SECRET);
    }

    const res = await fetch(`${issuer}/protocol/openid-connect/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    const refreshed = await res.json();
    if (!res.ok) throw refreshed;

    return {
      ...token,
      accessToken: refreshed.access_token,
      expiresAt:
        typeof refreshed.expires_in === "number"
          ? Math.floor(Date.now() / 1000) + refreshed.expires_in
          : undefined,
      refreshToken: refreshed.refresh_token ?? token.refreshToken,
      idToken: refreshed.id_token ?? token.idToken,
      error: undefined,
    };
  } catch (err) {
    return { ...token, error: "RefreshAccessTokenError" as const };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      issuer,
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || undefined,
      authorization: {
        params: {
          scope: "openid profile email offline_access",
          // Ensure we're using the correct response type
          response_type: "code",
        },
      },
      checks: ["pkce", "state"],
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        const now = Math.floor(Date.now() / 1000);
        const expiresAt =
          (account as any).expires_at ??
          (account.expires_in ? now + account.expires_in : undefined);

        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.idToken = account.id_token;
        token.expiresAt = expiresAt;
        token.user = token.user ?? {
          name: profile?.name ?? undefined,
          email: profile?.email ?? undefined,
        };
        return token;
      }

      if (token.expiresAt && Date.now() / 1000 > token.expiresAt - 60) {
        if (token.refreshToken) {
          return refreshAccessToken(token);
        }
        return { ...token, error: "NoRefreshToken" as const };
      }

      return token;
    },

    async session({ session, token }) {
      session.user = session.user ?? (token.user as any);
      (session as any).error = token.error;
      return session;
    },
  },
  // Add debug logging in development
  debug: process.env.NODE_ENV === "development",

  // Ensure cookies work properly
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};
