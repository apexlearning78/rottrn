const nameInput = document.getElementById('nameInput');
const predictBtn = document.getElementById('predictBtn');
const resultSection = document.getElementById('resultSection');
const resultText = document.getElementById('resultText');

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

function getPrediction(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = Math.abs(hash);
    const index = hash % predictions.length;
    return predictions[index];
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

    resultText.textContent = getPrediction(name);
    resultSection.classList.remove('visible');
    void resultSection.offsetWidth;
    resultSection.classList.add('visible');
}

predictBtn.addEventListener('click', predictFuture);

nameInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        predictFuture();
    }
});
