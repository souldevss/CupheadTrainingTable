// Language toggle: English ↔ Brazilian Portuguese

const LANG_KEY = "cuphead-training-lang";

const TRANSLATIONS = {
    "en": {
        // Navigation
        "nav.enter-times": "Enter Times",
        "nav.time-table": "Time Table",
        "nav.how-it-works": "How it works",
        "nav.export": "⬇ Export Times",
        "nav.import": "⬆ Import Times",

        // Bigtitle alt text
        "bigtitle.alt": "Cuphead Training Table",

        // Page title
        "page.title": "Cuphead Training Table",
        "page.title.info": "Cuphead Training Table — Info",

        // Info page
        "info.what-title": "What the fork is this website",
        "info.what-text": "This is a personal practice tracker for Cuphead main category speedruns. Log your best times per level, see your rank on each fight, and track your Sum of Bests (SoB) across the run.",
        "info.ranks-title": "Ranks",
        "info.ranks-intro": "Each level has 19 thresholds, from fastest to slowest:",
        "info.ranks-text": "The rank thresholds are based on the current WR for each IL and made-up F rank times.",
        "info.distribution-title": "Distribution Curve",
        "info.distribution-text": "Each rank threshold is computed as:",
        "info.distribution.formula-wr": "WR time (rank 0)",
        "info.distribution.formula-f": "F rank time (rank 18)",
        "info.distribution.formula-i": "rank index (0–18)",
        "info.distribution.formula-exp": "time distribution exponent",
        "info.distribution.explain-i": "where <strong>i</strong> is the rank index (0&thinsp;=&thinsp;WR, 18&thinsp;=&thinsp;F). The exponent controls how the 19 thresholds are spread between WR and F:",
        "info.distribution.linear-desc": "<strong>= 1.0 (linear)</strong> — equal gap between every consecutive rank.",
        "info.distribution.power-desc": "<strong>&gt; 1.0 (used here: 1.35)</strong> — thresholds cluster near WR; gaps grow toward F. Improving from F to D is easier than from S to WR.",
        "info.distribution.graph-desc": "The graph below shows how the curve maps rank index to the fraction of the WR&rarr;F range used for each threshold. Tick marks on the axis show where each rank falls.",
        "info.distribution.graph-near-wr": "near WR",
        "info.distribution.graph-near-f": "near F",
        "info.distribution.graph-linear": "linear",
        "info.distribution.graph-curve": "          curve (exp=1.35)",

        // Table tooltips
        "tooltip.residual": "Residuals are the time spent outside from levels, like walking in the map, scorecards, cutscenes etc.",
        "tooltip.sob": "Sum of all the best times + Residual",

        // Table headers
        "header.islands": "Islands",
        "header.levels": "Levels",
        "header.residual": "Residual",
        "header.sob": "Sob",
        "header.average-rank": "Average Rank",
        "header.total": "Total",
        "header.isle-times": "Total Times",

        // Personal page
        "personal.placeholder-title": "Coming Soon",
        "personal.placeholder-desc": "This category is not yet supported.",
        "personal.placeholder.section": "Section",
        "personal.placeholder.status": "Status",
        "personal.placeholder.times": "Times",
        "personal.placeholder.label": "Placeholder",
        "personal.placeholder.coming": "Coming soon",
        "personal.rank-distribution": "Rank Distribution",
    },
    "pt-BR": {
        // Navigation
        "nav.enter-times": "Inserir Tempos",
        "nav.time-table": "Tabela de Tempos",
        "nav.how-it-works": "Como funciona",
        "nav.export": "⬇ Exportar Tempos",
        "nav.import": "⬆ Importar Tempos",

        // Bigtitle alt text
        "bigtitle.alt": "Tabela de Treino Cuphead",

        // Page title
        "page.title": "Tabela de Treino Cuphead",
        "page.title.info": "Tabela de Treino Cuphead — Info",

        // Info page
        "info.what-title": "Que resenha é essa",
        "info.what-text": "Isso aqui é um rastreador pessoal de prática para speedruns de Cuphead nas categorias principais. Registre seus melhores tempos por nível, veja seu rank em cada um e acompanhe sua Soma de Melhores (SoB) ao longo da run.",
        "info.ranks-title": "Ranks",
        "info.ranks-intro": "Cada nível tem 19 limiares, do mais rápido ao mais lento:",
        "info.ranks-text": "Os limiares de rank são baseados no WR atual de cada IL e tempos de rank F inventados.",
        "info.distribution-title": "Curva de Distribuição",
        "info.distribution-text": "Cada limiar de rank é calculado como:",
        "info.distribution.formula-wr": "tempo WR (rank 0)",
        "info.distribution.formula-f": "tempo rank F (rank 18)",
        "info.distribution.formula-i": "índice do rank (0–18)",
        "info.distribution.formula-exp": "expoente de distribuição de tempo",
        "info.distribution.explain-i": "onde <strong>i</strong> é o índice do rank (0&thinsp;=&thinsp;WR, 18&thinsp;=&thinsp;F). O expoente controla como os 19 limiares são distribuídos entre WR e F:",
        "info.distribution.linear-desc": "<strong>= 1.0 (linear)</strong> — mesmo intervalo entre cada rank consecutivo.",
        "info.distribution.power-desc": "<strong>&gt; 1.0 (usado aqui: 1.35)</strong> — limiares se agrupam perto do WR; intervalos crescem em direção ao F. Melhorar de F para D é mais fácil que de S para WR.",
        "info.distribution.graph-desc": "O gráfico abaixo mostra como a curva mapeia o índice do rank para a fração do intervalo WR&rarr;F usada em cada limiar. As marcas no eixo mostram onde cada rank se encontra.",
        "info.distribution.graph-near-wr": "perto do WR",
        "info.distribution.graph-near-f": "perto do F",
        "info.distribution.graph-linear": "linear",
        "info.distribution.graph-curve": "          curva (exp=1.35)",

        // Table tooltips
        "tooltip.residual": "Residuals são o tempo gasto fora dos níveis, como andando no mapa, placares, cutscenes etc.",
        "tooltip.sob": "Soma de todos os melhores tempos + Residual",

        // Table headers
        "header.islands": "Ilhas",
        "header.levels": "Níveis",
        "header.residual": "Residual",
        "header.sob": "Soma",
        "header.average-rank": "Rank Médio",
        "header.total": "Total",
        "header.isle-times": "Tempos totais",

        // Personal page
        "personal.placeholder-title": "Em Breve",
        "personal.placeholder-desc": "Esta categoria ainda não é suportada.",
        "personal.placeholder.section": "Seção",
        "personal.placeholder.status": "Status",
        "personal.placeholder.times": "Tempos",
        "personal.placeholder.label": "Placeholder",
        "personal.placeholder.coming": "Em breve",
        "personal.rank-distribution": "Distribuição de Ranks",
    }
};

function getActiveLanguage()
{
    const stored = localStorage.getItem(LANG_KEY);
    if (stored === "pt-BR" || stored === "en") return stored;
    return "en";
}

function setActiveLanguage(lang)
{
    localStorage.setItem(LANG_KEY, lang);
    applyLanguage(lang);
}

function t(key)
{
    const lang = getActiveLanguage();
    const dict = TRANSLATIONS[lang];
    return (dict && dict[key] !== undefined) ? dict[key] : key;
}

function applyLanguage(lang)
{
    document.documentElement.lang = lang === "pt-BR" ? "pt-BR" : "en";

    // Update page title
    const isInfoPage = document.body.dataset.page === "info";
    document.title = isInfoPage ? t("page.title.info") : t("page.title");

    // Swap bigtitle image
    const bigtitle = document.getElementById("bigtitle");
    if (bigtitle) {
        bigtitle.src = lang === "pt-BR"
            ? "assets/bigtitle_pt-br.png"
            : "assets/bigtitle_en.png";
        bigtitle.alt = t("bigtitle.alt");
    }

    // Translate nav links with data-i18n
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        el.textContent = t(key);
    });

    // Translate info page content
    document.querySelectorAll("[data-i18n-content]").forEach(el => {
        const key = el.getAttribute("data-i18n-content");
        const translated = t(key);
        // Use innerHTML for translations that contain HTML tags
        if (translated.includes("<") || translated.includes("&")) {
            el.innerHTML = translated;
        } else {
            el.textContent = translated;
        }
    });

    // Update lang toggle button flag image
    const langBtn = document.getElementById("lang-toggle-btn");
    if (langBtn) {
        const img = langBtn.querySelector("img");
        if (img) {
            if (lang === "pt-BR") {
                img.src = "https://flagcdn.com/w40/br.png";
                img.srcset = "https://flagcdn.com/w80/br.png 2x";
                img.alt = "Português";
            } else {
                img.src = "https://flagcdn.com/w40/us.png";
                img.srcset = "https://flagcdn.com/w80/us.png 2x";
                img.alt = "English";
            }
        }
    }

    // Re-render graph labels on info page
    const canvas = document.getElementById("curve-graph");
    if (canvas && typeof redrawCurveGraph === "function") {
        redrawCurveGraph();
    }

    // Re-render table on time table page
    if (document.body.dataset.page === "time-table" && typeof renderTimeTable === "function") {
        renderTimeTable();
    }

    // Re-render personal times page
    if (document.body.dataset.page === "personal-times" && typeof renderPersonalTimesPage === "function") {
        renderPersonalTimesPage();
    }
}

// Initialize on page load
applyLanguage(getActiveLanguage());
