const nameInput = document.getElementById('nameInput');
const predictBtn = document.getElementById('predictBtn');
const resultSection = document.getElementById('resultSection');
const resultText = document.getElementById('resultText');

const modalOverlay = document.getElementById('modalOverlay');
const modalName = document.getElementById('modalName');
const timerNumber = document.getElementById('timerNumber');
const progressBar = document.getElementById('progressBar');
const progressRing = document.getElementById('progressRing');

const TOTAL_SECONDS = 59;

const predictions = [
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

// Ring circumference
const RADIUS = 80;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
progressRing.style.strokeDasharray = CIRCUMFERENCE;
progressRing.style.strokeDashoffset = 0;

let timerInterval = null;

function getPrediction(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = Math.abs(hash);
    const index = hash % predictions.length;
    return predictions[index];
}

function startCountdown() {
    let remaining = TOTAL_SECONDS;
    timerNumber.textContent = remaining;
    progressBar.style.width = '0%';
    progressRing.style.strokeDashoffset = 0;

    // Trigger transition after reset
    requestAnimationFrame(() => {
        progressBar.style.width = '100%';
        progressRing.style.strokeDashoffset = CIRCUMFERENCE;
    });

    timerInterval = setInterval(() => {
        remaining--;
        if (remaining < 0) remaining = 0;
        timerNumber.textContent = remaining;

        if (remaining <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            finishCountdown();
        }
    }, 1000);
}

function finishCountdown() {
    // Small delay so user sees 0 before closing
    setTimeout(() => {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        showResult();
    }, 500);
}

function showResult() {
    const name = nameInput.value.trim();
    resultText.textContent = getPrediction(name);
    resultSection.classList.remove('visible');
    void resultSection.offsetWidth;
    resultSection.classList.add('visible');
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function predictFuture() {
    const name = nameInput.value.trim();

    if (name === '') {
        resultSection.classList.remove('visible');
        nameInput.focus();
        nameInput.style.borderColor = '#ff3333';
        setTimeout(() => {
            nameInput.style.borderColor = '#ffffff';
        }, 1500);
        return;
    }

    // Reset previous state
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    resultSection.classList.remove('visible');

    // Set modal name
    modalName.textContent = name;

    // Open modal
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Start countdown
    startCountdown();
}

predictBtn.addEventListener('click', predictFuture);

nameInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        predictFuture();
    }
});
