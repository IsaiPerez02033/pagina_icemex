"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Zap, Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (errorParam) {
      setError("Credenciales inválidas. Intenta de nuevo.");
    }
  }, [errorParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Credenciales inválidas. Verifica tu email y contraseña.");
    } else if (result?.ok) {
      router.push(callbackUrl);
    }
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(var(--cyan-rgb), 0.08) 0%, var(--bg-primary) 60%)",
        padding: 24,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          width: "100%",
          maxWidth: 400,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "var(--accent-cyan)",
              color: "var(--bg-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 24,
              margin: "0 auto 16px",
            }}
          >
            I
          </motion.div>
          <h1
            style={{
              color: "var(--text-primary)",
              fontSize: 22,
              fontWeight: 500,
              letterSpacing: "0.04em",
              marginBottom: 4,
            }}
          >
            ICEMEX Admin
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: 13,
              letterSpacing: "0.04em",
            }}
          >
            Panel de administración
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: 28,
            background: "rgba(var(--card-rgb), 0.7)",
            border: "1px solid rgba(var(--cyan-rgb), 0.12)",
            borderRadius: 20,
            display: "flex",
            flexDirection: "column",
            gap: 18,
            backdropFilter: "blur(12px)",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: 11,
                color: "var(--text-muted)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@icemex.mx"
              required
              style={{
                width: "100%",
                padding: "12px 14px",
                background: "rgba(var(--text-rgb), 0.04)",
                border: "1px solid rgba(var(--cyan-rgb), 0.15)",
                borderRadius: 10,
                color: "var(--text-primary)",
                fontSize: 14,
                outline: "none",
                transition: "border-color 0.2s ease",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: 11,
                color: "var(--text-muted)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: "100%",
                padding: "12px 14px",
                background: "rgba(var(--text-rgb), 0.04)",
                border: "1px solid rgba(var(--cyan-rgb), 0.15)",
                borderRadius: 10,
                color: "var(--text-primary)",
                fontSize: 14,
                outline: "none",
                transition: "border-color 0.2s ease",
              }}
            />
          </div>

          {error && (
            <p
              style={{
                color: "var(--accent-red)",
                fontSize: 12,
                letterSpacing: "0.02em",
                margin: 0,
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "14px 20px",
              background: "var(--accent-cyan)",
              color: "var(--bg-primary)",
              border: "none",
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              cursor: loading ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
          >
            {loading ? (
              <>
                <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                Verificando...
              </>
            ) : (
              <>
                <Zap size={16} />
                Iniciar sesión
              </>
            )}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: 20,
            color: "var(--text-muted)",
            fontSize: 11,
            letterSpacing: "0.06em",
          }}
        >
          ICEMEX S.A. de C.V. · Panel administrativo
        </p>
      </motion.div>

      <style
        dangerouslySetInnerHTML={{
          __html: `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`,
        }}
      />
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
