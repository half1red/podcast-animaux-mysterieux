const players = document.querySelectorAll(".player audio");

players.forEach((player) => {
    player.addEventListener("play", () => {
        players.forEach((otherPlayer) => {
            if (otherPlayer !== player) {
                otherPlayer.pause();
            }
        });
    });
});
