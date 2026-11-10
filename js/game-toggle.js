const trainingGames = {
    cuphead: { name: "Cuphead", banner: "268910/header.jpg?t=1709068852", storage: "cuphead" },
    "hollow-knight": { name: "Hollow Knight", banner: "367520/3c3489495136b26b34f8a9543c7f5645b99d388c/header.jpg?t=1776125684", storage: "hollowKnight" },
    silksong: { name: "Silksong", banner: "1030300/7983574d464e6559ac7e24275727f73a8bcca1f3/header.jpg?t=1776125736", storage: "silksong" }
};
const savedGame = localStorage.getItem("trainingTableGame");
const activeGame = Object.hasOwn(trainingGames, savedGame) ? savedGame : "cuphead";
document.body.dataset.game = activeGame;

const gamePicker = document.getElementById("game-picker");
const gameBanner = gamePicker.querySelector("summary");
const gameChoices = gamePicker.querySelector(".game-choices");

function gameBannerMarkup(game) {
    return `<span class="game-banner-name">${game.name}</span>
        <img src="https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${game.banner}" alt="" width="460" height="215">`;
}

gameBanner.innerHTML = gameBannerMarkup(trainingGames[activeGame]) + '<span class="game-picker-chevron" aria-hidden="true"></span>';
for (const [id, game] of Object.entries(trainingGames)) {
    if (id === activeGame) continue;
    const button = document.createElement("button");
    button.type = "button";
    button.innerHTML = gameBannerMarkup(game);
    button.addEventListener("click", () => {
        localStorage.setItem("trainingTableGame", id);
        location.reload();
    });
    gameChoices.appendChild(button);
}

document.addEventListener("click", event => {
    if (gamePicker.open && !gamePicker.contains(event.target)) gamePicker.open = false;
});
gamePicker.addEventListener("keydown", event => {
    if (event.key !== "Escape" || !gamePicker.open) return;
    gamePicker.open = false;
    gameBanner.focus();
});
