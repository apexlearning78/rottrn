(function () {
    "use strict";

    // ===== DOM ELEMENTS =====
    var nameInput = document.getElementById("nameInput");
    var dobInput = document.getElementById("dobInput");
    var predictBtn = document.getElementById("predictBtn");

    var resultSection = document.getElementById("resultSection");
    var resultText = document.getElementById("resultText");
    var resultDetail = document.getElementById("resultDetail");

    var confirmOverlay = document.getElementById("confirmOverlay");
    var confirmYes = document.getElementById("confirmYes");
    var confirmNo = document.getElementById("confirmNo");

    var modalOverlay = document.getElementById("modalOverlay");
    var modalName = document.getElementById("modalName");
    var timerNumber = document.getElementById("timerNumber");
    var progressBar = document.getElementById("progressBar");
    var progressRing = document.getElementById("progressRing");

    var questionOverlay = document.getElementById("questionOverlay");
    var yesBtn = document.getElementById("yesBtn");
    var noBtn = document.getElementById("noBtn");

    if (!nameInput || !dobInput || !predictBtn || !resultSection ||
        !resultText || !resultDetail || !confirmOverlay || !confirmYes ||
        !confirmNo || !modalOverlay || !modalName || !timerNumber ||
        !progressBar || !progressRing || !questionOverlay || !yesBtn || !noBtn) {
        console.error("Future Predictor: DOM elements missing.");
        return;
    }

    // ===== CONFIG =====
    var TOTAL_SECONDS = 30;
    var RADIUS = 80;
    var CIRCUMFERENCE = 2 * Math.PI * RADIUS;
    var MORE_POPUP_DELAY = 7000;

    progressRing.style.strokeDasharray = CIRCUMFERENCE.toString();
    progressRing.style.strokeDashoffset = "0";

    var timerInterval = null;
    var morePopupTimeout = null;

    // ===== PREDICTION #1 (Mixed - good + dangerous, detailed) =====
    var firstPredictions = [
        "Great success and wealth will soon enter your life. But a hidden enemy is silently watching your progress from the shadows, waiting for the right moment to strike.",
        "A major opportunity is coming your way very soon. Be extremely careful, someone very close to you may try to take it from you without you even noticing.",
        "Your hard work will finally pay off in a way you never imagined. However, a sudden betrayal from someone you trust will test your faith in people.",
        "Love and happiness will find you sooner than expected. Yet a shadow from your past is about to return, and it will force you to make a difficult choice.",
        "You will rise higher than those around you. But jealousy will follow you at every step, and someone will try to bring you down silently.",
        "A long-awaited dream will come true. Prepare yourself, because a difficult decision is coming with it, and one wrong move could change everything.",
        "Financial growth is clearly written for you. But a careless decision in the near future could destroy everything in a single moment.",
        "You will meet someone who changes the direction of your life. They may not always have good intentions, and you will only realize this too late.",
        "Recognition and respect will come your way. But someone envious will try to damage your reputation behind your back.",
        "Peace and stability await you. Yet an unexpected event will shake your entire world before it finally arrives.",
        "Your talents will open new doors for you. One of those doors hides a danger you cannot yet see, and only time will reveal it.",
        "A new friendship will bring you great joy. That same person will later reveal a completely different face, and you will be left confused.",
        "Good news will arrive from a distance. But bad news is closer than you think, and it will come from someone you never suspected.",
        "You will overcome a major obstacle very soon. A second, much harder one is waiting just behind it, ready to test you again.",
        "Your family will bring you pride and honor. A quiet conflict is growing beneath the surface, and it may soon become visible to everyone.",
        "Success in your career is almost certain. Your greatest enemy will be someone you trust the most, and that truth will hurt deeply.",
        "You will feel more alive than ever before. But dark days will come before the light, and they will test your patience.",
        "An unexpected gift is coming your way. Every gift has a price, and this one's price is something you are not yet prepared for.",
        "Your confidence will inspire many people around you. But overconfidence will be the trap that catches you when you least expect it.",
        "A true friend will appear when you need them the most. A false one is already beside you, pretending to be something they are not."
    ];

    // ===== DETAILED PART (added after main sentence) =====
    var detailParts = [
        "The coming months will reveal truths you have been avoiding. Pay close attention to the people around you, because not everyone who smiles at you wishes you well. Trust your instincts more than their words.",
        "You are standing at a turning point. The choices you make in the next few weeks will shape the next several years of your life. Do not rush, but do not delay either. Balance is your only weapon.",
        "There is a strong energy around you right now. Some of it is positive, but some is dangerous. Protect your energy and be careful who you allow into your inner circle.",
        "A door is about to close and another will open. What you lose will hurt, but what you gain will be far greater. Stay patient and do not fight what is meant to leave.",
        "Your intuition has been warning you about something. Stop ignoring it. The signs have been there for a while, and if you do not act soon, you will regret it later.",
        "You have been carrying a burden silently. Soon, you will have the chance to put it down. But that chance will come with a hard truth you must face.",
        "There are people in your life who take more than they give. This pattern will soon cause a breaking point. Decide carefully who deserves your loyalty.",
        "A hidden opportunity is being prepared for you, but it requires patience. Do not force things. What is meant for you will come at exactly the right moment.",
        "You will soon experience something that changes your perspective forever. It may feel like a loss at first, but it is actually a necessary transformation.",
        "Your financial situation will improve, but only if you learn to say no. Some people around you are helping themselves through your generosity, and it must stop."
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

    function getFirstPrediction(seed) {
        return firstPredictions[hashCode(seed) % firstPredictions.length];
    }

    function getDetailPart(seed) {
        return detailParts[(hashCode(seed) + 3) % detailParts.length];
    }

    // ===== CLEANUP =====
    function stopTimer() {
        if (timerInterval !== null) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    function clearMoreTimeout() {
        if (morePopupTimeout !== null) {
            clearTimeout(morePopupTimeout);
            morePopupTimeout = null;
        }
    }

    function resetAll() {
        stopTimer();
        clearMoreTimeout();
        resultSection.classList.remove("visible");
        modalOverlay.classList.remove("active");
        questionOverlay.classList.remove("active");
        confirmOverlay.classList.remove("active");
        document.body.style.overflow = "";
    }

    // ===== SHOW FIRST RESULT =====
    function showFirstResult() {
        var name = nameInput.value.trim();
        var dob = dobInput.value;
        var seed = buildSeed(name, dob);

        resultText.textContent = getFirstPrediction(seed);
        resultDetail.textContent = getDetailPart(seed);

        resultSection.classList.remove("visible");
        void resultSection.offsetWidth;
        resultSection.classList.add("visible");
        resultSection.scrollIntoView({ behavior: "smooth", block: "center" });

        // After 7 seconds, show red "more future" popup
        morePopupTimeout = setTimeout(function () {
            questionOverlay.classList.add("active");
            document.body.style.overflow = "hidden";
        }, MORE_POPUP_DELAY);
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
            if (remaining < 0) remaining = 0;
            timerNumber.textContent = String(remaining);

            if (remaining <= 0) {
                stopTimer();
                finishCountdown();
            }
        }, 1000);
    }

    // ===== PREDICT BUTTON =====
    function predictFuture() {
        var name = nameInput.value.trim();
        var dob = dobInput.value;

        if (name === "") {
            nameInput.focus();
            nameInput.style.borderColor = "#ff3333";
            setTimeout(function () {
                nameInput.style.borderColor = "#ffffff";
            }, 1500);
            return;
        }

        if (dob === "") {
            dobInput.focus();
            dobInput.style.borderColor = "#ff3333";
            setTimeout(function () {
                dobInput.style.borderColor = "#ffffff";
            }, 1500);
            return;
        }

        resetAll();

        // Show confirmation popup first
        confirmOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    // ===== CONFIRM YES - Start timer =====
    confirmYes.addEventListener("click", function () {
        confirmOverlay.classList.remove("active");

        var name = nameInput.value.trim();
        modalName.textContent = name;
        modalOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
        startCountdown();
    });

    // ===== CONFIRM NO - Go to Google =====
    confirmNo.addEventListener("click", function () {
        confirmOverlay.classList.remove("active");
        document.body.style.overflow = "";
        window.location.href = "https://www.google.com";
    });

    // ===== YES BUTTON (more future) - Go to red.html =====
    yesBtn.addEventListener("click", function () {
        var name = nameInput.value.trim();
        var dob = dobInput.value;
        try {
            localStorage.setItem("futureName", name);
            localStorage.setItem("futureDob", dob);
        } catch (e) {}
        window.location.href = "red.html";
    });

    // ===== NO BUTTON (more future) =====
    noBtn.addEventListener("click", function () {
        questionOverlay.classList.remove("active");
        document.body.style.overflow = "";
    });

    // ===== EVENTS =====
    predictBtn.addEventListener("click", predictFuture);

    nameInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.keyCode === 13) {
            predictFuture();
        }
    });

    window.addEventListener("beforeunload", function () {
        stopTimer();
        clearMoreTimeout();
    });
})();
