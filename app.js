/* =========================
📄 FULL PREMIUM APP JS
========================= */

/* WORD DATA */

let words = [

    {
        word: "festival",
        pronunciation: "ফেস্টিভ্যাল",
        bangla: "উৎসব",
        category: "Noun",
        sentence: "Eid is the biggest festival for Muslims.",
        sentenceBangla: "ঈদ মুসলমানদের জন্য সবচেয়ে বড় উৎসব।"
    },

    {
        word: "fetch",
        pronunciation: "ফেচ",
        bangla: "নিয়ে আসা",
        category: "Verb",
        sentence: "Please fetch me a glass of water.",
        sentenceBangla: "অনুগ্রহ করে আমাকে এক গ্লাস পানি এনে দিন।"
    },

    {
        word: "fever",
        pronunciation: "ফিভার",
        bangla: "জ্বর",
        category: "Noun",
        sentence: "He is staying in bed with a high fever.",
        sentenceBangla: "সে তীব্র জ্বর নিয়ে বিছানায় পড়ে আছে।"
    },

    {
        word: "few",
        pronunciation: "ফিউ",
        bangla: "অল্প, কয়েকটি",
        category: "Adjective",
        sentence: "I have a few close friends.",
        sentenceBangla: "আমার অল্প কয়েকজন ঘনিষ্ঠ বন্ধু আছে।"
    },

    {
        word: "flower",
        pronunciation: "ফ্লাওয়ার",
        bangla: "ফুল",
        category: "Noun",
        sentence: "This flower smells very nice.",
        sentenceBangla: "এই ফুলটির গন্ধ খুব সুন্দর।"
    },

    {
        word: "freedom",
        pronunciation: "ফ্রিডম",
        bangla: "স্বাধীনতা",
        category: "Noun",
        sentence: "Everyone loves freedom.",
        sentenceBangla: "সবাই স্বাধীনতা ভালোবাসে।"
    }

];

/* =========================
VARIABLES
========================= */

let favorites =
    JSON.parse(localStorage.getItem("favorites")) || [];

let currentQuizWord = null;

let quizScore = 0;

/* =========================
CATEGORY
========================= */

function populateCategories() {

    const select =
        document.getElementById("categoryFilter");

    select.innerHTML =
        `<option value="all">All Categories</option>`;

    const categories = [
        ...new Set(words.map(w => w.category))
    ];

    categories.forEach(category => {

        const option =
            document.createElement("option");

        option.value = category;

        option.textContent = category;

        select.appendChild(option);
    });
}

/* =========================
SHOW WORDS
========================= */

function showWords(data) {

    const container =
        document.getElementById("wordContainer");

    container.innerHTML = "";

    if (data.length === 0) {

        container.innerHTML = `
      <div class="text-center text-red-500 text-xl font-bold col-span-full">
        No words found 😢
      </div>
    `;

        return;
    }

    data.forEach(word => {

        const isFav =
            favorites.includes(word.word);

        container.innerHTML += `

      <div class="word-card p-3 md:p-5">

        <div class="flex justify-between items-start gap-2">

          <div class="flex-1 min-w-0">

            <h2 class="text-xl md:text-3xl font-bold text-blue-600 break-words">
              ${word.word}
            </h2>

            <p class="mt-1 text-sm md:text-lg break-words">
              🔊 ${word.pronunciation}
            </p>

            <p class="mt-2 text-sm md:text-xl font-semibold break-words">
              🇧🇩 ${word.bangla}
            </p>

            <p class="mt-2 inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs md:text-sm font-semibold">
              ${word.category}
            </p>

          </div>

          <button
            onclick="toggleFavorite('${word.word}')"
            class="text-2xl md:text-4xl"
          >
            ${isFav ? "❤️" : "🤍"}
          </button>

        </div>

        <div class="mt-3 border-t pt-3">

          <p class="italic text-gray-500 text-xs md:text-base break-words">
            "${word.sentence}"
          </p>

          <p class="mt-2 text-green-500 text-xs md:text-base font-medium break-words">
            ${word.sentenceBangla}
          </p>

        </div>

        <div class="mt-3 grid grid-cols-2 gap-2">

          <button
            onclick="speakWord('${word.word}')"
            class="premium-btn-blue text-xs md:text-base py-2"
          >
            🔊 Speak
          </button>

          <button
            onclick="copyWord('${word.word}')"
            class="premium-btn-green text-xs md:text-base py-2"
          >
            📋 Copy
          </button>

        </div>

      </div>
    `;
    });
}

/* =========================
SEARCH + FILTER
========================= */

function filterWords() {

    const search =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase();

    const category =
        document
            .getElementById("categoryFilter")
            .value;

    const filtered =
        words.filter(word => {

            const matchSearch =
                word.word.toLowerCase().includes(search) ||

                word.bangla.includes(search);

            const matchCategory =
                category === "all" ||

                word.category === category;

            return matchSearch && matchCategory;
        });

    showWords(filtered);
}

/* =========================
RANDOM WORD
========================= */

function showRandomWord() {

    const randomWord =
        words[
        Math.floor(Math.random() * words.length)
        ];

    showWords([randomWord]);
}

/* =========================
DAILY WORD
========================= */

function showDailyWord() {

    const today =
        new Date().getDate();

    const dailyWord =
        words[today % words.length];

    showWords([dailyWord]);
}

/* =========================
FAVORITE SYSTEM
========================= */

function toggleFavorite(word) {

    const favoriteMode =
        document.getElementById("favoriteMode").value;

    if (favorites.includes(word)) {

        favorites =
            favorites.filter(w => w !== word);

    } else {

        favorites.push(word);
    }

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

    if (favoriteMode === "true") {

        showFavorites();

    } else {

        showWords(words);
    }
}

function showFavorites() {

    document.getElementById(
        "favoriteMode"
    ).value = "true";

    const favWords =
        words.filter(word =>
            favorites.includes(word.word)
        );

    showWords(favWords);
}

function showAllWords() {

    document.getElementById(
        "favoriteMode"
    ).value = "false";

    showWords(words);
}

/* =========================
DARK MODE
========================= */

function toggleDarkMode() {

    document.body.classList.toggle("dark");
}

/* =========================
PRONUNCIATION
========================= */

function speakWord(word) {

    window.speechSynthesis.cancel();

    const speech =
        new SpeechSynthesisUtterance(word);

    speech.lang = "en-US";

    speech.rate = 0.9;

    speech.pitch = 1;

    speech.volume = 1;

    window.speechSynthesis.speak(speech);
}

/* =========================
COPY WORD
========================= */

function copyWord(word) {

    navigator.clipboard.writeText(word);

    alert(word + " copied!");
}

/* =========================
QUIZ MODE
========================= */

function startQuiz() {

    document
        .getElementById("quizBox")
        .classList
        .remove("hidden");

    currentQuizWord =
        words[
        Math.floor(Math.random() * words.length)
        ];

    document.getElementById(
        "quizQuestion"
    ).innerText = currentQuizWord.word;

    document.getElementById(
        "quizAnswer"
    ).value = "";

    document.getElementById(
        "quizResult"
    ).innerHTML = "";
}

function checkQuiz() {

    const answer =
        document
            .getElementById("quizAnswer")
            .value
            .trim()
            .toLowerCase();

    const correct =
        currentQuizWord.bangla
            .trim()
            .toLowerCase();

    if (answer === correct) {

        quizScore++;

        document.getElementById(
            "quizScore"
        ).innerText = quizScore;

        document.getElementById(
            "quizResult"
        ).innerHTML =
            "✅ Correct Answer";

    } else {

        document.getElementById(
            "quizResult"
        ).innerHTML =
            `❌ Correct: ${currentQuizWord.bangla}`;
    }
}

/* =========================
EVENT LISTENER
========================= */

document
    .getElementById("searchInput")
    .addEventListener("input", filterWords);

document
    .getElementById("categoryFilter")
    .addEventListener("change", filterWords);

/* =========================
START APP
========================= */

populateCategories();

showWords(words);