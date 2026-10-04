// Helper para enviar eventos al dashboard analytics (Upstash Redis).
// Se llama desde componentes cliente cuando ocurre una acción rastreable.
// keepalive: el evento llega aunque el clic abra otra pestaña o navegue.

export type TrackedEvent =
  | "whatsapp_click"
  | "form_submit"
  | "pdf_download"
  | "chatbot_conversation";

export function sendEvent(name: TrackedEvent) {
  fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "event", name }),
    keepalive: true,
  }).catch(() => {});
}

/** Guarda el lead del formulario en el servidor (además de abrir WhatsApp). */
export function saveLead(lead: {
  source: "contacto" | "catalogo";
  nombre?: string;
  empresa?: string;
  email?: string;
  tipo?: string;
  mensaje?: string;
}) {
  fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...lead, pagina: location.pathname }),
    keepalive: true,
  }).catch(() => {});
}
