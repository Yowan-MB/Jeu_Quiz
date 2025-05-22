document.addEventListener("DOMContentLoaded", async () => {
    const quizContent = document.getElementById("quiz-content");
    const quizForm = document.getElementById("quiz-form");
    const resultDiv = document.getElementById("result");
    const levelSelect = document.getElementById("quiz-level");
    const resetButton = document.getElementById("reset-button");
    const header = document.querySelector("header");
    const body = document.querySelector("body");

    let questions = [];

    async function fetchQuestions() {
        const selectedLevel = levelSelect.value;
        const response = await fetch(`/get_questions?difficulty=${selectedLevel}`);
        questions = await response.json();
        displayQuestions();
    }

    function displayQuestions() {
        quizContent.innerHTML = "";
        questions.forEach((questionData, index) => {
            const choices = [...questionData.incorrect_answers, questionData.correct_answer];
            choices.sort(() => Math.random() - 0.5);

            const questionHTML = `
                <div class="mb-3 text-start question-container"> 
                    <p class="fw-bold">${index + 1}. ${questionData.question}</p>
                    ${choices.map(choice =>
                `<div class="form-check">
                            <input class="form-check-input" type="radio" name="q${index}" value="${choice}" id="q${index}_${choice}">
                            <label class="form-check-label" for="q${index}_${choice}">${choice}</label>
                        </div>`
            ).join("")}
                </div>
            `;
            quizContent.innerHTML += questionHTML;
        });
    }

    quizForm.addEventListener("submit", (e) => {
        e.preventDefault();
        let score = 0;
        let missedQuestions = [];

        questions.forEach((questionData, index) => {
            const selected = document.querySelector(`input[name="q${index}"]:checked`);

            if (selected) {
                let userAnswer = selected.value.trim().toLowerCase();
                let correctAnswer = questionData.correct_answer.trim().toLowerCase();

                if (userAnswer === correctAnswer) {
                    score++;
                    selected.parentElement.classList.add("correct-answer");
                } else {
                    missedQuestions.push(`${index + 1}. ${questionData.question} → ✅ ${questionData.correct_answer}`);
                }
            } else {
                missedQuestions.push(`${index + 1}. ${questionData.question} (Pas répondu) → ✅ ${questionData.correct_answer}`);
            }
        });

        resultDiv.innerHTML = `<h4 id="score-display" class="mt-3">🏆 Score : ${score} / ${questions.length}</h4>`;
        animateScore(score, questions.length);

        if (missedQuestions.length > 0) {
            resultDiv.innerHTML += `<p class="text-danger">❌ Questions manquées :</p><ul>${missedQuestions.map(q => `<li>${q}</li>`).join("")}</ul>`;
        } else {
            resultDiv.innerHTML += "<p class='text-success'>✅ Félicitations ! Toutes les réponses sont correctes.</p>";
        }

        let mention = "";
        if (score === questions.length) {
            mention = "🌟 Excellent ! Bravo !";
        } else if (score >= questions.length / 2) {
            mention = "👍 Bon travail ! Tu progresses bien.";
        } else {
            mention = "🔄 Continue à pratiquer, tu vas t'améliorer !";
        }

        resultDiv.innerHTML += `<p class="fw-bold mt-3">${mention}</p>`;
    });

    function animateScore(finalScore, total) {
        let score = 0;
        const scoreDisplay = document.getElementById("score-display");
        const interval = setInterval(() => {
            if (score < finalScore) {
                score++;
                scoreDisplay.innerText = `🏆 Score : ${score} / ${total}`;
            } else {
                clearInterval(interval);
            }
        }, 100);
    }

    // ✅ Ajout de la fonctionnalité "Effacer" pour réinitialiser les questions
    resetButton.addEventListener("click", () => {
        quizContent.innerHTML = "";  // ✅ Efface les questions affichées
        resultDiv.innerHTML = "";    // ✅ Efface le score et les résultats
        fetchQuestions();  // ✅ Recharge de nouvelles questions sans rafraîchir la page
    });

    fetchQuestions();

    // ✅ Applique le style forcé au header avec une opacité de 10%
    header.style.cssText = `
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        background-color: rgba(128, 128, 128, 0.3); /* ✅ Opacité de 10% */
        padding: 20px;
        border-radius: 8px;
        position: relative;
        overflow: hidden;
    `;

    // ✅ Applique l’image de fond
    body.style.background = "url('/static/img/background.jpg') center/cover no-repeat fixed";
});
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("header").style.fontFamily = "'Eagle Lake', serif";
});
