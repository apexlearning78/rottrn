(function () {
    "use strict";

    // ===== DOM ELEMENTS =====
    var darkResultMain = document.getElementById("darkResultMain");
    var darkResultDetail = document.getElementById("darkResultDetail");
    var nameDisplay = document.getElementById("nameDisplay");
    var dobDisplay = document.getElementById("dobDisplay");

    if (!darkResultMain || !darkResultDetail || !nameDisplay || !dobDisplay) {
        console.error("red.html: Required elements missing.");
        return;
    }

    // ===== DARK MAIN PREDICTIONS =====
    var darkMainPredictions = [
        "A painful loss will strike your family within the coming years. You will have to be the strong one, even when you feel like breaking inside.",
        "You will face a financial crisis that will force you to start over from nothing. Everything you built will feel like it was taken away overnight.",
        "Someone you deeply trust will betray you. The wound will take years to heal, and it will change how you see people forever.",
        "A serious health issue will appear unexpectedly. Do not ignore the warning signs your body has been giving you for months.",
        "You will experience deep loneliness, even when surrounded by people who claim to care. That silence will teach you something painful.",
        "A relationship will end in a way that leaves questions you will never get answers to. Some goodbyes come without explanation.",
        "You will lose an opportunity that could have changed everything. The regret will stay with you longer than you expect.",
        "An accident or sudden event will change the direction of your life forever. You will not see it coming.",
        "You will be blamed for something you did not do. Proving your innocence will be harder than you think.",
        "A close family member will face a hard time, and you will feel powerless to help them. That helplessness will haunt you.",
        "You will be forced to leave something or someone you love. The reason will not be your choice.",
        "A period of darkness will fall over your home. It will test everyone in your family, but it will not last forever.",
        "You will face betrayal from someone you considered family. After that, trust will become almost impossible for you.",
        "A dream you have held for years will collapse before your eyes. Something new will rise from it, but the loss will still hurt.",
        "You will experience a moment where you question everything you know about yourself. That moment will either break you or rebuild you.",
        "A quiet enemy will work against you from the shadows. You will only see them when it is already too late.",
        "You will go through a phase where money disappears faster than you can earn it. Every effort will feel wasted.",
        "A separation from someone important will teach you the hardest lesson of your life. You will not be the same person after it.",
        "You will face failure in something you truly believed in. The lesson will be painful, but it will be necessary.",
        "At some point, you will feel completely alone in a room full of people. That night will change you more than any words could."
    ];

    // ===== DARK DETAIL PARTS (Deep dangerous explanation) =====
    var darkDetailParts = [
        "The signs are already around you. Small things you have been ignoring are actually warnings. The people closest to you are not all on your side, and soon their true intentions will become visible. Keep your eyes open and your circle small.",
        "A test of your patience is coming. It will feel unfair and unnecessary, but it will reveal who truly stands with you. Do not react with anger. Silence will be your strongest weapon in that moment.",
        "You are about to enter a phase where your emotions will be tested more than your mind. Old wounds will reopen, and you will have to decide whether to heal or repeat the same cycle again.",
        "A sudden change will arrive without warning. It will force you to make a decision you have been avoiding for a long time. Whatever you choose, someone will be hurt. Choose wisely.",
        "The universe is preparing a difficult lesson for you. It will come through someone you love. That person will not mean to hurt you, but the pain will still be real. Learn to forgive without forgetting.",
        "Your past is not done with you yet. Something or someone from your history will return, and you will have to face it with the strength you have now built. Do not run this time.",
        "There is a truth being hidden from you right now. Someone near you is keeping a secret that will affect your future. You will discover it, but the discovery will change everything.",
        "Your silence has been interpreted as weakness by some people. Soon, you will have to show them that you have been patient, not weak. That moment will define your next chapter.",
        "A financial or emotional loss will come from a place you did not expect. It will feel like a punishment, but it is actually a redirection. What leaves was never meant to stay.",
        "You have been carrying a burden that was never yours to carry. Soon, the truth will come out, and you will have to put it down. That moment will feel like both a loss and a freedom."
    ];

    // ===== HELPER =====
    function hashCode(str) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash);
    }

    function buildSeed(name, dob) {
        return name + "|" + dob;
    }

    function getDarkMain(seed) {
        return darkMainPredictions[(hashCode(seed) + 7) % darkMainPredictions.length];
    }

    function getDarkDetail(seed) {
        return darkDetailParts[(hashCode(seed) + 13) % darkDetailParts.length];
    }

    function formatDob(dob) {
        if (!dob) return "";
        var parts = dob.split("-");
        if (parts.length !== 3) return dob;
        var year = parts[0];
        var month = parts[1];
        var day = parts[2];
        return day + " / " + month + " / " + year;
    }

    // ===== GET DATA FROM localStorage =====
    var name = "";
    var dob = "";

    try {
        name = localStorage.getItem("futureName") || "";
        dob = localStorage.getItem("futureDob") || "";
    } catch (e) {
        name = "";
        dob = "";
    }

    // Fallback: URL params
    if (!name) {
        var params = new URLSearchParams(window.location.search);
        name = params.get("name") || "";
        dob = params.get("dob") || dob;
    }

    // If no name - redirect back
    if (!name || name.trim() === "") {
        window.location.replace("index.html");
        return;
    }

    name = name.trim();
    var seed = buildSeed(name, dob);

    // ===== DISPLAY =====
    nameDisplay.textContent = name;
    dobDisplay.textContent = dob ? formatDob(dob) : "";

    // Small delay for dramatic effect
    setTimeout(function () {
        darkResultMain.textContent = getDarkMain(seed);
    }, 500);

    setTimeout(function () {
        darkResultDetail.textContent = getDarkDetail(seed);
    }, 1400);

    // ===== CLEANUP on unload =====
    window.addEventListener("beforeunload", function () {
        try {
            localStorage.removeItem("futureName");
            localStorage.removeItem("futureDob");
        } catch (e) {}
    });
})();
