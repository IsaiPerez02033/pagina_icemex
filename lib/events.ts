// Helper para enviar eventos al dashboard analytics (Upstash Redis).
// Se llama desde componentes cliente cuando ocurre una acción rastreable.
// keepalive: el evento llega aunque el clic abra otra pestaña o navegue.

export type TrackedEvent =
  | "whatsapp_click"
  | "form_submit"
  | "pdf_download"
  | "chatbot_conversation"
  | "lead_saved";

export function sendEvent(name: TrackedEvent) {
  fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "event", name }),
    keepalive: true,
  }).catch(() => {});
}
