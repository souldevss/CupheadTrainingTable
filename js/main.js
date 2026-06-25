// Application entry point

function playSound(url, volume = 0.2)
{
    const audio = new Audio(url);
    audio.volume = volume;
    audio.play().catch(() => {});
}

function setupPageNavigation(transitionDelay = 200)
{
    document.querySelectorAll("a[data-page-link]").forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();
            document.body.classList.add("is-transitioning");
            playSound(APP_SOUND_URLS.selection, 0.2);
            window.setTimeout(() => {
                window.location.href = link.getAttribute("href");
            }, transitionDelay);
        });
    });
}

async function initializeApp()
{
    setupPageNavigation();
    renderCategoryControls();
    await fetchAndUpdateWrTimes();
    generateAllLevelTimes();
    renderActivePage();
    document.body.classList.add("is-ready");
}

activeCategory = getInitialCategory();
activeSubOption = getInitialSubOption();
initializeApp();

if (isPersonalTimesPage) {
    const exportBtn = document.getElementById("export-btn");
    const importBtn = document.getElementById("import-btn");
    const importFile = document.getElementById("import-file");

    if (exportBtn) {
        exportBtn.addEventListener("click", exportPersonalTimes);
    }

    if (importBtn && importFile) {
        importBtn.addEventListener("click", () => importFile.click());

        importFile.addEventListener("change", event => {
            if (event.target.files.length > 0) {
                importPersonalTimes(event.target.files[0]);
                event.target.value = "";
            }
        });
    }
}
