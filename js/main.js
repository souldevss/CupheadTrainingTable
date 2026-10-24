// Application entry point

function playSound(url, volume = 0.2)
{
    const audio = new Audio(url);
    audio.volume = volume;
    audio.play().catch(() => {});
}

async function initializeApp()
{
    renderCategoryControls();
    if (activeGame === "cuphead") {
        await fetchAndUpdateWrTimes();
    }
    generateAllLevelTimes();
    renderActivePage();
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
