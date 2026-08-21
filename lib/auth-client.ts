import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

export const signIn = async () => {
  return await authClient.signIn.social({
    provider: "google",
  });
};

export const { signUp, signOut, useSession } = authClient;
