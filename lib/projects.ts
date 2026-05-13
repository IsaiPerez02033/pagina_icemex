export interface Project {
  slug: string;
  image: string; // ruta dentro de /public
  title: string;
  client: string;
  location: string;
  year: string;
  category: string;
  description: string;
  details: string;
  units?: string;
  productCode?: string;
}

export const projects: Project[] = [
  {
    slug: "vialidad-nocturna",
    image: "/proyectos/vialidad-nocturna.jpg",
    title: "Vialidad Nocturna Urbana",
    client: "Municipio Estado de México",
    location: "Estado de México",
    year: "2024",
    category: "Alumbrado urbano",
    description:
      "Hilera de postes torre con tira LED vertical en avenida residencial.",
    details:
      "Instalación de postes verticales con perfil rectangular y tira LED frontal de alta uniformidad. Diseño moderno con acabado mate negro y zonas de identificación cromática verde para señalización vial. Iluminación urbana sin deslumbramiento con bajo consumo energético.",
    units: "240 luminarias",
    productCode: "LU · Postes torre",
  },
  {
    slug: "fonatur-vialidad",
    image: "/proyectos/fonatur.jpg",
    title: "Corredor FONATUR",
    client: "FONATUR",
    location: "Corredor turístico nacional",
    year: "2023",
    category: "Vialidad turística",
    description:
      "Postes torre con tira LED frontal y branding FONATUR.",
    details:
      "Proyecto especial para el Fondo Nacional de Fomento al Turismo. Postes de perfil cuadrado con tira LED vertical iluminada y logo FONATUR integrado. Iluminación uniforme de avenida residencial-comercial con difusor opalino antideslumbrante.",
    units: "180 luminarias",
    productCode: "AL · LU custom",
  },
  {
    slug: "andador-gam",
    image: "/proyectos/andador-gam.jpg",
    title: "Andador GAM",
    client: "Alcaldía Gustavo A. Madero, CDMX",
    location: "CDMX, Gustavo A. Madero",
    year: "2025",
    category: "Iluminación peatonal",
    description:
      "Postes verticales con tira LED y branding GAM para andador del parque.",
    details:
      "Renovación de iluminación peatonal en andador con piso decorativo policromado. Postes circulares de 4m con tira LED vertical de 360° y emblema oficial. Tecnología LED de alto CRI para preservar la cromaticidad del entorno arbolado.",
    units: "96 postes",
    productCode: "LU · Bolardos urbanos",
  },
  {
    slug: "acolman-senaletica",
    image: "/proyectos/acolman.jpg",
    title: "Caminemos Seguras — Acolman",
    client: "Gobierno Municipal de Acolman 2025-2027",
    location: "Acolman, Estado de México",
    year: "2025",
    category: "Señalética municipal",
    description:
      "Señalética metálica corte láser para programa de seguridad.",
    details:
      "Pieza institucional fabricada bajo solicitud directa del Gobierno Municipal de Acolman. Lámina de acero color guinda con corte láser de tipografía y elementos gráficos del escudo municipal. Diseño coordinado con el programa Caminemos Seguras de seguridad ciudadana.",
    units: "Pieza por demanda",
    productCode: "AC · Señalética personalizada",
  },
  {
    slug: "vialidad-parque",
    image: "/proyectos/vialidad-parque.jpg",
    title: "Vialidad Interna de ASA Aeropuerto",
    client: "ASA Aeropuerto",
    location: "Ciudad de México",
    year: "2022",
    category: "Iluminación decorativa",
    description:
      "Luminarias tipo cerillo en curva de vialidad interna de parque.",
    details:
      "Iluminación decorativa con difusor esférico opalino para vialidad interna de centro deportivo arbolado. Luz blanca cálida con distribución uniforme y baja contaminación lumínica para zonas verdes.",
    units: "64 bolardos",
    productCode: "LU · LU-LM1003 Montpellier",
  },
  {
    slug: "corredor-solar",
    image: "/proyectos/corredor-solar.jpg",
    title: "Corredor Solar Carretero",
    client: "Obras Públicas estatales",
    location: "Estado de Hidalgo",
    year: "2024",
    category: "Solar vialidades",
    description:
      "Vialidad rural en construcción con luminarias LED solares 50W.",
    details:
      "Tramo carretero en construcción equipado con luminarias solares autónomas AD-50W certificadas NOM-013-ENER. Cada poste integra panel monocristalino, batería de litio de 3,000 ciclos y controlador MPPT patentado. Iluminación al 100% durante toda la noche sin conexión a red eléctrica.",
    units: "86 luminarias",
    productCode: "IS · AD-50W",
  },
  {
    slug: "solar-rural",
    image: "/proyectos/solar-rural.jpg",
    title: "Solar Autónomo Suburbano",
    client: "Comunidad rural",
    location: "Estado de México",
    year: "2021",
    category: "Solar autónomo",
    description:
      "Poste solar con panel monocristalino y caja de batería integrada.",
    details:
      "Solución llave en mano para iluminación de comunidad rural sin acceso a red eléctrica. Poste pintado en azul institucional con panel solar inclinado, caja de batería protegida y luminaria street-light LED. Diseñado para autonomía total durante toda la noche.",
    units: "12 sistemas",
    productCode: "IS · IS-LP1008",
  },
  {
    slug: "kia",
    image: "/proyectos/kia.jpg",
    title: "Concesionario KIA",
    client: "KIA Motors",
    location: "Ciudad de México",
    year: "2020",
    category: "Pieza personalizada",
    description:
      "Cubrebrida con logo KIA personalizado para exhibición exterior.",
    details:
      "Pieza decorativa custom para concesionario automotriz. Cubrebrida cónica de aluminio inyectado con logo KIA grabado en relieve y pintura electrostática blanca de alta resistencia UV. Acabado coordinado con la imagen corporativa de la marca.",
    units: "Pieza personalizada",
    productCode: "AC · Custom branding",
  },
  {
    slug: "postes-torre",
    image: "/proyectos/postes-torre.jpg",
    title: "Bolardo Triangular — Pre-entrega",
    client: "Proyecto turístico",
    location: "Taller ICEMEX",
    year: "2026",
    category: "Producción / Stock",
    description:
      "Lote de postes torre con tira LED listos para envío a obra.",
    details:
      "Producción terminada de postes verticales con perfil cuadrado, tira LED frontal de alta eficiencia y branding integrado. Acabado mate negro con pintura electrostática horneada. Stock listo para despacho a proyectos turísticos en proceso.",
    units: "38 unidades",
    productCode: "AL · Postes especiales",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
