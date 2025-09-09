/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextAuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import type { JWT } from "next-auth/jwt";

const issuer = process.env.KEYCLOAK_ISSUER;
if (!issuer) throw new Error("KEYCLOAK_ISSUER is required");

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: String(process.env.KEYCLOAK_CLIENT_ID),
      refresh_token: String((token as any).refreshToken),
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
      refreshToken: refreshed.refresh_token ?? (token as any).refreshToken,
      idToken: refreshed.id_token ?? (token as any).idToken,
      error: undefined,
    } as JWT;
  } catch {
    return { ...token, error: "RefreshAccessTokenError" as const } as JWT;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    // Keep provider config simple; NextAuth handles PKCE when needed.
    // We avoid complex typing to match the project's next-auth version.
    KeycloakProvider({
      issuer,
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      ...(process.env.KEYCLOAK_CLIENT_SECRET
        ? { clientSecret: process.env.KEYCLOAK_CLIENT_SECRET }
        : {}),
      authorization: {
        params: { scope: "openid profile email offline_access" },
      },
      checks: ["pkce", "state"],
    } as any),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, account, profile }) {
      // first sign-in
      if (account) {
        const now = Math.floor(Date.now() / 1000);
        const expires_in = (account as any).expires_in;
        const expiresAt =
          (account as any).expires_at ??
          (typeof expires_in === "number" ? now + expires_in : undefined);

        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          idToken: account.id_token,
          expiresAt,
          user: {
            name: profile?.name ?? undefined,
            email: profile?.email ?? undefined,
          },
        } as JWT;
      }

      // refresh if expired
      if (
        (token as any).expiresAt &&
        Date.now() / 1000 > (token as any).expiresAt - 60
      ) {
        if ((token as any).refreshToken) {
          return refreshAccessToken(token);
        }
        return { ...token, error: "NoRefreshToken" } as JWT;
      }

      return token;
    },

    async session({ session, token }) {
      // expose minimal user info only
      session.user = session.user ?? (token as any).user;
      return session;
    },
    // Control where NextAuth redirects after sign in/out
    async redirect({ baseUrl }) {
      return `${baseUrl}/dashboard`;
    }

  },

  debug: process.env.NODE_ENV === "development",
};
