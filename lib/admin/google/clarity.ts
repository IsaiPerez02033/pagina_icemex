// Microsoft Clarity — API integration (placeholder)
// Requiere: CLARITY_PROJECT_ID, CLARITY_API_KEY
//
// Para activar:
// 1. Crear proyecto en https://clarity.microsoft.com
// 2. Obtener API key desde Settings → API
// 3. Configurar .env.local

export async function getClarityData() {
  return {
    enabled: false,
    message: "Microsoft Clarity no está configurado. Agrega CLARITY_PROJECT_ID y CLARITY_API_KEY en .env.local para activar.",
  };
}

/*
// Implementación real:

export async function getClarityData() {
  const res = await fetch(
    `https://www.clarity.ms/api/rest/v1/insights/${process.env.CLARITY_PROJECT_ID}/heatmap`,
    {
      headers: {
        Authorization: `Bearer ${process.env.CLARITY_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) throw new Error("Clarity API error");
  return res.json();
}
*/

export type ClarityData = {
  enabled: boolean;
  message: string;
};
