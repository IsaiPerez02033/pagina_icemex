import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const siteUrl =
  process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXTAUTH_URL || "http://localhost:3000";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "ICEMEX Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        // Log para debugging — aparece en Functions → Logs de Vercel
        console.log("[ICEMEX AUTH] Intento de login:", {
          inputEmail: credentials?.email,
          hasInputPwd: !!credentials?.password,
          hasEnvAdminEmail: !!adminEmail,
          hasEnvAdminPwd: !!adminPassword,
        });

        if (!adminEmail || !adminPassword) {
          console.error(
            "[ICEMEX AUTH] ERROR: ADMIN_EMAIL y ADMIN_PASSWORD no están configurados en Vercel. Ve a Settings → Environment Variables."
          );
          return null;
        }

        if (
          credentials?.email === adminEmail &&
          credentials?.password === adminPassword
        ) {
          console.log("[ICEMEX AUTH] Login exitoso para:", credentials.email);
          return {
            id: "1",
            name: "Admin ICEMEX",
            email: adminEmail,
            role: "admin",
          };
        }

        console.log("[ICEMEX AUTH] Credenciales inválidas");
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as unknown as { role: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as unknown as { role: string }).role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "icemex-admin-dev-fallback-key",
  debug: process.env.NODE_ENV !== "production",
});

export { handler as GET, handler as POST };
