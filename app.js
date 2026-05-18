let words = [];

let filteredWords = [];

let favorites =
    JSON.parse(
        localStorage.getItem("favorites")
    ) || [];

let currentQuizWord = null;

let currentIndex = 0;

const wordsPerLoad = 20;

/*
========================
LOAD WORDS
========================
*/

async function loadWords() {

    try {

        const response =
            await fetch("words.json");

        words =
            await response.json();

        filteredWords = words;

        populateCategories();

        showWords(words);

    } catch (error) {

        console.log(error);
    }
}

/*
========================
CATEGORY
========================
*/

function populateCategories() {

    const select =
        document.getElementById(
            "categoryFilter"
        );

    const categories = [

        ...new Set(
            words.map(w => w.category)
        )

    ];

    categories.forEach(category => {

        const option =
            document.createElement("option");

        option.value = category;

        option.textContent = category;

        select.appendChild(option);
    });
}

/*
========================
SHOW WORDS
========================
*/

function showWords(data, reset = true) {

    const container =
        document.getElementById(
            "wordContainer"
        );

    if (reset) {

        container.innerHTML = "";

        currentIndex = 0;
    }

    if (data.length === 0) {

        container.innerHTML = `

      <div class="text-center col-span-full">

        <h2 class="text-2xl font-bold">

          No Words Found 😢

        </h2>

      </div>
    `;

        return;
    }

    const nextWords = data.slice(

        currentIndex,

        currentIndex + wordsPerLoad
    );

    const cards = nextWords.map(word => {

        const isFav =
            favorites.includes(word.word);

        return `

      <div class="card bg-white w-full p-4 rounded-2xl shadow-lg overflow-hidden">

        <div class="flex justify-between items-start gap-3 flex-wrap">

          <div class="flex-1 min-w-0">

            <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-blue-700 break-words">

              ${word.word}

            </h2>

            <p class="mt-2 text-sm md:text-base break-words">

              🔊 ${word["উচ্চারণ"]}

            </p>

          </div>

          <button
            onclick="toggleFavorite('${word.word}')"
            class="text-3xl"
          >

            ${isFav ? "❤️" : "🤍"}

          </button>

        </div>

        <p class="mt-3 text-lg break-words">

          🇧🇩 ${word.bangla}

        </p>

        <p class="mt-2 break-words">

          ${word.category}

        </p>

        <div class="mt-4">

          <p class="sentence italic text-gray-600 text-sm md:text-base break-words">

            "${word.sentence}"

          </p>

          <p class="sentenceBangla mt-2 text-green-600 text-sm md:text-base break-words">

            ${word.sentenceBangla}

          </p>

        </div>

        <button
          onclick="speakWord('${word.word}')"
          class="bg-blue-600 text-white px-4 py-2 rounded-xl w-full mt-4"
        >

          🔊 Speak

        </button>

       

      </div>
    `;
    });

    container.innerHTML +=
        cards.join("");

    currentIndex += wordsPerLoad;

    const loadMoreBtn =
        document.getElementById(
            "loadMoreBtn"
        );

    if (currentIndex >= data.length) {

        loadMoreBtn.style.display =
            "none";

    } else {

        loadMoreBtn.style.display =
            "inline-block";
    }
}

/*
========================
LOAD MORE
========================
*/

function loadMoreWords() {

    showWords(filteredWords, false);
}

/*
========================
VOICE
========================
*/

// function speakWord(word) {

//     speechSynthesis.cancel();

//     const speech =
//         new SpeechSynthesisUtterance(word);

//     speech.lang = "en-US";

//     speech.rate = 0.9;

//     speech.pitch = 1;

//     speech.volume = 1;

//     speechSynthesis.speak(speech);
// }


function speakWord(word, gender = 'female') { // ডিফল্টভাবে female সেট করা
    speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(word);
    speech.lang = "en-US";
    speech.rate = 0.9;
    speech.pitch = 1;
    speech.volume = 1;

    // ব্রাউজারে উপলব্ধ সব ভয়েস নিয়ে আসা
    const voices = speechSynthesis.getVoices();

    // ইংরেজি (en) ভয়েসগুলো ফিল্টার করা
    const enVoices = voices.filter(v => v.lang.startsWith('en'));

    if (enVoices.length > 0) {
        // মেল বা ফিমেল অনুযায়ী ভয়েস খোঁজা (ভয়েসের নামের ওপর ভিত্তি করে)
        const selectedVoice = enVoices.find(voice => {
            const name = voice.name.toLowerCase();
            if (gender === 'male') {
                return name.includes('male') || name.includes('google us english') || name.includes('david');
            } else {
                return name.includes('female') || name.includes('zira') || name.includes('microsoft') || name.includes('google');
            }
        });

        // যদি পছন্দের ভয়েস পাওয়া যায়, তা সেট করা, না হলে প্রথম ইংরেজি ভয়েসটি নেওয়া
        speech.voice = selectedVoice || enVoices[0];
    }

    speechSynthesis.speak(speech);
}
// ব্রাউজারে ভয়েস রেডি হলে এই ইভেন্টটি ফায়ার হয়
window.speechSynthesis.onvoiceschanged = function () {
    // ভয়েস লোড হয়ে গেলে এখন আপনি কল করতে পারেন
    console.log("Voices are ready!");
};



/*
========================
COPY
========================
*/

// function copyWord(word) {

//     navigator.clipboard.writeText(word);

//     alert("Copied: " + word);
// }

/*
========================
FILTER
========================
*/

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

    filteredWords = words.filter(word => {

        const matchSearch =

            word.word
                .toLowerCase()
                .includes(search)

            ||

            word.bangla.includes(search);

        const matchCategory =

            category === "all"

            ||

            word.category === category;

        return matchSearch &&
            matchCategory;
    });

    showWords(filteredWords);
}

/*
========================
RANDOM
========================
*/

function showRandomWord() {

    if (filteredWords.length === 0) {

        return;
    }

    const randomWord =

        filteredWords[
        Math.floor(
            Math.random() *
            filteredWords.length
        )
        ];

    showWords([randomWord]);
}

/*
========================
FAVORITE
========================
*/

function toggleFavorite(word) {

    if (favorites.includes(word)) {

        favorites =
            favorites.filter(
                w => w !== word
            );

    } else {

        favorites.push(word);
    }

    favorites = [...new Set(favorites)];

    localStorage.setItem(

        "favorites",

        JSON.stringify(favorites)
    );

    showWords(filteredWords);
}

function showFavorites() {

    const favWords =
        words.filter(word =>

            favorites.includes(word.word)
        );

    showWords(favWords);
}

function showAllWords() {

    filteredWords = words;

    showWords(filteredWords);
}

/*
========================
DARK MODE
========================
*/

if (localStorage.getItem("theme")
    === "dark") {

    document
        .getElementById("body")
        .classList
        .add("dark");
}

function toggleDarkMode() {

    const body =
        document.getElementById("body");

    body.classList.toggle("dark");

    localStorage.setItem(

        "theme",

        body.classList.contains("dark")
            ? "dark"
            : "light"
    );
}

/*
========================
QUIZ
========================
*/

function startQuiz() {

    document
        .getElementById("quizBox")
        .classList
        .remove("hidden");

    currentQuizWord =

        words[
        Math.floor(
            Math.random() *
            words.length
        )
        ];

    document.getElementById(
        "quizQuestion"
    ).innerText =
        currentQuizWord.word;

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
            .trim();

    if (
        answer ===
        currentQuizWord.bangla
    ) {

        document.getElementById(
            "quizResult"
        ).innerHTML =

            "✅ Correct";

    } else {

        document.getElementById(
            "quizResult"
        ).innerHTML =

            `❌ Wrong <br>
       Correct:
       ${currentQuizWord.bangla}`;
    }
}

/*
========================
EVENTS
========================
*/

document
    .getElementById("searchInput")
    .addEventListener(
        "input",
        filterWords
    );

document
    .getElementById("categoryFilter")
    .addEventListener(
        "change",
        filterWords
    );

/*
========================
START
========================
*/

loadWords();