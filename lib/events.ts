// Helper para enviar eventos al dashboard analytics (Vercel KV).
// Se llama desde componentes cliente cuando ocurre una acción rastreable.

export function sendEvent(name: string) {
  fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "event", name }),
  }).catch(() => {});
}
