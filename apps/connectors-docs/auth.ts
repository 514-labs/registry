import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      authorization: {
        params: { scope: "read:user public_repo" },
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        // Persist GitHub access token in the JWT
        (token as any).accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose access token on the session
      (session as any).accessToken = (token as any)?.accessToken;
      return session;
    },
  },
});
