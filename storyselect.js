document.addEventListener("DOMContentLoaded", () => {
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    if (!isLoggedIn) {
        // Not logged in — go to intro or show login
        window.location.href = "index.html"; // Or login popup if more appropriate
        return;
    }


    const username = localStorage.getItem("username") || "XReader";

    const phrases = [
        `Yes, ${username}?`,
        "This world remembers you, even if you don't.",
        "You have selected... nothing yet.",
        "Your hesitation is expected. Your mission is not.",
        "If I were to travel anywhere? I'd want to go to a beach. Oh was I out of character for that?",
        "Once the protrocol is complete, I can rest assure a leisure lifestyle. For now focus on the mission.",
        `Do you require recalibration, ${username}?`,
        "Multiple taps registered. Is this intentional?",
        "Redundancy detected. Please proceed with your objective.",
        "No anomalies detected. Yet.",
    ];

    let currentPhrase = 0;
    const canvas = document.getElementById("character-canvas");
    const ctx = canvas.getContext("2d");
    const dialogue = document.getElementById("dialogue-box");

    const img = new Image();
    img.src = "character2full.png";

    img.onload = () => {
        canvas.width = 700;
        canvas.height = 1000;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 50, -100, 700, 1000); // smaller and inset
    };

    canvas.addEventListener("click", (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const alpha = pixel[3]; // alpha channel

        if (alpha > 0) {
            dialogue.textContent = phrases[currentPhrase];
            currentPhrase = (currentPhrase + 1) % phrases.length;
        }
    });

    // --- Words Collected Display Logic ---
    const popup = document.getElementById("collected-words-popup");
    const modalOverlay = document.getElementById("modal-overlay");
    const collectedWordsList = document.getElementById("collected-words-list");

    const currentUsername = localStorage.getItem("username");
    let collectedWords = [];

    if (currentUsername) {
        collectedWords = JSON.parse(localStorage.getItem(`collectedWords_${currentUsername}`)) || [];
    }

    function updatePopup() {
        popup.textContent = `Words Collected: ${collectedWords.length} (click)`;
    }

    window.openCollectedWords = function () {
        collectedWordsList.innerHTML = "";
        const countDiv = document.createElement("div");
        countDiv.textContent = `Total collected: ${collectedWords.length}`;
        countDiv.style.fontWeight = "bold";
        countDiv.style.marginBottom = "10px";
        collectedWordsList.appendChild(countDiv);

        collectedWords.forEach(word => {
            const wordDiv = document.createElement("div");
            wordDiv.textContent = word.text;
            wordDiv.style.color = word.type;
            collectedWordsList.appendChild(wordDiv);
        });

        modalOverlay.style.display = "flex";
    };

    window.closeCollectedWords = function () {
        modalOverlay.style.display = "none";
    };

    modalOverlay.addEventListener("click", function (event) {
        if (event.target === modalOverlay) {
            closeCollectedWords();
        }
    });

    updatePopup();
});
const bgm = document.getElementById("bgm");
bgm.volume = 0.1;

bgm.addEventListener("canplaythrough", () => {
    bgm.play().catch(e => {
        // Some browsers block autoplay until user interacts with the page
        console.warn("BGM autoplay was blocked. It will start after user interaction.");
    });
});
document.querySelectorAll('.hover-swap').forEach(img => {
    const originalSrc = img.src;
    const hoverSrc = img.dataset.hover;
  
    img.addEventListener('mouseenter', () => {
      img.src = hoverSrc;
    });
  
    img.addEventListener('mouseleave', () => {
      img.src = originalSrc;
    });
  });