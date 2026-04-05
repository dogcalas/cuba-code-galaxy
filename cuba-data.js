// Cuba Code Galaxy v2.5 — Base de datos enriquecida
// pushed_at = fecha de último push (determina distancia al sol: más reciente = más cercano)

const INITIAL_REPOS = [
  // ─── TypeScript ───────────────────────────────────────────────────────────
  { repo: "yossTheDev/removerized",        lang: "TypeScript", stars: 632, forks: 84,  pushed: "2026-03-27", desc: "AI Image Toolkit — free, private, offline-first" },
  { repo: "yossTheDev/karbonized",         lang: "TypeScript", stars: 119, forks: 12,  pushed: "2024-04-13", desc: "Image Generator for Code Snippets & Mockups" },
  { repo: "EduardoProfe666/une-unwrapped-habana", lang: "TypeScript", stars: 36, forks: 0, pushed: "2026-04-04", desc: "Resumen eléctrico de La Habana" },
  { repo: "yossTheDev/boostedpic",         lang: "TypeScript", stars: 61,  forks: 11,  pushed: "2024-05-18", desc: "Fast Image Optimization Tool for Web and Social Media" },
  { repo: "PushoDev/pushodev-portfolio",   lang: "TypeScript", stars: 29,  forks: 0,   pushed: "2026-03-23", desc: "Portfolio personal con diseño moderno" },
  { repo: "ragnarok22/tasa-cambio-proxy",  lang: "TypeScript", stars: 7,   forks: 0,   pushed: "2026-03-27", desc: "Proxy para tasas de cambio cubanas" },
  { repo: "leynier/ccst",                  lang: "TypeScript", stars: 7,   forks: 0,   pushed: "2026-01-17", desc: "Claude Code Switch Tools" },
  { repo: "leynier/git-fresh",             lang: "TypeScript", stars: 10,  forks: 0,   pushed: "2025-05-31", desc: "Reset Git working directory to clean state" },
  { repo: "yossTheDev/yearprogress",       lang: "TypeScript", stars: 9,   forks: 2,   pushed: "2024-04-19", desc: "Year Progress countdown app" },
  { repo: "yossTheDev/mathster",           lang: "TypeScript", stars: 5,   forks: 1,   pushed: "2023-01-04", desc: "Simple yet beautiful calculator app" },
  { repo: "yossTheDev/i18nizer",           lang: "TypeScript", stars: 5,   forks: 0,   pushed: "2026-01-21", desc: "CLI que extrae i18n strings de JSX/TSX" },
  { repo: "yossTheDev/organized-cli",      lang: "TypeScript", stars: 5,   forks: 0,   pushed: "2024-12-03", desc: "CLI para organizar archivos por tipo" },
  { repo: "yossTheDev/mots",               lang: "TypeScript", stars: 6,   forks: 0,   pushed: "2022-10-30", desc: "Static file hosting tool" },
  { repo: "rodnye/fb-revolico.inspector",  lang: "TypeScript", stars: 5,   forks: 1,   pushed: "2026-02-19", desc: "Inspector de grupos Facebook Revolico" },
  { repo: "rodnye/stdin-glob",             lang: "TypeScript", stars: 4,   forks: 1,   pushed: "2026-03-19", desc: "Glob CLI — pipe to other unix apps" },
  { repo: "vircoding/nuxt-authentication-starter-template", lang: "TypeScript", stars: 4, forks: 1, pushed: "2024-09-13", desc: "Full-stack Nuxt 3 authentication template" },
  { repo: "yossTheDev/devplace",           lang: "TypeScript", stars: 4,   forks: 0,   pushed: "2024-04-09", desc: "Directorio de recursos gratuitos para devs" },
  { repo: "yossTheDev/kubacash-service",   lang: "TypeScript", stars: 3,   forks: 0,   pushed: "2024-06-23", desc: "Notificaciones de tasas de cambio en Cuba" },
  { repo: "rodnye/kodekloud.inspector",    lang: "TypeScript", stars: 9,   forks: 2,   pushed: "2026-01-10", desc: "Inspector para cursos KodeKloud en Markdown" },
  { repo: "luiscib3r/LLM-Projects",        lang: "TypeScript", stars: 2,   forks: 1,   pushed: "2024-04-30", desc: "Colección de proyectos LLM" },

  // ─── Python ───────────────────────────────────────────────────────────────
  { repo: "atscub/nautapy",                lang: "Python",     stars: 41,  forks: 20,  pushed: "2023-07-21", desc: "API y CLI Python para el portal Nauta" },
  { repo: "yossTheDev/yala",              lang: "Python",     stars: 17,  forks: 1,   pushed: "2023-07-09", desc: "TUI Package Manager para Arch Linux" },
  { repo: "adbenitez/todus",              lang: "Python",     stars: 14,  forks: 7,   pushed: "2021-10-01", desc: "Cliente CLI de ToDus y API Python" },
  { repo: "matcom/codex",                lang: "Python",     stars: 14,  forks: 2,   pushed: "2026-03-09", desc: "Implementaciones Python de algoritmos" },
  { repo: "covid19cuba/covid19cuba-action",lang: "Python",    stars: 13,  forks: 9,   pushed: "2025-06-09", desc: "GitHub Action del proyecto Covid19 Cuba" },
  { repo: "KeimaSenpai/xcu",             lang: "Python",     stars: 12,  forks: 0,   pushed: "2025-06-13", desc: "Wrapper de pip para PyPI Cuba" },
  { repo: "leynier/mcp-sys-bridge",      lang: "Python",     stars: 10,  forks: 4,   pushed: "2025-11-16", desc: "Bridge MCP a funciones nativas del SO" },
  { repo: "suitetecsa/suitetecsa-sdk-python", lang: "Python", stars: 7, forks: 2,   pushed: "2026-03-28", desc: "API para servicios web de ETECSA" },
  { repo: "kurosaki1976/qrbar-code-generator", lang: "Python", stars: 6, forks: 0,  pushed: "2019-11-17", desc: "Generador de códigos QR y de barras" },
  { repo: "LFrench03/Ganaderia-en-Cuba",  lang: "Python",     stars: 6,   forks: 2,   pushed: "2024-10-13", desc: "Análisis de datos ganaderos cubanos" },
  { repo: "matcom/gym",                  lang: "Python",     stars: 6,   forks: 22,  pushed: "2026-03-29", desc: "Gym de programación para MatCom" },
  { repo: "codestrange/egresocovid19-server", lang: "Python", stars: 4,   forks: 3,   pushed: "2026-04-03", desc: "Servidor FastAPI para datos Covid19" },
  { repo: "adbenitez/simplebot_manga",   lang: "Python",     stars: 4,   forks: 1,   pushed: "2023-11-17", desc: "Leer manga en Delta Chat" },
  { repo: "matcom/adminbot",             lang: "Python",     stars: 3,   forks: 0,   pushed: "2024-01-01", desc: "Bot admin para comunidad MatCom" },
  { repo: "apiad/tesserax",              lang: "Python",     stars: 19,  forks: 2,   pushed: "2026-03-30", desc: "Librería de visualización científica SVG" },
  { repo: "apiad/opencode",              lang: "Python",     stars: 19,  forks: 4,   pushed: "2026-04-02", desc: "Setup AI-powered de repositorios" },
  { repo: "Mirage-Tech-Cuba/django-l10n-cu", lang: "Python", stars: 8,   forks: 1,   pushed: "2022-04-27", desc: "Localización Django para mercado cubano" },
  { repo: "nikofabelo/nauta-py",         lang: "Python",     stars: 5,   forks: 2,   pushed: "2024-12-21", desc: "Interfaz Python para el portal Nauta" },
  { repo: "LFrench03/Sudokus",           lang: "Python",     stars: 5,   forks: 0,   pushed: "2024-06-01", desc: "Solver de Sudoku — soluciones LeetCode" },
  { repo: "LFrench03/La-Perla-del-Sur",  lang: "Python",     stars: 3,   forks: 0,   pushed: "2024-10-01", desc: "Análisis de migración en Cienfuegos" },

  // ─── Dart / Flutter ───────────────────────────────────────────────────────
  { repo: "covid19cuba/covid19cuba-app",  lang: "Dart",       stars: 46,  forks: 16,  pushed: "2020-09-04", desc: "App Flutter para datos Covid19 Cuba" },
  { repo: "fluttercuba/apklis-dart-flutter", lang: "Dart",   stars: 14,  forks: 5,   pushed: "2022-02-24", desc: "Paquetes Flutter para la tienda Apklis" },
  { repo: "luiscib3r/todo",              lang: "Dart",       stars: 8,   forks: 7,   pushed: "2021-10-25", desc: "App auxiliar para servicios ETECSA" },
  { repo: "NODO-UH/gestionapp",          lang: "Dart",       stars: 6,   forks: 3,   pushed: "2021-04-27", desc: "App de gestión electrónica en la UH" },
  { repo: "luiscib3r/mixter",            lang: "Dart",       stars: 6,   forks: 0,   pushed: "2024-10-25", desc: "App tipo ChatGPT para probar modelos LLM" },
  { repo: "luiscib3r/flama",             lang: "Dart",       stars: 5,   forks: 0,   pushed: "2024-03-15", desc: "Paquete Flutter para LLMs vía llama.cpp" },
  { repo: "codestrange/egresocovid19-app", lang: "Dart",     stars: 5,   forks: 2,   pushed: "2022-08-27", desc: "App móvil de gestión de egresados Covid19" },
  { repo: "leynier/cubaopenplay-app",    lang: "Dart",       stars: 4,   forks: 0,   pushed: "2023-06-01", desc: "Cliente de la tienda Apklis" },
  { repo: "leynier/remend",              lang: "Dart",       stars: 2,   forks: 0,   pushed: "2026-04-02", desc: "Dart port de remend — markdown auto-reparado" },
  { repo: "alejandrogiubel/transfermovil", lang: "Dart",    stars: 10,  forks: 4,   pushed: "2022-09-14", desc: "App auxiliar para Transfermóvil" },

  // ─── Go ───────────────────────────────────────────────────────────────────
  { repo: "jadolg/DockerImageSave",      lang: "Go",         stars: 92,  forks: 12,  pushed: "2026-03-30", desc: "Descarga imágenes Docker sin Docker daemon" },
  { repo: "NODO-UH/quota-scraper",       lang: "Go",         stars: 3,   forks: 0,   pushed: "2021-04-24", desc: "Parser en tiempo real de logs Squid" },
  { repo: "NODO-UH/uh-email-quota",      lang: "Go",         stars: 2,   forks: 0,   pushed: "2021-03-01", desc: "Servicio de cuota de email UH" },
  { repo: "kenriortega/client-go",       lang: "Go",         stars: 2,   forks: 0,   pushed: "2022-06-01", desc: "Cliente Go para la API de QvaPay" },

  // ─── Kotlin ───────────────────────────────────────────────────────────────
  { repo: "jdsdhp/gallery-droid",        lang: "Kotlin",     stars: 15,  forks: 5,   pushed: "2021-01-17", desc: "Componente Android Gallery con Picasso" },
  { repo: "lesclaz/selibrary",           lang: "Kotlin",     stars: 10,  forks: 0,   pushed: "2022-05-07", desc: "Librería Android para gestión de cursos" },
  { repo: "jdsdhp/enzona-payment-embedded", lang: "Kotlin",  stars: 7,   forks: 1,   pushed: "2024-01-29", desc: "Librería Kotlin para pagos Enzona" },
  { repo: "suitetecsa/suitetecsa-sdk-kotlin", lang: "Kotlin", stars: 6, forks: 1,   pushed: "2024-07-15", desc: "SDK ETECSA para Kotlin" },
  { repo: "jdsdhp/crash-reporter",       lang: "Kotlin",     stars: 5,   forks: 2,   pushed: "2021-01-09", desc: "Reportador de crashes Android" },
  { repo: "jdsdhp/pictish",             lang: "Kotlin",     stars: 6,   forks: 1,   pushed: "2022-01-01", desc: "Precarga de imágenes Android con Blur" },
  { repo: "jdsdhp/farmakit_app",         lang: "Kotlin",     stars: 3,   forks: 1,   pushed: "2023-01-01", desc: "App de inventario de farmacia" },
  { repo: "suitetecsa/sdk-android",      lang: "Kotlin",     stars: 3,   forks: 0,   pushed: "2024-03-01", desc: "Librería Android para servicios ETECSA" },

  // ─── JavaScript ───────────────────────────────────────────────────────────
  { repo: "covid19cuba/covid19cubadata.github.io", lang: "JavaScript", stars: 15, forks: 1, pushed: "2021-06-01", desc: "Dashboard de datos Covid19 Cuba" },
  { repo: "luiscib3r/style_transfer",    lang: "JavaScript", stars: 10,  forks: 2,   pushed: "2024-10-25", desc: "Style Transfer con modelos de Google AI" },
  { repo: "CuCodersCommunity/cucoders-backend", lang: "JavaScript", stars: 10, forks: 1, pushed: "2025-12-30", desc: "Backend serverless de CuCoders" },
  { repo: "CuCodersCommunity/cascarilla.js", lang: "JavaScript", stars: 7, forks: 0, pushed: "2025-12-19", desc: "Librería de buenas vibras para tu web" },
  { repo: "CuCodersCommunity/members-api", lang: "JavaScript", stars: 7, forks: 0, pushed: "2024-06-01", desc: "API de miembros de CuCoders" },
  { repo: "n3omaster/cambiocup",          lang: "JavaScript", stars: 4,   forks: 2,   pushed: "2026-04-02", desc: "Tasas CUP/MLC en tiempo real" },
  { repo: "geidelguerra/nauta-cli",       lang: "JavaScript", stars: 4,   forks: 2,   pushed: "2022-05-26", desc: "CLI para el portal Nauta en Node.js" },
  { repo: "EduardoProfe666/sudoku-play",  lang: "JavaScript", stars: 9,   forks: 1,   pushed: "2024-06-01", desc: "Sudoku PWA — juega en el navegador" },
  { repo: "vircoding/sigma-api",          lang: "JavaScript", stars: 2,   forks: 0,   pushed: "2024-04-30", desc: "API REST del proyecto Sigma" },

  // ─── Astro ────────────────────────────────────────────────────────────────
  { repo: "CuCodersCommunity/cucoderscommunity.github.io", lang: "Astro", stars: 64, forks: 62, pushed: "2026-04-01", desc: "CuCoders — plataforma de programadores cubanos" },
  { repo: "CuCodersCommunity/cucoder-dev-talks", lang: "Astro", stars: 6, forks: 1, pushed: "2025-03-01", desc: "Podcast de programación y emprendimiento" },
  { repo: "CuCodersCommunity/cascarilla.js-website", lang: "Astro", stars: 4, forks: 1, pushed: "2024-11-01", desc: "Sitio oficial de Cascarilla.js" },
  { repo: "rodnye/literary-blog",         lang: "Astro",      stars: 5,   forks: 0,   pushed: "2026-03-08", desc: "Blog literario con persistencia en GitHub" },

  // ─── Shell ────────────────────────────────────────────────────────────────
  { repo: "apiad/opencode",              lang: "Shell",      stars: 19,  forks: 4,   pushed: "2026-04-02", desc: "Setup AI-powered de repositorios" },
  { repo: "dnielpy/gh-activity-viewer",  lang: "Shell",      stars: 6,   forks: 0,   pushed: "2025-05-23", desc: "Mapa de calor de GitHub en el terminal" },
  { repo: "pavelmc/amake",               lang: "Shell",      stars: 39,  forks: 9,   pushed: "2020-11-09", desc: "CLI simple de Arduino para Linux" },

  // ─── C++ ──────────────────────────────────────────────────────────────────
  { repo: "pavelmc/Si5351mcu",           lang: "C++",        stars: 70,  forks: 28,  pushed: "2022-03-22", desc: "Librería Arduino Si5351 — sin clicks" },
  { repo: "pavelmc/FT857d",              lang: "C++",        stars: 48,  forks: 17,  pushed: "2023-08-29", desc: "Soporte CAT para Arduino — Yaesu FT-857D" },
  { repo: "pavelmc/carrito",             lang: "C++",        stars: 9,   forks: 0,   pushed: "2021-05-01", desc: "Auto controlado por Arduino — DIY robótica" },
  { repo: "pavelmc/BMux",                lang: "C++",        stars: 9,   forks: 0,   pushed: "2021-05-01", desc: "Multiplexor de botones analógicos" },
  { repo: "pavelmc/Yatuli",              lang: "C++",        stars: 7,   forks: 0,   pushed: "2021-03-01", desc: "Librería de sintonía con encoder rotatorio" },
  { repo: "pavelmc/instrument",          lang: "C++",        stars: 6,   forks: 0,   pushed: "2022-01-01", desc: "Multiinstrumento RF: generador, medidor" },
  { repo: "pavelmc/carrito-control",     lang: "C++",        stars: 6,   forks: 0,   pushed: "2021-05-01", desc: "Control remoto para el auto Arduino" },
  { repo: "pavelmc/stepperUnipolar",     lang: "C++",        stars: 4,   forks: 2,   pushed: "2020-11-01", desc: "Librería non-blocking para motores unipolares" },

  // ─── Swift ────────────────────────────────────────────────────────────────
  { repo: "ragnarok22/ChimeDock",        lang: "Swift",      stars: 5,   forks: 1,   pushed: "2026-02-12", desc: "App macOS — chime cuando conectas USB" },
  { repo: "suitetecsa/sdk-swift",        lang: "Swift",      stars: 3,   forks: 2,   pushed: "2026-04-01", desc: "SuitETECSA SDK escrito en Swift" },

  // ─── Rust ─────────────────────────────────────────────────────────────────
  { repo: "kenriortega/flb_filter_iis",  lang: "Rust",       stars: 4,   forks: 0,   pushed: "2022-09-01", desc: "Filtro FluentBit para logs IIS vía WASM" },
  { repo: "kenriortega/exporter-rs",     lang: "Rust",       stars: 2,   forks: 0,   pushed: "2022-06-01", desc: "Colector y parser de logs — PoC en Rust" },

  // ─── HTML ─────────────────────────────────────────────────────────────────
  { repo: "matcom/matcom.github.io",     lang: "HTML",       stars: 16,  forks: 5,   pushed: "2024-01-01", desc: "Sitio web de la Facultad MatCom — UH" },
  { repo: "LFrench03/ganaderia_cuba.github.io", lang: "HTML", stars: 3, forks: 0,   pushed: "2024-10-01", desc: "Web de datos pecuarios cubanos" },

  // ─── Vue ──────────────────────────────────────────────────────────────────
  { repo: "yossTheDev/prossa",           lang: "Vue",        stars: 29,  forks: 5,   pushed: "2023-12-01", desc: "Lector de Ebooks basado en web" },
  { repo: "leynier/depatrack",           lang: "Vue",        stars: 2,   forks: 0,   pushed: "2025-01-01", desc: "Rastreador de prospectos de alquiler" },
  { repo: "rodnye/cafe-ipv",             lang: "Vue",        stars: 2,   forks: 0,   pushed: "2024-03-01", desc: "Control de productos y pedidos web/Android" },

  // ─── Java ─────────────────────────────────────────────────────────────────
  { repo: "jr20xx/JCalc",                lang: "Java",       stars: 8,   forks: 0,   pushed: "2024-12-01", desc: "Librería Java para evaluar expresiones matemáticas" },
  { repo: "garciaguimeras/jnauta",       lang: "Java",       stars: 4,   forks: 2,   pushed: "2022-03-01", desc: "Interfaz Java para el portal Nauta" },

  // ─── C# ───────────────────────────────────────────────────────────────────
  { repo: "dnielpy/Moogle",              lang: "C#",         stars: 5,   forks: 0,   pushed: "2024-01-05", desc: "Motor de búsqueda con TF-IDF y álgebra lineal" },

  // ─── Perl ─────────────────────────────────────────────────────────────────
  { repo: "pavelmc/sof1u",               lang: "Perl",       stars: 8,   forks: 1,   pushed: "2022-01-01", desc: "ScrollOutF1 Email Gateway para Ubuntu/Debian" },

  // ─── Jupyter Notebook ────────────────────────────────────────────────────
  { repo: "LFrench03/Modelo-de-Crecimiento-Poblacional", lang: "Jupyter Notebook", stars: 4, forks: 0, pushed: "2024-10-14", desc: "Modelo predictivo de crecimiento poblacional" },
  { repo: "matcom/metaheuristics",       lang: "Jupyter Notebook", stars: 15, forks: 4, pushed: "2023-07-07", desc: "Curso de metaheurísticas — nivel graduate" },

  // ─── TeX ─────────────────────────────────────────────────────────────────
  { repo: "matcom/dm",                   lang: "TeX",        stars: 50,  forks: 7,   pushed: "2026-01-28", desc: "Notas de Matemática Discreta I y II" },
  { repo: "LFrench03/Analisis-Exploratorios", lang: "TeX",   stars: 3,   forks: 0,   pushed: "2024-06-01", desc: "Análisis exploratorios de datos" },
  { repo: "codestrange/ehealthkd_report", lang: "TeX",       stars: 4,   forks: 0,   pushed: "2021-06-01", desc: "Reporte del desafío eHealth-KD" },

  // ─── Haskell ─────────────────────────────────────────────────────────────
  { repo: "codestrange/declarative-programing-hidato-project", lang: "Haskell", stars: 4, forks: 0, pushed: "2020-06-01", desc: "Solver del puzzle Hidato — programación declarativa" },

  // ─── Svelte ───────────────────────────────────────────────────────────────
  { repo: "yossTheDev/gh-stats",         lang: "Svelte",     stars: 2,   forks: 0,   pushed: "2024-09-01", desc: "Stats de releases de repos GitHub" },

  // ─── Markdown ────────────────────────────────────────────────────────────
  { repo: "cuban-opensourcers/cuban-opensource", lang: "Markdown", stars: 197, forks: 57, pushed: "2024-02-10", desc: "Lista de proyectos cubanos open source" },
  { repo: "cuban-opensourcers/cuban-restricted", lang: "Markdown", stars: 75, forks: 25, pushed: "2025-04-26", desc: "Sitios y servicios tech restringidos en Cuba" },
  { repo: "kenriortega/servicios-api-cuba", lang: "Markdown", stars: 19, forks: 4, pushed: "2022-09-01", desc: "Lista de APIs REST públicas disponibles en Cuba" },
  { repo: "kurosaki1976/lets-encrypt-acme", lang: "Markdown", stars: 14, forks: 2, pushed: "2021-03-01", desc: "Guía de certificados Let's Encrypt" },
  { repo: "kurosaki1976/bind9-views",     lang: "Markdown",  stars: 6,   forks: 2,   pushed: "2020-06-01", desc: "DNS Bind9 con views — guía sysadmin" },
  { repo: "kurosaki1976/vyos-virtual-router", lang: "Markdown", stars: 5, forks: 6, pushed: "2021-01-01", desc: "Router virtual VyOS en Proxmox" },
  { repo: "kurosaki1976/bind9-delegated-zones", lang: "Markdown", stars: 6, forks: 0, pushed: "2020-04-01", desc: "Configuración de zonas delegadas Bind9" },
];

// ─── Usuarios cubanos destacados (Asteroides de la galaxia) ───────────────
const CUBAN_DEVS = [
  { login: "apiad",          name: "Alejandro Piad",        followers: 429, repos: 90,  bio: "Prof. en MatCom UH · PhD Computer Science · IA y ML" },
  { login: "leynier",        name: "Leynier Gutiérrez",     followers: 282, repos: 157, bio: "Co-Founder bagplanner.com · CTO @educup · MatCom grad" },
  { login: "matcom",         name: "MatCom — UH",           followers: 237, repos: 61,  bio: "Facultad de Matemática y Computación, Univ. de La Habana" },
  { login: "jadolg",         name: "Jorge Díaz (Akiel)",    followers: 186, repos: 123, bio: "Containers whisperer · VPNs y libertad online" },
  { login: "LFrench03",      name: "Luis Ernesto",          followers: 136, repos: 10,  bio: "Ciencia de datos · Modus Ponens" },
  { login: "rodnye",         name: "Rodny Estrada",         followers: 120, repos: 88,  bio: "Full-stack developer" },
  { login: "ragnarok22",     name: "Reinier Hernández",     followers: 110, repos: 106, bio: "Build tools · lives inside the terminal" },
  { login: "luiscib3r",      name: "Luis Correa",           followers: 103, repos: 76,  bio: "Computer Scientist & Software Engineer" },
  { login: "vircoding",      name: "Luis Miguel Navarro",   followers: 108, repos: 35,  bio: "Full-stack developer" },
  { login: "kenriortega",    name: "Kenrique Ortega",       followers: 74,  repos: 147, bio: "DevOps/Data Engineer · open source contributor" },
  { login: "dnielpy",        name: "Daniel Quesada",        followers: 72,  repos: 6,   bio: "Estudiante de Ing. Software y YouTuber" },
  { login: "yossTheDev",     name: "Yoannis Sánchez",       followers: 69,  repos: 36,  bio: "Full-stack Freelance · Next.js · TypeScript · Tailwind" },
  { login: "EduardoProfe666", name: "Eduardo González",     followers: 66,  repos: 67,  bio: "Software Engineer · Web Development" },
  { login: "pavelmc",        name: "Pavel Milanes",         followers: 39,  repos: 16,  bio: "SysAdmin desde 1998 · Radio amateur · FLOSS contributor" },
  { login: "jdsdhp",         name: "jesusd0897",            followers: 13,  repos: 10,  bio: "Android Developer" },
];

// ─── Colores por lenguaje (soles) ────────────────────────────────────────
const LANGUAGE_COLORS = {
  "TypeScript":       "#3178c6",
  "Python":           "#f7cc42",
  "Dart":             "#00b4ab",
  "Go":               "#00add8",
  "Kotlin":           "#7f52ff",
  "JavaScript":       "#f0db4f",
  "Astro":            "#ff5d01",
  "Shell":            "#89e051",
  "C++":              "#f34b7d",
  "Swift":            "#fa7343",
  "Rust":             "#ce422b",
  "HTML":             "#e34c26",
  "Svelte":           "#ff3e00",
  "Vue":              "#42b883",
  "Java":             "#b07219",
  "C#":               "#178600",
  "Perl":             "#0298c3",
  "Jupyter Notebook": "#da5b0b",
  "TeX":              "#3d6117",
  "Haskell":          "#5e5086",
  "Markdown":         "#083fa1",
  "PHP":              "#8892bf",
  "CSS":              "#563d7c",
};

// ─── Paleta de colores únicos para planetas ───────────────────────────────
// Se asignan secuencialmente dentro de cada sistema solar
const PLANET_PALETTES = {
  "TypeScript": ["#4a9eff","#7cb8ff","#b8d4ff","#2d7dd2","#1a6fc4","#5bc0eb","#9cd8ff","#3a8fd1","#6aaed6","#8ecae6","#2196F3","#64b5f6","#1565c0","#42a5f5","#1976d2","#2979ff","#1e88e5","#0d47a1","#1565c0","#5c6bc0"],
  "Python":     ["#ffd43b","#ffe566","#ffc107","#ffb300","#ff8f00","#e6a817","#f9c74f","#f8961e","#f3722c","#f94144","#ffd166","#ffb347","#ffa500","#ff8c00","#ff7043","#ffa726","#fb8c00","#e65100","#ffcc02","#fdd835"],
  "Dart":       ["#00bcd4","#26c6da","#00acc1","#0097a7","#80deea","#4dd0e1","#00e5ff","#18ffff","#84ffff","#e0f7fa","#00b4ab","#00838f","#006064","#00bfa5","#1de9b6","#64ffda","#a7ffeb","#0097a7","#00b4ab","#26a69a"],
  "Go":         ["#29b6f6","#039be5","#0288d1","#0277bd","#01579b","#4fc3f7","#81d4fa","#b3e5fc","#e1f5fe","#80d8ff","#40c4ff","#0091ea","#00b0ff","#2196f3","#1976d2","#1565c0","#0d47a1","#448aff","#2979ff","#2962ff"],
  "Kotlin":     ["#b39ddb","#9575cd","#7e57c2","#673ab7","#5e35b1","#512da8","#4527a0","#311b92","#d1c4e9","#ede7f6","#ce93d8","#ba68c8","#ab47bc","#9c27b0","#8e24aa","#7b1fa2","#6a1b9a","#4a148c","#ea80fc","#e040fb"],
  "JavaScript": ["#fff176","#fff59d","#fff9c4","#ffee58","#fdd835","#fbc02d","#f9a825","#f57f17","#ffca28","#ffc107","#ffb300","#ffa000","#ff8f00","#ff6f00","#ffe082","#ffecb3","#fff8e1","#ffab40","#ff9100","#ff6d00"],
  "Astro":      ["#ff7043","#ff5722","#f4511e","#e64a19","#d84315","#bf360c","#ff8a65","#ff7043","#ff6e40","#ff3d00","#ffab91","#ff8a65","#ff7043","#ff5722","#f4511e","#e64a19","#d84315","#bf360c","#ff6e40","#ff3d00"],
  "Shell":      ["#a5d6a7","#81c784","#66bb6a","#4caf50","#43a047","#388e3c","#2e7d32","#1b5e20","#c8e6c9","#e8f5e9","#b9f6ca","#69f0ae","#00e676","#00c853","#76ff03","#64dd17","#aeea00","#c6ff00","#f4ff81","#f9fbe7"],
  "C++":        ["#ef5350","#e53935","#d32f2f","#c62828","#b71c1c","#ff5252","#ff1744","#d50000","#ff6b6b","#ff8e8e","#ef9a9a","#ef5350","#e53935","#d32f2f","#c62828","#b71c1c","#f44336","#e91e63","#ff4081","#f50057"],
  "Swift":      ["#ffb74d","#ffa726","#ff9800","#fb8c00","#f57c00","#ef6c00","#e65100","#ffc947","#ffb300","#ffa000","#ff8f00","#ff6f00","#ffe57f","#ffd740","#ffc400","#ffab00","#ff8f00","#ff6d00","#ff3d00","#dd2c00"],
  "Rust":       ["#ff7961","#cf6679","#c62828","#9f0000","#b71c1c","#d32f2f","#e53935","#f44336","#ef5350","#e57373","#ef9a9a","#ffcdd2","#ff8a80","#ff5252","#ff1744","#d50000","#c62828","#b71c1c","#8d0000","#6d0000"],
  "HTML":       ["#ff7043","#ff5722","#f4511e","#e64a19","#d84315","#bf360c","#ff8a65","#ff7043","#ff3d00","#dd2c00","#ffab91","#ff8a65","#ff7043","#ff5722","#f4511e","#e64a19","#d84315","#bf360c","#ff6e40","#ff3d00"],
  "Vue":        ["#66bb6a","#4caf50","#43a047","#388e3c","#2e7d32","#a5d6a7","#81c784","#69f0ae","#00e676","#1de9b6","#b9f6ca","#00c853","#64dd17","#76ff03","#aeea00","#c6ff00","#ccff90","#b9f6ca","#a5d6a7","#81c784"],
  "Java":       ["#a1887f","#8d6e63","#795548","#6d4c41","#5d4037","#4e342e","#3e2723","#bcaaa4","#d7ccc8","#efebe9","#ff8a65","#ff7043","#ff5722","#f4511e","#e64a19","#d84315","#bf360c","#8d6e63","#795548","#6d4c41"],
  "C#":         ["#4db6ac","#26a69a","#009688","#00897b","#00796b","#00695c","#004d40","#84ffff","#64ffda","#1de9b6","#a7ffeb","#00bfa5","#00b4ab","#00838f","#006064","#b2dfdb","#80cbc4","#4db6ac","#26a69a","#009688"],
  "Perl":       ["#29b6f6","#039be5","#0288d1","#01579b","#4fc3f7","#81d4fa","#b3e5fc","#e1f5fe","#80d8ff","#40c4ff","#00b0ff","#0091ea","#2196f3","#1976d2","#1565c0","#0d47a1","#82b1ff","#448aff","#2979ff","#2962ff"],
  "Jupyter Notebook": ["#ff9800","#f57c00","#ef6c00","#e65100","#ffb74d","#ffa726","#fb8c00","#ffc947","#ffb300","#ffa000","#ff8f00","#ff6f00","#ffe57f","#ffd740","#ffc400","#ffab00","#ff8f00","#ff6d00","#ff3d00","#dd2c00"],
  "TeX":        ["#a5d6a7","#81c784","#66bb6a","#4caf50","#43a047","#388e3c","#2e7d32","#1b5e20","#b9f6ca","#69f0ae","#00e676","#00c853","#76ff03","#64dd17","#aeea00","#c6ff00","#ccff90","#b9f6ca","#a5d6a7","#81c784"],
  "Haskell":    ["#9c27b0","#8e24aa","#7b1fa2","#6a1b9a","#4a148c","#ce93d8","#ba68c8","#ab47bc","#b39ddb","#9575cd","#7e57c2","#673ab7","#5e35b1","#512da8","#4527a0","#311b92","#d1c4e9","#ede7f6","#e040fb","#ea80fc"],
  "Svelte":     ["#ff7043","#ff5722","#f4511e","#e64a19","#d84315","#bf360c","#ff8a65","#ff3d00","#dd2c00","#ff6e40","#ffab91","#ff8a65","#ff7043","#ff5722","#f4511e","#e64a19","#d84315","#bf360c","#ff6e40","#ff3d00"],
  "Markdown":   ["#5c6bc0","#3f51b5","#3949ab","#303f9f","#283593","#1a237e","#7986cb","#9fa8da","#c5cae9","#e8eaf6","#536dfe","#3d5afe","#304ffe","#82b1ff","#448aff","#2979ff","#2962ff","#5c6bc0","#3f51b5","#3949ab"],
};

window.CUBA_REPOS = INITIAL_REPOS;
window.CUBAN_DEVS = CUBAN_DEVS;
window.LANGUAGE_COLORS = LANGUAGE_COLORS;
window.PLANET_PALETTES = PLANET_PALETTES;

// ─── Mapa repo → usuario owner (para lunas) ──────────────────────────────
// Cada repo tiene exactamente su owner como luna principal
// Si el owner tiene followers altos, la luna es más grande
const REPO_OWNER_MAP = {
  // TypeScript
  "yossTheDev/removerized":          "yossTheDev",
  "yossTheDev/karbonized":           "yossTheDev",
  "EduardoProfe666/une-unwrapped-habana": "EduardoProfe666",
  "yossTheDev/boostedpic":           "yossTheDev",
  "PushoDev/pushodev-portfolio":     "PushoDev",
  "ragnarok22/tasa-cambio-proxy":    "ragnarok22",
  "leynier/ccst":                    "leynier",
  "leynier/git-fresh":               "leynier",
  "yossTheDev/yearprogress":         "yossTheDev",
  "yossTheDev/mathster":             "yossTheDev",
  "yossTheDev/i18nizer":             "yossTheDev",
  "yossTheDev/organized-cli":        "yossTheDev",
  "yossTheDev/mots":                 "yossTheDev",
  "rodnye/fb-revolico.inspector":    "rodnye",
  "rodnye/stdin-glob":               "rodnye",
  "vircoding/nuxt-authentication-starter-template": "vircoding",
  "yossTheDev/devplace":             "yossTheDev",
  "yossTheDev/kubacash-service":     "yossTheDev",
  "rodnye/kodekloud.inspector":      "rodnye",
  "luiscib3r/LLM-Projects":          "luiscib3r",
  // Python
  "atscub/nautapy":                  "atscub",
  "yossTheDev/yala":                 "yossTheDev",
  "adbenitez/todus":                 "adbenitez",
  "matcom/codex":                    "matcom",
  "covid19cuba/covid19cuba-action":  "covid19cuba",
  "KeimaSenpai/xcu":                 "KeimaSenpai",
  "leynier/mcp-sys-bridge":          "leynier",
  "suitetecsa/suitetecsa-sdk-python":"suitetecsa",
  "kurosaki1976/qrbar-code-generator":"kurosaki1976",
  "LFrench03/Ganaderia-en-Cuba":     "LFrench03",
  "matcom/gym":                      "matcom",
  "codestrange/egresocovid19-server":"codestrange",
  "adbenitez/simplebot_manga":       "adbenitez",
  "matcom/adminbot":                 "matcom",
  "apiad/tesserax":                  "apiad",
  "apiad/opencode":                  "apiad",
  "Mirage-Tech-Cuba/django-l10n-cu": "Mirage-Tech-Cuba",
  "nikofabelo/nauta-py":             "nikofabelo",
  "LFrench03/Sudokus":               "LFrench03",
  "LFrench03/La-Perla-del-Sur":      "LFrench03",
  // Dart
  "covid19cuba/covid19cuba-app":     "covid19cuba",
  "fluttercuba/apklis-dart-flutter": "fluttercuba",
  "luiscib3r/todo":                  "luiscib3r",
  "NODO-UH/gestionapp":              "NODO-UH",
  "luiscib3r/mixter":                "luiscib3r",
  "luiscib3r/flama":                 "luiscib3r",
  "codestrange/egresocovid19-app":   "codestrange",
  "leynier/cubaopenplay-app":        "leynier",
  "leynier/remend":                  "leynier",
  "alejandrogiubel/transfermovil":   "alejandrogiubel",
  // Go
  "jadolg/DockerImageSave":          "jadolg",
  "NODO-UH/quota-scraper":           "NODO-UH",
  "NODO-UH/uh-email-quota":          "NODO-UH",
  "kenriortega/client-go":           "kenriortega",
  // Kotlin
  "jdsdhp/gallery-droid":            "jdsdhp",
  "lesclaz/selibrary":               "lesclaz",
  "jdsdhp/enzona-payment-embedded":  "jdsdhp",
  "suitetecsa/suitetecsa-sdk-kotlin":"suitetecsa",
  "jdsdhp/crash-reporter":           "jdsdhp",
  "jdsdhp/pictish":                  "jdsdhp",
  "jdsdhp/farmakit_app":             "jdsdhp",
  "suitetecsa/sdk-android":          "suitetecsa",
  // JavaScript
  "covid19cuba/covid19cubadata.github.io":"covid19cuba",
  "luiscib3r/style_transfer":        "luiscib3r",
  "CuCodersCommunity/cucoders-backend":"CuCodersCommunity",
  "CuCodersCommunity/cascarilla.js": "CuCodersCommunity",
  "CuCodersCommunity/members-api":   "CuCodersCommunity",
  "n3omaster/cambiocup":             "n3omaster",
  "geidelguerra/nauta-cli":          "geidelguerra",
  "EduardoProfe666/sudoku-play":     "EduardoProfe666",
  "vircoding/sigma-api":             "vircoding",
  // Astro
  "CuCodersCommunity/cucoderscommunity.github.io":"CuCodersCommunity",
  "CuCodersCommunity/cucoder-dev-talks":"CuCodersCommunity",
  "CuCodersCommunity/cascarilla.js-website":"CuCodersCommunity",
  "rodnye/literary-blog":            "rodnye",
  // Shell
  "apiad/opencode":                  "apiad",
  "dnielpy/gh-activity-viewer":      "dnielpy",
  "pavelmc/amake":                   "pavelmc",
  // C++
  "pavelmc/Si5351mcu":               "pavelmc",
  "pavelmc/FT857d":                  "pavelmc",
  "pavelmc/carrito":                 "pavelmc",
  "pavelmc/BMux":                    "pavelmc",
  "pavelmc/Yatuli":                  "pavelmc",
  "pavelmc/instrument":              "pavelmc",
  "pavelmc/carrito-control":         "pavelmc",
  "pavelmc/stepperUnipolar":         "pavelmc",
  // Swift
  "ragnarok22/ChimeDock":            "ragnarok22",
  "suitetecsa/sdk-swift":            "suitetecsa",
  // Rust
  "kenriortega/flb_filter_iis":      "kenriortega",
  "kenriortega/exporter-rs":         "kenriortega",
  // HTML
  "matcom/matcom.github.io":         "matcom",
  "LFrench03/ganaderia_cuba.github.io":"LFrench03",
  // Vue
  "yossTheDev/prossa":               "yossTheDev",
  "leynier/depatrack":               "leynier",
  "rodnye/cafe-ipv":                 "rodnye",
  // Java
  "jr20xx/JCalc":                    "jr20xx",
  "garciaguimeras/jnauta":           "garciaguimeras",
  // C#
  "dnielpy/Moogle":                  "dnielpy",
  // Perl
  "pavelmc/sof1u":                   "pavelmc",
  // Jupyter
  "LFrench03/Modelo-de-Crecimiento-Poblacional":"LFrench03",
  "matcom/metaheuristics":           "matcom",
  // TeX
  "matcom/dm":                       "matcom",
  "LFrench03/Analisis-Exploratorios":"LFrench03",
  "codestrange/ehealthkd_report":    "codestrange",
  // Haskell
  "codestrange/declarative-programing-hidato-project":"codestrange",
  // Svelte
  "yossTheDev/gh-stats":             "yossTheDev",
  // Markdown
  "cuban-opensourcers/cuban-opensource":"cuban-opensourcers",
  "cuban-opensourcers/cuban-restricted":"cuban-opensourcers",
  "kenriortega/servicios-api-cuba":  "kenriortega",
  "kurosaki1976/lets-encrypt-acme":  "kurosaki1976",
  "kurosaki1976/bind9-views":        "kurosaki1976",
  "kurosaki1976/vyos-virtual-router":"kurosaki1976",
  "kurosaki1976/bind9-delegated-zones":"kurosaki1976",
};

// ─── Perfil completo de usuarios cubanos (para lunas + asteroides) ──────────
const USER_PROFILES = {
  "apiad":          { name:"Alejandro Piad",      followers:429, repos:90,  bio:"Prof. MatCom UH · PhD CS · IA & ML",                   color:"#56d4f7" },
  "manuelernestog": { name:"Manuel E. García",     followers:377, repos:46,  bio:"Founder @CuCodersCommunity · Builder WeekToDo",        color:"#f7a556" },
  "jr20xx":         { name:"José Ricardo",         followers:364, repos:18,  bio:"I use Arch, BTW 🤓",                                   color:"#ce93d8" },
  "leynier":        { name:"Leynier Gutiérrez",    followers:282, repos:157, bio:"CTO @educup · Co-Founder bagplanner.com",              color:"#56d4f7" },
  "matcom":         { name:"MatCom — UH",          followers:237, repos:61,  bio:"Facultad de Matemática y Computación, UH",             color:"#f7cc42" },
  "jadolg":         { name:"Jorge Díaz (Akiel)",   followers:186, repos:123, bio:"Containers whisperer · VPNs & freedom online",        color:"#00add8" },
  "adbenitez":      { name:"adb",                  followers:133, repos:63,  bio:"Computer Scientist · ArcaneChat · Python · FLOSS",     color:"#f7cc42" },
  "LFrench03":      { name:"Luis Ernesto",         followers:136, repos:10,  bio:"Modus Ponens · Data Science",                         color:"#f7cc42" },
  "PushoDev":       { name:"Luis A. Guisado",      followers:124, repos:77,  bio:"CS graduate · Passionate about dev & problem solving", color:"#3178c6" },
  "ragnarok22":     { name:"Reinier Hernández",    followers:110, repos:106, bio:"Build tools · lives inside the terminal",             color:"#fa7343" },
  "vircoding":      { name:"Luis Miguel Navarro",  followers:108, repos:35,  bio:"Full-stack developer",                                color:"#3178c6" },
  "luiscib3r":      { name:"Luis Correa",          followers:103, repos:76,  bio:"Computer Scientist & Software Engineer",              color:"#00b4ab" },
  "codeshard":      { name:"Ozkar L. Garcell",     followers:105, repos:19,  bio:"Backend Dev & DevOps · Python · Docker · Linux",      color:"#f7cc42" },
  "rodnye":         { name:"Rodny Estrada",        followers:120, repos:88,  bio:"Full-stack developer",                                color:"#3178c6" },
  "kenriortega":    { name:"Kenrique Ortega",      followers:74,  repos:147, bio:"DevOps/Data Engineer · open source enthusiast",       color:"#89e051" },
  "dnielpy":        { name:"Daniel Quesada",       followers:72,  repos:6,   bio:"Software Engineering Student & YouTuber",             color:"#3178c6" },
  "yossTheDev":     { name:"Yoannis Sánchez",      followers:69,  repos:36,  bio:"Full-stack Freelance · Next.js · TypeScript · Tailwind",color:"#3178c6" },
  "EduardoProfe666":{ name:"Eduardo González",     followers:66,  repos:67,  bio:"Software Engineer · Web Development",                 color:"#3178c6" },
  "KeimaSenpai":    { name:"Harold",               followers:63,  repos:49,  bio:"YouTuber · Telegram creator",                         color:"#f7cc42" },
  "cuza":           { name:"Dave Cuza",            followers:43,  repos:76,  bio:"SRE @Yelp · Cuban · bass player & kitesurfer",        color:"#00add8" },
  "cuba-odoo":      { name:"Comunidad Cubana Odoo",followers:42,  repos:2,   bio:"Comunidad cubana de Odoo",                            color:"#f7cc42" },
  "pavelmc":        { name:"Pavel Milanes",        followers:39,  repos:16,  bio:"SysAdmin 1998 · Radio amateur · FLOSS contributor",   color:"#f34b7d" },
  "alejandrogiubel":{ name:"Alejandro Giubel",     followers:35,  repos:40,  bio:"Flutter Developer & Software Engineer",               color:"#00b4ab" },
  "cuban-opensourcers":{ name:"Cuban Opensourcers",followers:35,  repos:2,   bio:"Awesome list of Cuban open source projects",          color:"#083fa1" },
  "fluttercuba":    { name:"Flutter Cuba",         followers:33,  repos:24,  bio:"Flutter en Cuba — comunidad open source",             color:"#00b4ab" },
  "iocodz":         { name:"Raúl C. Rivero",       followers:30,  repos:17,  bio:"Full-Stack Developer",                                color:"#f0db4f" },
  "kurosaki1976":   { name:"Ixen Rodríguez",       followers:26,  repos:17,  bio:"GNU/Linux Proud User #313158",                        color:"#083fa1" },
  "groig":          { name:"Roig",                 followers:23,  repos:21,  bio:"",                                                    color:"#00b4ab" },
  "cz9dev":         { name:"Carlos Zaldívar",      followers:23,  repos:16,  bio:"Passionate dev from Cuba · Backend & Frontend · Android",color:"#7f52ff" },
  "exagonsoft":     { name:"Alvaro R Martin",      followers:22,  repos:96,  bio:"Fullstack Developer · aleph.engineering",             color:"#3178c6" },
  "jadolg":         { name:"Jorge Díaz (Akiel)",   followers:186, repos:123, bio:"Containers whisperer · VPNs & freedom online",        color:"#00add8" },
  "alexfdezsauco":  { name:"Igr A. Fernández",     followers:27,  repos:37,  bio:"Software engineer",                                   color:"#ce422b" },
  "hackroot9623":   { name:"Elieser Santiesteban", followers:8,   repos:27,  bio:"Physicist · Backend dev · part-time hitchhiker",      color:"#f7cc42" },
  "daxslab":        { name:"daxslab",              followers:10,  repos:75,  bio:"Software Solutions",                                  color:"#b07219" },
  "NoxCreation":    { name:"NOX",                  followers:17,  repos:12,  bio:"Creation of customized software",                     color:"#f7cc42" },
  "atscub":         { name:"ATS",                  followers:17,  repos:35,  bio:"",                                                    color:"#f7cc42" },
  "raulodev":       { name:"Raúl Cobiellas",       followers:15,  repos:27,  bio:"Developer",                                           color:"#f7cc42" },
  "gorvet":         { name:"Juank de Gorvet",      followers:11,  repos:7,   bio:"Learning & Innovating",                               color:"#f0db4f" },
  "garciaguimeras": { name:"Noel Garcia Guimeras",  followers:10,  repos:21,  bio:"",                                                    color:"#b07219" },
  "suitetecsa":     { name:"SuitETECSA",           followers:5,   repos:11,  bio:"SDK para servicios ETECSA",                           color:"#7f52ff" },
  "codestrange":    { name:"CodeStrange",          followers:6,   repos:22,  bio:"Científicos de la Computación egresados de MatCom",   color:"#00b4ab" },
  "fluttercuba":    { name:"Flutter Cuba",         followers:33,  repos:24,  bio:"Flutter en Cuba",                                     color:"#00b4ab" },
  "jdsdhp":         { name:"jesusd0897",           followers:13,  repos:10,  bio:"Android Developer",                                   color:"#7f52ff" },
  "CuCodersCommunity":{ name:"CuCoders Community", followers:424, repos:14,  bio:"Comunidad de Devs Cubanos",                           color:"#ff5d01" },
  "todo-devs":      { name:"TODO Devs",            followers:7,   repos:9,   bio:"",                                                    color:"#00b4ab" },
  "cuba-weather":   { name:"Cuba Weather",         followers:0,   repos:13,  bio:"Cuba Weather project",                                color:"#29b6f6" },
  "noakmilo":       { name:"Camilo Noa",           followers:8,   repos:14,  bio:"CM @Slyk · Founder Kwelta.tech",                      color:"#f7cc42" },
  "covid19cuba":    { name:"Covid19 Cuba Data",    followers:2,   repos:9,   bio:"Covid19 Cuba Data project",                           color:"#f7cc42" },
  "NODO-UH":        { name:"NODO-UH",              followers:2,   repos:5,   bio:"",                                                    color:"#00add8" },
};

window.REPO_OWNER_MAP = REPO_OWNER_MAP;
window.USER_PROFILES  = USER_PROFILES;

// ─── Repos adicionales encontrados en escaneo v3 ─────────────────────────────
const EXTRA_REPOS = [
  // Enzona / pagos
  { repo: "NoxCreation/enzona_api",          lang: "Python",     stars: 20, forks: 7,  pushed: "2022-09-04", desc: "Librería Python para la API de pagos Enzona" },
  { repo: "daxslab/enzona-sdk-php",          lang: "PHP",        stars: 16, forks: 5,  pushed: "2023-02-10", desc: "SDK PHP no oficial para EnZona" },
  { repo: "daxslab/enzona-payment-php",      lang: "PHP",        stars: 8,  forks: 5,  pushed: "2019-10-17", desc: "Librería PHP para la API de pagos EnZona" },
  // Apklis
  { repo: "Z17-CU/apklischeckpayment",       lang: "Kotlin",     stars: 20, forks: 7,  pushed: "2022-06-10", desc: "Verifica pagos en la tienda Apklis" },
  { repo: "Z17-CU/apklisupdate",             lang: "Kotlin",     stars: 16, forks: 4,  pushed: "2024-01-05", desc: "Verifica actualizaciones en Apklis" },
  { repo: "fluttercuba/apklis-payment-checker-flutter", lang: "Dart", stars: 16, forks: 5, pushed: "2025-09-03", desc: "Plugin Flutter para pagos Apklis" },
  { repo: "fluttercuba/apklis-api-dart",     lang: "Dart",       stars: 11, forks: 1,  pushed: "2020-07-26", desc: "API Dart para la tienda Apklis" },
  // ETECSA / Nauta extras
  { repo: "todo-devs/todo_v1",               lang: "Dart",       stars: 48, forks: 15, pushed: "2021-01-01", desc: "App auxiliar para servicios ETECSA" },
  { repo: "iocodz/link-zone-desktop",        lang: "JavaScript", stars: 38, forks: 10, pushed: "2023-08-23", desc: "App escritorio para el Alcatel Link Zone de ETECSA" },
  { repo: "cuza/luci-app-nauta",             lang: "Shell",      stars: 22, forks: 1,  pushed: "2024-01-10", desc: "App LuCI para OpenWRT — conexión ETECSA permanente" },
  { repo: "daxslab/fotorecarga",             lang: "Java",       stars: 19, forks: 1,  pushed: "2020-04-20", desc: "Recarga saldo móvil desde cupones ETECSA con cámara" },
  { repo: "mmaciass/nauta-connect",          lang: "JavaScript", stars: 16, forks: 4,  pushed: "2026-02-05", desc: "Extensión Chrome para conectarse a la red Nauta" },
  { repo: "alexfdezsauco/Nothing.Nauta",     lang: "C#",         stars: 16, forks: 2,  pushed: "2023-05-03", desc: "API .NET para gestionar sesiones Nauta" },
  { repo: "daxslab/es_wifi_etecsa",          lang: "Java",       stars: 16, forks: 1,  pushed: "2018-12-27", desc: "Detecta vulnerabilidades en redes WIFI_ETECSA" },
  { repo: "groig/etecsa_ussd",               lang: "Dart",       stars: 6,  forks: 0,  pushed: "2019-11-25", desc: "Códigos USSD de ETECSA para Flutter" },
  { repo: "daxslab/euh",                     lang: "TypeScript", stars: 5,  forks: 1,  pushed: "2023-01-07", desc: "Helper para códigos USSD de ETECSA" },
  // Cuba Weather
  { repo: "cuba-weather/cuba-weather-python", lang: "Python",    stars: 16, forks: 3,  pushed: "2021-03-23", desc: "API Python del proyecto Cuba Weather" },
  { repo: "cuba-weather/cuba-weather-telegram-bot", lang: "Python", stars: 5, forks: 1, pushed: "2020-04-11", desc: "Bot Telegram de Cuba Weather" },
  // Tasa de cambio / economía
  { repo: "manuelernestog/exchange-rate-api", lang: "JavaScript", stars: 22, forks: 3, pushed: "2024-05-14", desc: "API para tasas de cambio en Cuba" },
  { repo: "gorvet/eltoqueapi",               lang: "JavaScript", stars: 7,  forks: 0,  pushed: "2022-11-04", desc: "API para tasas del mercado informal cubano (ElToque)" },
  { repo: "hackroot9623/ulauncher-elToque",  lang: "Python",     stars: 4,  forks: 0,  pushed: "2025-03-13", desc: "Plugin ULauncher para tasas ElToque" },
  { repo: "noakmilo/soscubamap",             lang: "Python",     stars: 5,  forks: 5,  pushed: "2026-03-31", desc: "Mapa represivo de Cuba — datos geolocalizados" },
  // Localización / Odoo
  { repo: "cuba-odoo/l10n-cuba",             lang: "Python",     stars: 37, forks: 40, pushed: "2026-03-11", desc: "Localización cubana para Odoo (Beta)" },
  // PushoDev extras
  { repo: "PushoDev/top-github-users",       lang: "JavaScript", stars: 6,  forks: 0,  pushed: "2024-04-02", desc: "Top de usuarios cubanos en GitHub" },
  { repo: "DatalistMonitor/monitor-internet-cuba", lang: "TypeScript", stars: 4, forks: 1, pushed: "2026-03-30", desc: "Monitor de internet en Cuba" },
  // codeshard
  { repo: "codeshard/prognos",               lang: "Python",     stars: 13, forks: 1,  pushed: "2019-12-27", desc: "App para monitorear el estado del tiempo en Cuba" },
  // codestrange extras
  { repo: "codestrange/matcom-messenger",    lang: "Python",     stars: 11, forks: 0,  pushed: "2026-02-21", desc: "Mensajería distribuida — proyecto UH Sistemas Distribuidos" },
  // Transfermovil extras
  { repo: "aleguerra05/metro_trans",         lang: "Dart",       stars: 9,  forks: 0,  pushed: "2020-08-20", desc: "Visor de transacciones de Transfermóvil" },
];

// Merge into main INITIAL_REPOS — avoid duplicates
(function(){
  const existing = new Set(window.CUBA_REPOS.map(r => r.repo));
  for(const r of EXTRA_REPOS){
    if(!existing.has(r.repo)){
      window.CUBA_REPOS.push(r);
      existing.add(r.repo);
    }
  }
})();

// Also add missing owners
Object.assign(window.REPO_OWNER_MAP || {}, {
  "NoxCreation/enzona_api":            "NoxCreation",
  "daxslab/enzona-sdk-php":            "daxslab",
  "daxslab/enzona-payment-php":        "daxslab",
  "Z17-CU/apklischeckpayment":         "Z17-CU",
  "Z17-CU/apklisupdate":               "Z17-CU",
  "fluttercuba/apklis-payment-checker-flutter": "fluttercuba",
  "fluttercuba/apklis-api-dart":        "fluttercuba",
  "todo-devs/todo_v1":                 "todo-devs",
  "iocodz/link-zone-desktop":          "iocodz",
  "cuza/luci-app-nauta":               "cuza",
  "daxslab/fotorecarga":               "daxslab",
  "mmaciass/nauta-connect":            "mmaciass",
  "alexfdezsauco/Nothing.Nauta":       "alexfdezsauco",
  "daxslab/es_wifi_etecsa":            "daxslab",
  "groig/etecsa_ussd":                 "groig",
  "daxslab/euh":                       "daxslab",
  "cuba-weather/cuba-weather-python":  "cuba-weather",
  "cuba-weather/cuba-weather-telegram-bot": "cuba-weather",
  "manuelernestog/exchange-rate-api":  "manuelernestog",
  "gorvet/eltoqueapi":                 "gorvet",
  "hackroot9623/ulauncher-elToque":    "hackroot9623",
  "noakmilo/soscubamap":               "noakmilo",
  "cuba-odoo/l10n-cuba":               "cuba-odoo",
  "PushoDev/top-github-users":         "PushoDev",
  "DatalistMonitor/monitor-internet-cuba": "DatalistMonitor",
  "codeshard/prognos":                 "codeshard",
  "codestrange/matcom-messenger":      "codestrange",
  "aleguerra05/metro_trans":           "alejandrogiubel",
});
