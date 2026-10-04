import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getClientIp, hashIp, rateLimit, safeEqual } from "@/lib/security";

// NextAuth v4 lee process.env.NEXTAUTH_URL internamente. Si no está configurada
// en Vercel, la auto-detectamos desde VERCEL_URL (que Vercel siempre expone).
if (!process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";
}

const isHttps = process.env.NEXTAUTH_URL.startsWith("https://");

// En producción NEXTAUTH_SECRET es obligatorio: una clave por defecto en el
// código permitiría a cualquiera firmar sesiones de admin.
const secret =
  process.env.NEXTAUTH_SECRET ||
  (process.env.NODE_ENV !== "production" ? "icemex-admin-dev-only" : undefined);

// 5 intentos fallidos por IP cada 15 minutos.
const MAX_ATTEMPTS = 5;
const WINDOW_SEC = 15 * 60;

const handler = NextAuth({
  useSecureCookies: isHttps,
  providers: [
    CredentialsProvider({
      name: "ICEMEX Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials, req) {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
          console.error(
            "[ICEMEX AUTH] ADMIN_EMAIL y ADMIN_PASSWORD no están configurados en Vercel."
          );
          return null;
        }

        const headers = new Headers(
          Object.entries(req?.headers ?? {}).flatMap(([k, v]) =>
            typeof v === "string" ? [[k, v] as [string, string]] : []
          )
        );
        const ipKey = `login:${hashIp(getClientIp(headers))}`;
        if (!(await rateLimit(ipKey, MAX_ATTEMPTS, WINDOW_SEC))) {
          console.warn("[ICEMEX AUTH] Demasiados intentos, IP bloqueada temporalmente");
          return null;
        }

        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");
        const ok =
          safeEqual(email, adminEmail.trim().toLowerCase()) &&
          safeEqual(password, adminPassword);

        if (!ok) {
          console.warn("[ICEMEX AUTH] Credenciales inválidas");
          return null;
        }

        return {
          id: "1",
          name: "Admin ICEMEX",
          email: adminEmail,
          role: "admin",
        };
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
  secret,
  debug: false,
});

export { handler as GET, handler as POST };
