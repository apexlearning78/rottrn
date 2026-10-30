(function () {
    "use strict";

    // ===== DOM ELEMENTS =====
    var nameInput = document.getElementById("nameInput");
    var predictBtn = document.getElementById("predictBtn");
    var resultSection = document.getElementById("resultSection");
    var resultText = document.getElementById("resultText");

    var modalOverlay = document.getElementById("modalOverlay");
    var modalName = document.getElementById("modalName");
    var timerNumber = document.getElementById("timerNumber");
    var progressBar = document.getElementById("progressBar");
    var progressRing = document.getElementById("progressRing");

    // Safety check - agar koi element na mile toh console mein error
    if (!nameInput || !predictBtn || !resultSection || !resultText ||
        !modalOverlay || !modalName || !timerNumber ||
        !progressBar || !progressRing) {
        console.error("Future Predictor: Kuch DOM elements nahi mile. HTML check karein.");
        return;
    }

    // ===== CONFIG =====
    var TOTAL_SECONDS = 59;
    var RADIUS = 80;
    var CIRCUMFERENCE = 2 * Math.PI * RADIUS;

    // Ring setup
    progressRing.style.strokeDasharray = CIRCUMFERENCE.toString();
    progressRing.style.strokeDashoffset = "0";

    var timerInterval = null;

    // ===== PREDICTIONS =====
    var predictions = [
        "You will achieve great success in the coming years through dedication and hard work.",
        "A major opportunity will come your way when you least expect it. Stay prepared.",
        "Your creative ideas will bring you recognition and respect among your peers.",
        "Financial stability and growth are written in your near future.",
        "You will form meaningful connections that will change the course of your life.",
        "A long-awaited dream will soon become reality through your persistence.",
        "Travel and new experiences will bring you clarity and inspiration.",
        "Your leadership qualities will be recognized and rewarded soon.",
        "Good health and inner peace will be your greatest assets in the future.",
        "An unexpected piece of good news will bring joy to your family.",
        "Your hard work will soon bear fruit beyond your expectations.",
        "You will overcome current challenges and emerge stronger than before.",
        "A new chapter of personal growth and self-discovery awaits you.",
        "Prosperity and abundance will flow into your life through wise decisions.",
        "You will inspire others with your resilience and positive mindset.",
        "A meaningful relationship will deepen and bring you lasting happiness.",
        "Your talents will open doors to opportunities you never imagined.",
        "The coming months will bring stability and peace to your life.",
        "You will find success in a path you have not yet fully explored.",
        "Great things are coming your way. Trust the journey and keep moving forward."
    ];

    // ===== HELPER: Get prediction based on name =====
    function getPrediction(name) {
        var hash = 0;
        for (var i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        hash = Math.abs(hash);
        return predictions[hash % predictions.length];
    }

    // ===== STOP TIMER (cleanup) =====
    function stopTimer() {
        if (timerInterval !== null) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    // ===== SHOW RESULT =====
    function showResult() {
        var name = nameInput.value.trim();
        if (name === "") {
            return;
        }
        resultText.textContent = getPrediction(name);
        resultSection.classList.remove("visible");
        // Force reflow so animation replays
        void resultSection.offsetWidth;
        resultSection.classList.add("visible");
    }

    // ===== FINISH COUNTDOWN =====
    function finishCountdown() {
        setTimeout(function () {
            modalOverlay.classList.remove("active");
            document.body.style.overflow = "";
            showResult();
        }, 600);
    }

    // ===== START COUNTDOWN =====
    function startCountdown() {
        stopTimer();

        var remaining = TOTAL_SECONDS;
        timerNumber.textContent = String(remaining);

        // Reset progress
        progressBar.style.transition = "none";
        progressRing.style.transition = "none";
        progressBar.style.width = "0%";
        progressRing.style.strokeDashoffset = "0";

        // Force reflow then re-enable transitions
        void progressBar.offsetWidth;
        void progressRing.offsetWidth;

        progressBar.style.transition = "width 1s linear";
        progressRing.style.transition = "stroke-dashoffset 1s linear";

        // Kick off animation
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

    // ===== MAIN PREDICT FUNCTION =====
    function predictFuture() {
        var name = nameInput.value.trim();

        if (name === "") {
            resultSection.classList.remove("visible");
            nameInput.focus();
            nameInput.style.borderColor = "#ff3333";
            setTimeout(function () {
                nameInput.style.borderColor = "#ffffff";
            }, 1500);
            return;
        }

        stopTimer();
        resultSection.classList.remove("visible");

        modalName.textContent = name;
        modalOverlay.classList.add("active");
        document.body.style.overflow = "hidden";

        startCountdown();
    }

    // ===== EVENT LISTENERS =====
    predictBtn.addEventListener("click", predictFuture);

    nameInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.keyCode === 13) {
            predictFuture();
        }
    });

    // Close modal on overlay click (optional - safety)
    modalOverlay.addEventListener("click", function (event) {
        if (event.target === modalOverlay) {
            // Uncomment if you want click-outside to close:
            // stopTimer();
            // modalOverlay.classList.remove("active");
            // document.body.style.overflow = "";
        }
    });

    // Clean up timer if page unloads
    window.addEventListener("beforeunload", stopTimer);
})();
