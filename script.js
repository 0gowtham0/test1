const SUPABASE_URL = "https://rmycmjlvkmlgugjgaphq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJteWNtamx2a21sZ3VnamdhcGhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwNjg0ODYsImV4cCI6MjA1NjY0NDQ4Nn0.nq7O5SrBzhKLFEGoH9IguZUba-fEqvUwiC-1pDFUB5o";

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let questions = [];
let currentQuestionIndex = parseInt(localStorage.getItem("currentQuestionIndex")) || 0; // Load last question index

async function fetchQuestions() {
    const { data, error } = await supabaseClient.from("quiz_questions").select("*");

    if (error) {
        console.error("Error fetching questions:", error);
        return;
    }

    questions = data.map(q => ({
        question: q.question,
        options: [q.option1, q.option2, q.option3, q.option4],
        correct: q.correct_index,
        description: q.description
    }));

    loadQuestion();
}

function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        document.querySelector(".quiz-container").innerHTML = "<h2>Quiz Completed!</h2>";
        return;
    }

    const questionData = questions[currentQuestionIndex];
    document.getElementById("question").innerText = questionData.question;

    const optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = "";

    questionData.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.innerText = option;
        button.onclick = () => checkAnswer(index);
        optionsContainer.appendChild(button);
    });

    document.getElementById("description").innerText = ""; // Clear previous explanation
    document.getElementById("next-button").style.display = "none"; // Hide next button initially
}

function checkAnswer(selectedIndex) {
    const questionData = questions[currentQuestionIndex];
    const buttons = document.querySelectorAll("#options button");

    buttons.forEach((button, index) => {
        if (index === questionData.correct) {
            button.classList.add("correct");
        } else if (index === selectedIndex) {
            button.classList.add("wrong");
        }
        button.disabled = true;
    });

    document.getElementById("description").innerText = questionData.description;
    document.getElementById("next-button").style.display = "block"; // Show next button
}

document.getElementById("next-button").addEventListener("click", () => {
    currentQuestionIndex++;
    localStorage.setItem("currentQuestionIndex", currentQuestionIndex); // Save progress
    loadQuestion();
});

// Load questions from database
fetchQuestions();
