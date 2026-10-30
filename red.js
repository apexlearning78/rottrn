(function () {
    "use strict";

    var darkResultText = document.getElementById("darkResultText");
    var nameDisplay = document.getElementById("nameDisplay");

    if (!darkResultText || !nameDisplay) {
        console.error("red.html: Required elements missing.");
        return;
    }

    // ===== DARK PREDICTIONS =====
    var darkPredictions = [
        "A painful loss will strike your family within the coming years. You will have to be the strong one.",
        "You will face a financial crisis that will force you to start over from nothing.",
        "Someone you deeply trust will betray you. The wound will take years to heal.",
        "A serious health issue will appear unexpectedly. Do not ignore the warning signs.",
        "You will experience deep loneliness, even when surrounded by people who claim to care.",
        "A relationship will end in a way that leaves questions you will never get answers to.",
        "You will lose an opportunity that could have changed everything. The regret will stay.",
        "An accident or sudden event will change the direction of your life forever.",
        "You will be blamed for something you did not do. Proving your innocence will be difficult.",
        "A close family member will face a hard time, and you will feel powerless to help.",
        "You will be forced to leave something or someone you love. The reason will not be your choice.",
        "A period of darkness will fall over your home. But it will not last forever.",
        "You will face a betrayal from someone you considered family. Trust will become difficult.",
        "A dream you have held for years will collapse before your eyes. A new one will rise from it.",
        "You will experience a moment where you question everything you know about yourself.",
        "A quiet enemy will work against you from the shadows. You will only see them too late.",
        "You will go through a phase where money disappears faster than you can earn it.",
        "A separation from someone important will teach you the hardest lesson of your life.",
        "You will face failure in something you truly believed in. The lesson will be painful but necessary.",
        "At some point, you will feel completely alone in a room full of people. That night will change you."
    ];

    function hashCode(str) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash);
    }

    function getDarkPrediction(name) {
        return darkPredictions[(hashCode(name) + 7) % darkPredictions.length];
    }

    // ===== GET NAME FROM localStorage =====
    var name = "";

    try {
        name = localStorage.getItem("futureName") || "";
    } catch (e) {
        name = "";
    }

    // Fallback: URL param
    if (!name) {
        var params = new URLSearchParams(window.location.search);
        name = params.get("name") || "";
    }

    // If still empty - send back to index
    if (!name || name.trim() === "") {
        window.location.replace("index.html");
        return;
    }

    name = name.trim();

    // ===== DISPLAY =====
    nameDisplay.textContent = name;

    // Small delay for dramatic effect
    setTimeout(function () {
        darkResultText.textContent = getDarkPrediction(name);
    }, 600);

    // Cleanup localStorage so back button doesn't show stale
    window.addEventListener("beforeunload", function () {
        try {
            // Keep for now - user might refresh
        } catch (e) {}
    });
})();
