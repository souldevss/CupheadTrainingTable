function setupGameToggle()
{
    const isHollowKnight = localStorage.getItem("trainingTableGame") === "hollow-knight";
    const toggle = document.getElementById("game-toggle-btn");
    const cupheadTitle = document.getElementById("bigtitle");
    const hollowKnightTitle = document.getElementById("hollow-knight-title");

    document.body.dataset.game = isHollowKnight ? "hollow-knight" : "cuphead";
    document.title = isHollowKnight ? "Hollow Knight Training Table" : "Cuphead Training Table";
    if (cupheadTitle) cupheadTitle.hidden = isHollowKnight;
    if (hollowKnightTitle) hollowKnightTitle.hidden = !isHollowKnight;

    if (!toggle) return;
    const nextGame = isHollowKnight ? "Cuphead" : "Hollow Knight";
    toggle.setAttribute("aria-label", `Switch to ${nextGame}`);
    toggle.title = `Switch to ${nextGame}`;
    const icon = document.createElement("img");
    icon.src = isHollowKnight
        ? "assets/icons/cupheadicon.png"
        : "assets/icons/hollowknighticon.png";
    icon.alt = "";
    icon.setAttribute("aria-hidden", "true");
    toggle.replaceChildren(icon);
    toggle.addEventListener("click", () => {
        localStorage.setItem("trainingTableGame", isHollowKnight ? "cuphead" : "hollow-knight");
        window.location.reload();
    });
}

setupGameToggle();
