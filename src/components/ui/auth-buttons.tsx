"use client"

import { signIn, signOut } from "next-auth/react"

export function AuthButtons() {
  return (
    <div style={{ display: "flex", gap: 12 }}>
  <button onClick={() => signIn("keycloak", { callbackUrl: "/dashboard" })} aria-label="Sign in">
        Sign in
      </button>
      <button
        onClick={async () => {
          // Clear local session
          await signOut({ redirect: false })
          // Optional: also log out at Keycloak (SSO end-session)
          window.location.href = "/api/auth/kc-logout"
        }}
        aria-label="Sign out"
      >
        Sign out
      </button>
    </div>
  )
}
