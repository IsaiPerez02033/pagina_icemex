// Catálogo ICEMEX 2026 — datos extraídos de las fichas técnicas oficiales

export type ProductTag =
  | "vialidad"
  | "parques"
  | "tuneles"
  | "industrial"
  | "comercial"
  | "solar"
  | "decorativo"
  | "residencial";

export type ProductLine =
  | "AL" // Alumbrado público
  | "IS" // Iluminación solar
  | "LU" // Luminarios urbanos
  | "RF" // Reflectores
  | "LC" // Luminarios comerciales
  | "PT" // Postes
  | "AC"; // Brazos y herrajes

export const lineNames: Record<ProductLine, string> = {
  AL: "Alumbrado público",
  IS: "Iluminación solar",
  LU: "Luminarios urbanos",
  RF: "Reflectores",
  LC: "Luminarios comerciales",
  PT: "Postes y postería",
  AC: "Brazos y herrajes",
};

export const tagNames: Record<ProductTag, string> = {
  vialidad: "Vialidad",
  parques: "Parques y jardines",
  tuneles: "Túneles",
  industrial: "Industrial",
  comercial: "Comercial",
  solar: "Solar / autónomo",
  decorativo: "Decorativo",
  residencial: "Residencial",
};

export interface Product {
  code: string;
  name: string;
  line: ProductLine;
  tags: ProductTag[];
  tagline: string;
  description: string;
  applications: string[];
  specs: { label: string; value: string }[];
  features: string[];
  certifications?: string[];
  warranty?: string;
}

export const products: Product[] = [
  // === ALUMBRADO PÚBLICO ===
  {
    code: "AL-LC1001",
    name: "Luminaria Cobra",
    line: "AL",
    tags: ["vialidad", "residencial"],
    tagline: "LED SMD para alumbrado público vial",
    description:
      "Luminaria de alumbrado público con tecnología LED SMD de alta eficiencia. Diseñada para vialidades, periféricos, ejes viales y caminos rurales.",
    applications: [
      "Calles y avenidas",
      "Periféricos y vías rápidas",
      "Ejes viales",
      "Caminos rurales",
      "Cotos y zonas residenciales",
    ],
    specs: [
      { label: "Tecnología", value: "LED SMD" },
      { label: "Eficiencia", value: "106 lm/W" },
      { label: "Grado de protección", value: "IP65" },
      { label: "Vida útil", value: "50,000 horas" },
    ],
    features: [
      "Cuerpo en aluminio inyectado",
      "Cristal templado de 3 mm",
      "Disipación de calor optimizada",
      "Resistencia UV",
    ],
  },
  {
    code: "AL-LT1002",
    name: "Luminaria Titan",
    line: "AL",
    tags: ["vialidad", "parques", "comercial"],
    tagline: "Tecnología Philips FastFlex con drivers Xitanium",
    description:
      "Luminaria para alumbrado público con excelente eficiencia lumínica y diseño modernista. Tecnología LED Philips módulo Fast Flex con drivers Xitanium Led Xtreme de gran protección a la intemperie.",
    applications: [
      "Parques y vía pública",
      "Avenidas primarias y secundarias",
      "Estacionamientos",
      "Plazas y explanadas",
    ],
    specs: [
      { label: "Tecnología", value: "Philips FastFlex" },
      { label: "Driver", value: "Xitanium Led Xtreme" },
      { label: "Eficiencia óptica", value: "96%" },
      { label: "Vida útil", value: "100,000 horas" },
      { label: "Voltaje", value: "120-277 V CA / 12-24 V CD" },
      { label: "Potencia", value: "40-100 W" },
      { label: "Eficacia", value: ">105 lm/W" },
      { label: "Flujo luminoso", value: "3,000-10,500 lm" },
      { label: "Temperatura color", value: "3000 / 4000 / 5700 K" },
      { label: "Grado de protección", value: "IP65" },
      { label: "Protección descarga", value: "Hasta 10 KA" },
      { label: "Peso", value: "6.22 kg" },
    ],
    features: [
      "Cuerpo en aluminio inyectado a presión",
      "13 vetas de disipación de calor",
      "Cristal termo-templado de 3 mm",
      "Empaques de silicón",
      "Pintura electrostática horneada",
      "Resistente a rayos UV y corrosión",
    ],
    certifications: ["IP65"],
    warranty: "3 años",
  },
  {
    code: "AL-LU1003",
    name: "Lum-Urbanmex",
    line: "AL",
    tags: ["parques", "decorativo"],
    tagline: "Aluminio puro con domo embutido",
    description:
      "Luminaria ligera y confiable con tecnología Philips Cosmos White. Carcaza de aluminio puro de alta duración con pintura tipo poliéster aplicada electrostáticamente.",
    applications: [
      "Parques y jardines",
      "Zonas urbanas",
      "Andadores",
      "Plazas",
    ],
    specs: [
      { label: "Tecnología", value: "Philips Cosmos White" },
      { label: "Potencias", value: "60 / 90 / 140 W" },
      { label: "Voltaje", value: "220 V" },
      { label: "Lúmenes", value: "100 lm/W" },
      { label: "IRC", value: "70" },
      { label: "Bulbo", value: "T19" },
      { label: "Base", value: "PGZ12" },
      { label: "Vida útil", value: "30,000 horas" },
      { label: "Grado de protección", value: "IP65" },
    ],
    features: [
      "Carcaza de aluminio puro",
      "Domo embutido de aluminio",
      "Conjunto óptico sellado",
      "Curva tipo V simétrica",
      "Pintura horneada poliéster grafito",
    ],
  },
  {
    code: "AL-SL1004",
    name: "Street Light SL1004",
    line: "AL",
    tags: ["vialidad"],
    tagline: "Luminaria vial de alta potencia",
    description:
      "Luminaria street light para alumbrado público vial con distribución uniforme y alta resistencia.",
    applications: [
      "Calles y avenidas",
      "Vialidades urbanas",
      "Carreteras",
    ],
    specs: [
      { label: "Tecnología", value: "LED SMD" },
      { label: "Grado de protección", value: "IP65" },
      { label: "Aplicación", value: "Alumbrado público" },
    ],
    features: [
      "Diseño robusto",
      "Disipación térmica eficiente",
      "Larga vida útil",
    ],
  },
  {
    code: "AL-UL1005",
    name: "Urban LED",
    line: "AL",
    tags: ["vialidad", "residencial"],
    tagline: "MultiLED para vialidades urbanas",
    description:
      "Luminaria urban LED con tecnología MultiLED y óptica tipo II media. Ideal para calles y avenidas con potencias configurables.",
    applications: [
      "Calles y avenidas",
      "Periféricos y vías rápidas",
      "Carreteras y libramientos",
      "Caminos rurales",
      "Cotos y zonas residenciales",
    ],
    specs: [
      { label: "Tecnología", value: "MultiLED" },
      { label: "Eficiencia", value: "80 lm/W" },
      { label: "IRC", value: ">70" },
      { label: "Frecuencia", value: "50-60 Hz" },
      { label: "Grado de protección", value: "IP65" },
      { label: "Vida útil", value: "50,000 horas" },
      { label: "Óptica", value: "Tipo II media" },
      { label: "Temperatura color", value: "6,500 K" },
      { label: "Potencia", value: "40, 60, 100 W" },
      { label: "Voltaje", value: "85-265 V" },
    ],
    features: ["Multi-LED", "Óptica direccional", "Eficiencia alta"],
  },
  {
    code: "AL-LVI006",
    name: "Luminario Vial AD100",
    line: "AL",
    tags: ["vialidad", "parques"],
    tagline: "Aleación de aluminio fundido a presión",
    description:
      "Luminario vial ICEMEX AD100 con potencia de 100 W y construcción en aleación de aluminio fundido a presión.",
    applications: [
      "Estacionamientos",
      "Calles pequeñas",
      "Pasillos y andadores",
      "Jardines y parques",
      "Escuelas y patios",
      "Fachadas",
    ],
    specs: [
      { label: "Modelo", value: "AD100" },
      { label: "Potencia", value: "100 W" },
      { label: "Temperatura color", value: "6,500 K" },
      { label: "Voltaje", value: "120-240 V" },
      { label: "Flujo luminoso", value: "8,000 lm" },
      { label: "Corriente", value: "1 A" },
      { label: "Ángulo apertura", value: "130°" },
      { label: "Altura instalación", value: "8-10 m" },
      { label: "Área iluminación", value: "80-100 m²" },
      { label: "Grado de protección", value: "IP65" },
      { label: "Vida útil", value: "30,000 horas" },
    ],
    features: [
      "Aleación de aluminio fundido a presión",
      "Distribución uniforme",
      "Bajo consumo",
    ],
  },

  // === ILUMINACIÓN SOLAR ===
  {
    code: "IS-LS1003",
    name: "Suburbana 200W con panel solar",
    line: "IS",
    tags: ["solar", "vialidad", "parques"],
    tagline: "Luminario LED solar inteligente con panel integrado",
    description:
      "Luminario LED solar suburbana con panel solar inteligente integrado. Ideal para zonas sin acceso a red eléctrica o donde se busca eficiencia energética total.",
    applications: [
      "Pasillos",
      "Estacionamientos",
      "Escuelas",
      "Patios",
      "Jardines",
      "Fachadas",
      "Espacios públicos",
      "Calles",
    ],
    specs: [
      { label: "Potencia", value: "125-200 W" },
      { label: "Temperatura color", value: "6,500 K" },
      { label: "Voltaje", value: "6 V CD" },
      { label: "Flujo luminoso", value: "8,750 lm" },
      { label: "Instalación", value: "Pared o poste" },
      { label: "Ángulo apertura", value: "120°" },
      { label: "Altura instalación", value: "4-5 m" },
      { label: "Tiempo de carga", value: "4-5 h" },
      { label: "Tiempo de descarga", value: "6-8 h" },
      { label: "Grado de protección", value: "IP65" },
    ],
    features: [
      "Panel solar inteligente",
      "Sin cableado eléctrico",
      "Autónomo",
      "Carga rápida",
    ],
    certifications: ["ISO 9001", "ISO 14001", "ISO 45001"],
  },
  {
    code: "IS-LS1004",
    name: "Suburbana 500W c/sensor",
    line: "IS",
    tags: ["solar", "vialidad"],
    tagline: "Sensor de movimiento inteligente",
    description:
      "Luminaria suburbana de 500 W con panel solar y sensor de movimiento inteligente. Optimiza el consumo iluminando al 100% solo cuando detecta presencia.",
    applications: [
      "Vialidades",
      "Caminos suburbanos",
      "Estacionamientos remotos",
    ],
    specs: [
      { label: "Potencia", value: "500 W" },
      { label: "Sensor", value: "Movimiento PIR" },
      { label: "Energía", value: "Solar autónomo" },
    ],
    features: [
      "Sensor de movimiento",
      "Atenuación inteligente",
      "Autonomía total",
    ],
  },
  {
    code: "IS-LA1005",
    name: "All in One — FORLED",
    line: "IS",
    tags: ["solar", "vialidad", "parques", "comercial"],
    tagline: "Luminaria autónoma solar de 80 / 100 W",
    description:
      "Luminaria autónoma solar All in One diseñada para alumbrado público, urbano, comercial e industrial. Compuesta por LEDs de alto desempeño, batería de litio especialmente desarrollada, panel de silicio monocristalino y regulador de carga. Sensores infrarrojos que aumentan flujo al detectar movimiento.",
    applications: [
      "Alumbrado público",
      "Zonas urbanas",
      "Comercial",
      "Industrial",
    ],
    specs: [
      { label: "Modelo", value: "L-34 80W / LZ 100W" },
      { label: "Tipo", value: "All in One" },
      { label: "Batería", value: "Litio especializada" },
      { label: "Panel", value: "Silicio monocristalino" },
      { label: "Sensor", value: "Infrarrojo (PIR)" },
      { label: "Autonomía", value: "10-12 h continuas" },
      { label: "Altura instalación", value: "6-10 m" },
      { label: "Montaje", value: "Punta de poste o brazo tipo L" },
    ],
    features: [
      "Sensor PIR de movimiento",
      "Atenuación inteligente",
      "Panel solar integrado",
      "Batería de litio",
      "Regulador de carga MPPT",
    ],
    warranty: "10 años luminaria · 5 años batería · 20 años panel",
  },
  {
    code: "IS-AD50",
    name: "AD-50W Vialidades",
    line: "IS",
    tags: ["solar", "vialidad"],
    tagline: "Certificada NOM-013-ENER · Resistente a 205 km/h",
    description:
      "Luminaria LED solar para vialidades AD-50W. Primera en obtener certificación NOM-013-ENER-2013. Iluminación al 100% durante toda la noche con controlador MPPT patentado.",
    applications: ["Vialidades urbanas", "Carreteras", "Avenidas principales"],
    specs: [
      { label: "Potencia", value: "50 W" },
      { label: "Eficacia LED", value: "190 lm/W" },
      { label: "Hermeticidad", value: "IP66" },
      { label: "Resistencia impacto", value: "IK10" },
      { label: "Resistencia al viento", value: "Hasta 205 km/h (huracán cat. 5)" },
      { label: "Batería", value: "3,000 ciclos · 16 años" },
      { label: "Controlador", value: "MPPT patentado" },
    ],
    features: [
      "Iluminación 100% toda la noche",
      "Sistema de gestión patentado",
      "Sin atenuación por 12 h",
      "Antivandálico",
      "Certificación NOM-013-ENER-2013",
    ],
    certifications: ["NOM-013-ENER-2013", "IP66", "IK10"],
    warranty: "10 años luminaria · 6 años batería",
  },
  {
    code: "IS-LA1007",
    name: "Suburbana Solar 300W",
    line: "IS",
    tags: ["solar", "vialidad"],
    tagline: "Luminaria suburbana solar all-in-one",
    description:
      "Luminaria autónoma solar suburbana de 300 W. Ideal para zonas suburbanas y rurales con alta demanda lumínica.",
    applications: ["Zonas suburbanas", "Caminos rurales", "Vialidades"],
    specs: [
      { label: "Potencia", value: "300 W" },
      { label: "Tipo", value: "All in One" },
    ],
    features: ["Sin red eléctrica", "Autonomía completa"],
    warranty: "3 años",
  },
  {
    code: "IS-LP1008",
    name: "Solar 180W / 240W con panel",
    line: "IS",
    tags: ["solar", "vialidad"],
    tagline: "Luminaria solar con panel separado",
    description:
      "Luminaria solar con panel separado, ideal para instalaciones donde se requiere posicionar el panel para óptima exposición solar.",
    applications: ["Vialidades", "Espacios públicos", "Áreas suburbanas"],
    specs: [
      { label: "Potencia", value: "180 / 240 W" },
      { label: "Flujo luminoso", value: "14,400 lm" },
      { label: "Temperatura color", value: "6,500 K" },
      { label: "Grado de protección", value: "IP66" },
      { label: "Tiempo carga", value: "8 h" },
    ],
    features: ["Panel solar separado", "Alta intensidad lumínica"],
  },

  // === LUMINARIOS URBANOS ===
  {
    code: "LU-BT1001",
    name: "Bolardo 120W",
    line: "LU",
    tags: ["parques", "decorativo"],
    tagline: "Bolardo cuadrado con 4 tubos LED",
    description:
      "Bolardo de 120 W con 4 tubos integrales LED de 30 W cada uno. Cuerpo PTR 4×4 con tapa triangular superior y luz indirecta.",
    applications: [
      "Jardines",
      "Calles",
      "Plazas",
      "Andadores",
      "Parques",
      "Avenidas",
      "Espacios urbanos",
    ],
    specs: [
      { label: "Potencia", value: "120 W (4×30 W)" },
      { label: "Eficiencia", value: "100 lm/W" },
      { label: "Vida útil", value: "25,000 h" },
      { label: "Temperatura color", value: "6,500 K" },
      { label: "Voltaje", value: "100/277 V" },
      { label: "Supresor de picos", value: "10 KV" },
      { label: "Material", value: "Lámina acero galv. cal. 18" },
    ],
    features: [
      "Tapa triangular con luz indirecta",
      "Logo personalizable por cliente",
      "Policarbonato opalino",
      "Pintura electrostática poliéster",
      "Anclas 3/4″ a 19 cm entre centros",
      "Luz RGB opcional",
    ],
  },
  {
    code: "LU-F4M1003",
    name: "Bolardo Solar 10W",
    line: "LU",
    tags: ["parques", "solar", "decorativo"],
    tagline: "Bolardo solar autónomo con acrílico",
    description:
      "Bolardo solar de 10 W. Fabricado en lámina galvanizada cal. 16, altura 80 cm, base 5″×5″. Acabado en pintura electrostática.",
    applications: ["Jardines", "Andadores", "Plazas residenciales"],
    specs: [
      { label: "Potencia", value: "10 W" },
      { label: "Energía", value: "Solar" },
      { label: "Material", value: "Lámina galvanizada cal. 16" },
      { label: "Altura", value: "80 cm" },
      { label: "Base", value: "5″ × 5″" },
    ],
    features: ["Solar autónomo", "Acrílico difusor", "Pintura electrostática"],
  },
  {
    code: "LU-LM1003",
    name: "Bolardo Montpellier",
    line: "LU",
    tags: ["parques", "decorativo"],
    tagline: "Diseño europeo en aluminio",
    description:
      "Bolardo Montpellier en aluminio con tubo de 4 o 6″ de diámetro. Acrílico opalino o transparente con acabado en pintura electrostática.",
    applications: [
      "Calles y avenidas",
      "Parques y jardines",
      "Cotos residenciales",
      "Áreas recreativas",
      "Universidades",
      "Andadores y patios",
    ],
    specs: [
      { label: "Material", value: "Aluminio" },
      { label: "Diámetro tubo", value: "4 o 6″" },
      { label: "Acrílico", value: "Opalino o transparente" },
    ],
    features: ["Placa base de aluminio", "Pintura electrostática"],
  },
  {
    code: "LU-LF1006",
    name: "Fornax",
    line: "LU",
    tags: ["parques", "decorativo"],
    tagline: "Luminaria urbana decorativa",
    description:
      "Luminaria Fornax para uso urbano decorativo. No compatible con sensores IR ni equipos con fotocelda.",
    applications: ["Parques", "Plazas", "Áreas peatonales"],
    specs: [{ label: "Tipo", value: "Decorativa" }],
    features: ["Diseño moderno", "Acabados premium"],
  },

  // === REFLECTORES ===
  {
    code: "RF-RE1003-300",
    name: "Reflector LED Estadio 300W",
    line: "RF",
    tags: ["industrial", "comercial"],
    tagline: "Alta potencia · SMD LED MZ-01V",
    description:
      "Reflector LED para estadios de alta potencia. Modelo MZ-01V con tecnología SMD LED para iluminación deportiva y áreas amplias.",
    applications: [
      "Estadios deportivos",
      "Canchas",
      "Áreas industriales",
      "Estacionamientos amplios",
    ],
    specs: [
      { label: "Potencia", value: "300 W" },
      { label: "Modelo", value: "MZ-01V" },
      { label: "Serie", value: "SMD LED" },
      { label: "Tipo", value: "Alta potencia" },
    ],
    features: ["Alta intensidad lumínica", "Larga distancia"],
  },
  {
    code: "RF-RE1003-400",
    name: "Reflector Plano 400W",
    line: "RF",
    tags: ["industrial", "comercial"],
    tagline: "Flood plano gris CW LED SMD",
    description:
      "Reflector plano de 400 W con LED SMD luz fría. Ideal para iluminación de fachadas, áreas industriales y estacionamientos.",
    applications: [
      "Fachadas",
      "Áreas industriales",
      "Estacionamientos",
      "Bodegas",
    ],
    specs: [
      { label: "Potencia", value: "400 W" },
      { label: "Tipo", value: "Plano gris" },
      { label: "Tecnología", value: "LED SMD" },
      { label: "Color", value: "CW (luz fría)" },
    ],
    features: ["Diseño plano", "LED SMD", "Acabado gris"],
  },
  {
    code: "RF-SC1001",
    name: "Reflector CPY",
    line: "RF",
    tags: ["industrial", "comercial", "tuneles"],
    tagline: "Series CPY · BetaLED® · NanoOptic®",
    description:
      "Series CPY con tecnología BetaLED® y NanoOptic®. Hecho en USA. Garantía de 10 años.",
    applications: [
      "Calles y avenidas",
      "Parques y jardines",
      "Plazas y explanadas",
      "Estacionamientos",
      "Cotos residenciales",
      "Áreas recreativas",
      "Universidades",
      "Centros comerciales",
    ],
    specs: [
      { label: "Tecnología", value: "BetaLED®" },
      { label: "Óptica", value: "NanoOptic®" },
      { label: "IRC", value: ">70" },
      { label: "Origen", value: "Hecho en USA" },
    ],
    features: ["BetaLED® patentado", "NanoOptic®", "10 años garantía"],
    warranty: "10 años",
  },

  // === LUMINARIOS COMERCIALES ===
  {
    code: "LC-GC1005",
    name: "GC11 Comodín bajo peralte",
    line: "LC",
    tags: ["comercial", "industrial"],
    tagline: "Luminario comercial de bajo peralte",
    description:
      "Luminario GC11 Comodín diseñado para espacios con bajo peralte. Lámina de acero rolada en frío con pintura electrostática blanca.",
    applications: [
      "Oficinas",
      "Locales comerciales",
      "Pasillos",
      "Áreas de baja altura",
    ],
    specs: [
      { label: "Material", value: "Acero rolado en frío" },
      { label: "Acabado", value: "Pintura electrostática blanca" },
      { label: "Secado", value: "Al horno" },
    ],
    features: ["Bajo peralte", "Acabado blanco", "Acero secado al horno"],
  },
  {
    code: "LC-GE1006",
    name: "GSMA Marco Abatible",
    line: "LC",
    tags: ["comercial"],
    tagline: "Marco abatible para fácil mantenimiento",
    description:
      "Luminario GSMA con marco abatible que facilita el mantenimiento de los componentes internos.",
    applications: ["Oficinas", "Tiendas", "Locales comerciales"],
    specs: [{ label: "Tipo", value: "Marco abatible" }],
    features: ["Mantenimiento fácil", "Marco abatible"],
  },
  {
    code: "LC-CD1007",
    name: "GC Canal Doble",
    line: "LC",
    tags: ["comercial", "industrial"],
    tagline: "Canal doble en acero rolado",
    description:
      "Luminario tipo canal doble en lámina de acero rolada en frío con pintura blanca electrostática secado al horno.",
    applications: ["Comercios", "Oficinas grandes", "Pasillos amplios"],
    specs: [{ label: "Tipo", value: "Canal doble" }],
    features: ["Doble canal", "Acero rolado", "Pintura blanca"],
  },
  {
    code: "LC-GEM1008",
    name: "GEMA Marco Abatible",
    line: "LC",
    tags: ["comercial"],
    tagline: "Variante GEMA con marco abatible",
    description:
      "Luminario GEMA con marco abatible, variante para espacios comerciales con mantenimiento ágil.",
    applications: ["Comercios", "Centros comerciales"],
    specs: [{ label: "Tipo", value: "Marco abatible GEMA" }],
    features: ["Marco abatible", "Mantenimiento simple"],
  },
  {
    code: "LC-ME1010",
    name: "GAME Malla Electrosoldada",
    line: "LC",
    tags: ["industrial", "comercial"],
    tagline: "Protección con malla electrosoldada",
    description:
      "Luminario GAME con protección de malla electrosoldada. Ideal para áreas industriales o donde se requiere protección antivandálica.",
    applications: ["Naves industriales", "Bodegas", "Talleres"],
    specs: [{ label: "Protección", value: "Malla electrosoldada" }],
    features: ["Antivandálico", "Robusto"],
  },
  {
    code: "LC-GIN1011",
    name: "GIN Industrial",
    line: "LC",
    tags: ["industrial"],
    tagline: "Luminario industrial robusto",
    description:
      "Luminario GIN industrial diseñado para naves, bodegas y plantas con altos requisitos de iluminación.",
    applications: ["Naves industriales", "Bodegas", "Plantas de producción"],
    specs: [{ label: "Tipo", value: "Industrial" }],
    features: ["Diseño industrial", "Alta resistencia"],
  },
  {
    code: "LC-GINH1012",
    name: "GINHB High Bay 3/4/6 lámparas",
    line: "LC",
    tags: ["industrial"],
    tagline: "Industrial High Bay con 3, 4 o 6 lámparas",
    description:
      "Campana industrial High Bay con configuración de 3, 4 o 6 lámparas. Ideal para naves industriales de gran altura.",
    applications: [
      "Naves industriales de gran altura",
      "Bodegas grandes",
      "Centros logísticos",
    ],
    specs: [
      { label: "Lámparas", value: "3, 4 o 6" },
      { label: "Tipo", value: "High Bay" },
    ],
    features: ["Gran altura", "Configurable", "Alta intensidad"],
  },
  {
    code: "LC-LR1013",
    name: "LR Troffers",
    line: "LC",
    tags: ["comercial"],
    tagline: "Troffers en poliéster reforzado",
    description:
      "Luminarios LR Troffers en poliéster reforzado y fibra de vidrio. Hechos en USA con 10 años de garantía.",
    applications: [
      "Andadores y pasillos",
      "Universidades",
      "Centros comerciales",
      "Oficinas",
    ],
    specs: [
      { label: "Material", value: "Poliéster reforzado y fibra de vidrio" },
      { label: "IRC", value: ">80" },
      { label: "Origen", value: "Hecho en USA" },
    ],
    features: ["Materiales premium", "Hecho en USA"],
    warranty: "10 años",
  },

  // === POSTES ===
  {
    code: "PT-RC",
    name: "Postes Rectos Circulares",
    line: "PT",
    tags: ["vialidad", "parques"],
    tagline: "Sección circular constante en todas las medidas",
    description:
      "Postes de sección circular constante para vialidades urbanas, parques y plazas. Disponibles en todas las medidas.",
    applications: ["Vialidades", "Parques", "Plazas", "Estacionamientos"],
    specs: [
      { label: "Sección", value: "Recto circular" },
      { label: "Alturas", value: "3 a 12 m" },
    ],
    features: ["Galvanizado en caliente", "Pintura electrostática"],
  },
  {
    code: "PT-CC",
    name: "Postes Cónicos Circulares",
    line: "PT",
    tags: ["vialidad", "parques"],
    tagline: "Perfil cónico para vialidades primarias",
    description:
      "Postes cónicos circulares con perfil continuo. Fabricados bajo norma para soportar cargas de viento extremas.",
    applications: ["Vialidades primarias", "Avenidas", "Carreteras"],
    specs: [
      { label: "Sección", value: "Cónico circular" },
      { label: "Alturas", value: "6, 9, 12 m" },
      { label: "Material", value: "Acero ASTM A572" },
    ],
    features: ["Cónico continuo", "Galvanizado en caliente"],
  },
  {
    code: "PT-ESP-CISNE",
    name: "Poste Cisne",
    line: "PT",
    tags: ["decorativo", "parques"],
    tagline: "Diseño tradicional · 1 o 2 brazos",
    description:
      "Poste especial Cisne con diseño tradicional ornamental. Disponible con uno o dos brazos.",
    applications: ["Plazas centrales", "Parques históricos", "Avenidas turísticas"],
    specs: [
      { label: "Brazos", value: "1 o 2" },
      { label: "Estilo", value: "Tradicional" },
    ],
    features: ["Diseño ornamental", "Configurable"],
  },
  {
    code: "PT-ESP-GAVIOTA",
    name: "Poste Gaviota",
    line: "PT",
    tags: ["decorativo", "parques"],
    tagline: "Diseño contemporáneo · 1 o 2 brazos",
    description:
      "Poste especial Gaviota con líneas contemporáneas. Disponible con uno o dos brazos.",
    applications: ["Plazas modernas", "Avenidas", "Centros urbanos"],
    specs: [{ label: "Brazos", value: "1 o 2" }],
    features: ["Diseño moderno"],
  },
  {
    code: "PT-ESP-QUERETARO",
    name: "Poste Querétaro",
    line: "PT",
    tags: ["decorativo", "parques"],
    tagline: "Estilo tradicional mexicano",
    description:
      "Poste estilo tradicional mexicano. Disponible con uno o dos brazos.",
    applications: ["Centros históricos", "Plazas tradicionales"],
    specs: [{ label: "Brazos", value: "1 o 2" }],
    features: ["Estilo colonial"],
  },
  {
    code: "PT-ESP-LONDON",
    name: "Poste London",
    line: "PT",
    tags: ["decorativo", "parques"],
    tagline: "Estilo londinense",
    description:
      "Poste estilo London con líneas clásicas inspiradas en el alumbrado europeo.",
    applications: ["Plazas turísticas", "Centros históricos"],
    specs: [{ label: "Estilo", value: "London" }],
    features: ["Diseño clásico europeo"],
  },
  {
    code: "PT-ESP-CORDOVA",
    name: "Poste Cordova",
    line: "PT",
    tags: ["decorativo"],
    tagline: "Diseño Cordova ornamental",
    description: "Poste ornamental estilo Cordova.",
    applications: ["Áreas decorativas"],
    specs: [{ label: "Estilo", value: "Cordova" }],
    features: ["Ornamental"],
  },

  // === BRAZOS Y HERRAJES ===
  {
    code: "AC-BAS-0010",
    name: "Base de concreto piramidal",
    line: "AC",
    tags: ["industrial"],
    tagline: "Base piramidal para luminarias",
    description:
      "Base de concreto piramidal para anclar luminarias y postes. Resistencia 200 kg/cm³ con tubo de 2″ lateral y 4″ central.",
    applications: ["Anclaje de postes", "Luminarias urbanas"],
    specs: [
      { label: "Resistencia", value: "200 kg/cm³" },
      { label: "Tubo central", value: "4″" },
      { label: "Tubo lateral", value: "2″" },
      { label: "Dimensiones", value: "60 × 40 cm" },
    ],
    features: ["Concreto reforzado", "Anclaje seguro"],
  },
  {
    code: "AC-BRAZO",
    name: "Brazos especiales",
    line: "AC",
    tags: ["decorativo", "vialidad"],
    tagline: "Brazo Centro Histórico, Vigilancia, Z, Matías Romero",
    description:
      "Línea completa de brazos especiales: Alerón, Canada, Cordova, Centro Histórico I y II, Vigilancia, Escuadra, Z, Matías Romero, Percha y galvanizado para poste de concreto.",
    applications: ["Postes urbanos", "Vialidades", "Plazas"],
    specs: [{ label: "Materiales", value: "Acero galvanizado" }],
    features: ["Diversos estilos", "Acabados a elección"],
  },
  {
    code: "AC-PICOBA-P01",
    name: "PICOBA P-01",
    line: "AC",
    tags: ["decorativo"],
    tagline: "Tubo de acero personalizado",
    description:
      "Picoba P-01 fabricada en acero personalizado para usos específicos.",
    applications: ["Soportes especiales"],
    specs: [{ label: "Material", value: "Acero personalizado" }],
    features: ["Personalizable"],
  },
  {
    code: "AC-PICOBA-P02",
    name: "PICOBA P-02",
    line: "AC",
    tags: ["decorativo"],
    tagline: "Tubo de acero 168.3 mm Ced.30",
    description:
      "Picoba P-02 con tubo de acero de 6.62″ de diámetro exterior (168.3 mm) cédula 30.",
    applications: ["Soportes industriales"],
    specs: [
      { label: "Diámetro exterior", value: "6.62″ (168.3 mm)" },
      { label: "Cédula", value: "30" },
    ],
    features: ["Robusto", "Personalizable"],
  },
];

export function getProductByCode(code: string): Product | undefined {
  return products.find((p) => p.code === code);
}

export function getProductsByLine(line: ProductLine): Product[] {
  return products.filter((p) => p.line === line);
}

export function getProductsByTag(tag: ProductTag): Product[] {
  return products.filter((p) => p.tags.includes(tag));
}

export function getAllCodes(): string[] {
  return products.map((p) => p.code);
}
