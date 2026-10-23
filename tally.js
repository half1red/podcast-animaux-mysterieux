const tallyScriptUrl = "https://tally.so/widgets/embed.js";

function loadTallyEmbeds() {
    if (typeof Tally !== "undefined") {
        Tally.loadEmbeds();
    } else {
        document.querySelectorAll("iframe[data-tally-src]:not([src])").forEach((iframe) => {
            iframe.src = iframe.dataset.tallySrc;
        });
    }
}

if (typeof Tally !== "undefined") {
    loadTallyEmbeds();
} else if (document.querySelector('script[src="' + tallyScriptUrl + '"]') === null) {
    const script = document.createElement("script");
    script.src = tallyScriptUrl;
    script.onload = loadTallyEmbeds;
    script.onerror = loadTallyEmbeds;
    document.body.appendChild(script);
}
