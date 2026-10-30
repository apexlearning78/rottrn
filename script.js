(function () {
    "use strict";

    // ===== DOM ELEMENTS =====
    var nameInput = document.getElementById("nameInput");
    var predictBtn = document.getElementById("predictBtn");

    var resultSection = document.getElementById("resultSection");
    var resultText = document.getElementById("resultText");

    var darkResultSection = document.getElementById("darkResultSection");
    var darkResultText = document.getElementById("darkResultText");

    var modalOverlay = document.getElementById("modalOverlay");
    var modalName = document.getElementById("modalName");
    var timerNumber = document.getElementById("timerNumber");
    var progressBar = document.getElementById("progressBar");
    var progressRing = document.getElementById("progressRing");

    var questionOverlay = document.getElementById("questionOverlay");
    var yesBtn = document.getElementById("yesBtn");
    var noBtn = document.getElementById("noBtn");

    // Safety check
    if (!nameInput || !predictBtn || !resultSection || !resultText ||
        !darkResultSection || !darkResultText || !modalOverlay || !modalName ||
        !timerNumber || !progressBar || !progressRing ||
        !questionOverlay || !yesBtn || !noBtn) {
        console.error("Future Predictor: Kuch DOM elements nahi mile. HTML check karein.");
        return;
    }

    // ===== CONFIG =====
    var TOTAL_SECONDS = 59;
    var RADIUS = 80;
    var CIRCUMFERENCE = 2 * Math.PI * RADIUS;
    var RED_POPUP_DELAY = 5000; // 5 seconds

    progressRing.style.strokeDasharray = CIRCUMFERENCE.toString();
    progressRing.style.strokeDashoffset = "0";

    var timerInterval = null;
    var redPopupTimeout = null;

    // ===== PREDICTION #1: Mixed good + slightly scary =====
    var firstPredictions = [
        "Great success and wealth will soon enter your life. But a hidden enemy is silently watching your progress.",
        "A major opportunity is coming your way. Be careful, someone close may try to take it from you.",
        "Your hard work will finally pay off. However, a sudden betrayal will test your trust in people.",
        "Love and happiness will find you soon. Yet a shadow from your past is about to return.",
        "You will rise higher than those around you. But jealousy will follow you at every step.",
        "A long-awaited dream will come true. Prepare yourself, because a difficult choice is coming with it.",
        "Financial growth is written for you. But a careless decision could destroy everything in one moment.",
        "You will meet someone who changes your life. They may not always have good intentions.",
        "Recognition and respect will come your way. But someone will try to damage your reputation.",
        "Peace and stability await you. Yet an unexpected event will shake your world before it arrives.",
        "Your talents will open new doors. One of those doors hides a danger you cannot yet see.",
        "A new friendship will bring you joy. That same person will later reveal a different face.",
        "Good news will arrive from a distance. But bad news is closer than you think.",
        "You will overcome a major obstacle. A second, harder one is waiting just behind it.",
        "Your family will bring you pride. A quiet conflict is growing beneath the surface.",
        "Success in your career is certain. Your greatest enemy will be someone you trust the most.",
        "You will feel more alive than ever before. But dark days will come before the light.",
        "An unexpected gift is coming to you. Every gift has a price you have not yet seen.",
        "Your confidence will inspire others. Overconfidence will be the trap that catches you.",
        "A true friend will appear when you need them most. A false one is already beside you."
    ];

    // ===== PREDICTION #2: Dark / problems / what will happen to you =====
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

    // ===== HELPER: Hash based prediction =====
    function hashCode(str) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash);
    }

    function getFirstPrediction(name) {
        return firstPredictions[hashCode(name) % firstPredictions.length];
    }

    function getDarkPrediction(name) {
        // Use a different offset so it's not the same index
        return darkPredictions[(hashCode(name) + 7) % darkPredictions.length];
    }

    // ===== CLEANUP =====
    function stopTimer() {
        if (timerInterval !== null) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    function clearRedTimeout() {
        if (redPopupTimeout !== null) {
            clearTimeout(redPopupTimeout);
            redPopupTimeout = null;
        }
    }

    function resetAll() {
        stopTimer();
        clearRedTimeout();
        resultSection.classList.remove("visible");
        darkResultSection.classList.remove("visible");
        modalOverlay.classList.remove("active");
        questionOverlay.classList.remove("active");
        document.body.style.overflow = "";
    }

    // ===== SHOW FIRST RESULT =====
    function showFirstResult() {
        var name = nameInput.value.trim();
        if (name === "") {
            return;
        }
        resultText.textContent = getFirstPrediction(name);
        resultSection.classList.remove("visible");
        void resultSection.offsetWidth;
        resultSection.classList.add("visible");
        resultSection.scrollIntoView({ behavior: "smooth", block: "center" });

        // After 5 seconds, show the RED popup
        redPopupTimeout = setTimeout(function () {
            questionOverlay.classList.add("active");
            document.body.style.overflow = "hidden";
        }, RED_POPUP_DELAY);
    }

    // ===== SHOW DARK RESULT =====
    function showDarkResult() {
        var name = nameInput.value.trim();
        if (name === "") {
            return;
        }
        darkResultText.textContent = getDarkPrediction(name);
        darkResultSection.classList.remove("visible");
        void darkResultSection.offsetWidth;
        darkResultSection.classList.add("visible");

        setTimeout(function () {
            darkResultSection.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
    }

    // ===== FINISH COUNTDOWN =====
    function finishCountdown() {
        setTimeout(function () {
            modalOverlay.classList.remove("active");
            document.body.style.overflow = "";
            showFirstResult();
        }, 600);
    }

    // ===== START COUNTDOWN =====
    function startCountdown() {
        stopTimer();

        var remaining = TOTAL_SECONDS;
        timerNumber.textContent = String(remaining);

        progressBar.style.transition = "none";
        progressRing.style.transition = "none";
        progressBar.style.width = "0%";
        progressRing.style.strokeDashoffset = "0";

        void progressBar.offsetWidth;
        void progressRing.offsetWidth;

        progressBar.style.transition = "width 1s linear";
        progressRing.style.transition = "stroke-dashoffset 1s linear";

        progressBar.style.width = "100%";
        progressRing.style.strokeDashoffset = String(CIRCUMFERENCE);

        timerInterval = setInterval(function () {
            remaining = remaining - 1;
            if (remaining < 0) {
                remaining = 0;
            }
            timerNumber.textContent = String(remaining);

            if (remaining <= 0) {
                stopTimer();
                finishCountdown();
            }
        }, 1000);
    }

    // ===== MAIN PREDICT =====
    function predictFuture() {
        var name = nameInput.value.trim();

        if (name === "") {
            nameInput.focus();
            nameInput.style.borderColor = "#ff3333";
            setTimeout(function () {
                nameInput.style.borderColor = "#ffffff";
            }, 1500);
            return;
        }

        resetAll();
        modalName.textContent = name;
        modalOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
        startCountdown();
    }

    // ===== YES BUTTON =====
    yesBtn.addEventListener("click", function () {
        questionOverlay.classList.remove("active");
        document.body.style.overflow = "";

        // Show dark prediction
        setTimeout(function () {
            showDarkResult();
        }, 300);
    });

    // ===== NO BUTTON =====
    noBtn.addEventListener("click", function () {
        questionOverlay.classList.remove("active");
        document.body.style.overflow = "";
        // No dark prediction shown
    });

    // ===== EVENT LISTENERS =====
    predictBtn.addEventListener("click", predictFuture);

    nameInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.keyCode === 13) {
            predictFuture();
        }
    });

    window.addEventListener("beforeunload", function () {
        stopTimer();
        clearRedTimeout();
    });
})();
