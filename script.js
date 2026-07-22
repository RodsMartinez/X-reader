document.addEventListener("DOMContentLoaded", function () {
    // --- BACKGROUND + AUDIO LOGIC ---
    let sections = document.querySelectorAll(".section");
    const bgmPlayer = document.getElementById("bgm");
    const bgOverlay = document.createElement("div");
    bgOverlay.classList.add("background-overlay");
    document.body.appendChild(bgOverlay);

    bgmPlayer.volume = 0.1;

    let lastBackground = "";
    let lastBGM = "";
    let activeSFX = new Set();

    function enableAudioOnUserInteraction() {
        function unlockAudio() {
            bgmPlayer.play().catch(() => {});
            document.removeEventListener("click", unlockAudio);
            document.removeEventListener("keydown", unlockAudio);
        }

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                bgmPlayer.pause();
            } else {
                bgmPlayer.play().catch(() => {});
            }
        });

        document.addEventListener("click", unlockAudio);
        document.addEventListener("keydown", unlockAudio);
    }

    function scrollToFirstSection() {
        const firstSection = sections[0];
        if (firstSection) {
            firstSection.scrollIntoView({ behavior: "smooth" });
        }
    }

    function changeBackground(newBackground) {
        if (newBackground && newBackground !== lastBackground) {
            const newOverlay = document.createElement("div");
            newOverlay.classList.add("background-overlay");
            newOverlay.style.backgroundImage = `url('${newBackground}')`;
            newOverlay.style.opacity = "0";
            newOverlay.style.transition = "opacity 1s ease-in-out";

            document.body.appendChild(newOverlay);

            requestAnimationFrame(() => {
                newOverlay.style.opacity = "1";
            });

            setTimeout(() => {
                const oldOverlays = document.querySelectorAll(".background-overlay");
                oldOverlays.forEach((overlay, index) => {
                    if (index < oldOverlays.length - 1) {
                        overlay.remove();
                    }
                });
            }, 1000);

            lastBackground = newBackground;
        }
    }

    function playSoundEffect(sfxFile, section) {
        if (!sfxFile || activeSFX.has(section)) return;

        const sfxPlayer = new Audio(sfxFile);
        sfxPlayer.volume = 0.3;
        sfxPlayer.play().catch(() => {});
        activeSFX.add(section);
    }

    function checkVisibility() {
    let currentVisibleSections = new Set();

    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const opacity = Math.max(0, 1 - Math.abs(rect.top) / window.innerHeight);
        section.style.opacity = opacity;

        if (opacity > 0.5) {
            const newBackground = section.getAttribute("data-background");
            const newBGM = section.getAttribute("data-bgm");
            const newSFX = section.getAttribute("data-sfx");

            changeBackground(newBackground);
            playSoundEffect(newSFX, section);

            if (newBGM === "stops" && bgmPlayer && !bgmPlayer.paused) {
                const fadeOut = () => {
                    return new Promise((resolve) => {
                        const fade = setInterval(() => {
                            if (bgmPlayer.volume > 0.01) {
                                bgmPlayer.volume = Math.max(0, bgmPlayer.volume - 0.01);
                            } else {
                                bgmPlayer.pause();
                                bgmPlayer.volume = 0.1;
                                clearInterval(fade);
                                resolve();
                            }
                        }, 50);
                    });
                };
                fadeOut();
                lastBGM = "";
            }

            if (newBGM && newBGM !== "stops" && newBGM !== lastBGM) {
                const fadeOut = () => {
                    return new Promise((resolve) => {
                        const fade = setInterval(() => {
                            if (bgmPlayer.volume > 0.01) {
                                bgmPlayer.volume = Math.max(0, bgmPlayer.volume - 0.01);
                            } else {
                                bgmPlayer.pause();
                                clearInterval(fade);
                                resolve();
                            }
                        }, 50);
                    });
                };

                const fadeIn = () => {
                    return new Promise((resolve) => {
                        bgmPlayer.volume = 0;
                        bgmPlayer.play().catch(() => {});
                        const fade = setInterval(() => {
                            if (bgmPlayer.volume < 0.1) {
                                bgmPlayer.volume = Math.min(0.1, bgmPlayer.volume + 0.01);
                            } else {
                                clearInterval(fade);
                                resolve();
                            }
                        }, 50);
                    });
                };

                fadeOut().then(() => {
                    bgmPlayer.src = newBGM;
                    lastBGM = newBGM;
                    fadeIn();
                });
            }

            currentVisibleSections.add(section);
        }
    });

    activeSFX.forEach((section) => {
        if (!currentVisibleSections.has(section)) {
            activeSFX.delete(section);
        }
    });
}


    const style = document.createElement("style");
    style.innerHTML = `
        .background-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-size: cover;
            background-position: center;
            transition: opacity 1s ease-in-out;
            z-index: -1;
        }
    `;
    document.head.appendChild(style);

    document.addEventListener("scroll", checkVisibility);
    enableAudioOnUserInteraction();
    scrollToFirstSection();
    checkVisibility();

    // --- WORD COLLECTOR LOGIC ---
    const currentUsername = localStorage.getItem('username');
    let collectedWords = [];

    if (currentUsername) {
        try {
            collectedWords = JSON.parse(localStorage.getItem(`collectedWords_${currentUsername}`)) || [];
        } catch {
            collectedWords = [];
        }
    }

    function animateWordToPopup(wordElement) {
        const flyingWord = wordElement.cloneNode(true);
        const rect = wordElement.getBoundingClientRect();
        const popup = document.getElementById("collected-words-popup");

        flyingWord.style.position = "fixed";
        flyingWord.style.left = `${rect.left}px`;
        flyingWord.style.top = `${rect.top}px`;
        flyingWord.style.zIndex = "2000";
        flyingWord.style.transition = "all 0.7s ease-in-out";

        document.body.appendChild(flyingWord);

        setTimeout(() => {
            const popupRect = popup.getBoundingClientRect();
            flyingWord.style.left = `${popupRect.left}px`;
            flyingWord.style.top = `${popupRect.top}px`;
            flyingWord.style.opacity = "0";
        }, 50);

        setTimeout(() => {
            flyingWord.remove();
        }, 800);
    }

    function updatePopup() {
        const popup = document.getElementById("collected-words-popup");
        if (popup) {
            popup.textContent = `Words Collected: ${collectedWords.length} (click)`;
        }
    }

    window.initWordPopup = function () {
        const collectibleWords = document.querySelectorAll(".collectible-word");
        const popup = document.getElementById("collected-words-popup");
        const modalOverlay = document.getElementById("modal-overlay");
        const collectedWordsList = document.getElementById("collected-words-list");

        if (!popup || !modalOverlay || !collectedWordsList) return;

        popup.onclick = function () {
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

        collectibleWords.forEach(word => {
            word.style.cursor = "pointer";

            word.addEventListener("click", (e) => {
                const wordText = word.textContent.trim();
                const wordType = word.getAttribute("data-type");

                if (!collectedWords.find(w => w.text === wordText)) {
                    collectedWords.push({ text: wordText, type: wordType });

                    if (currentUsername) {
                        localStorage.setItem(`collectedWords_${currentUsername}`, JSON.stringify(collectedWords));
                    }

                    animateWordToPopup(e.target);
                    updatePopup();
                }
            });
        });

        updatePopup();
    };

    initWordPopup();

    window.addEventListener('user-logged-out', () => {
        collectedWords = [];
        updatePopup();
    });

    window.initSections = function () {
        document.removeEventListener("scroll", checkVisibility);
        document.addEventListener("scroll", checkVisibility);
        sections = document.querySelectorAll(".section");
        scrollToFirstSection();
        checkVisibility();
    };

    window.initBranchingChoices = function () {
        const buttons = document.querySelectorAll('.choice-button');

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const branch = button.dataset.branch;
                document.querySelector('.choice-container').style.display = 'none';

                document.querySelectorAll('.branch').forEach(div => div.classList.add('hidden'));
                const chosenBranch = document.querySelector(`.branch-${branch}`);
                if (chosenBranch) {
                    chosenBranch.classList.remove('hidden');
                }

                document.querySelectorAll('.shared-epilogue.hidden').forEach(section => {
                    section.classList.remove('hidden');
                });

                sections = document.querySelectorAll('.section');
                checkVisibility();
            });
        });
    };

    initBranchingChoices();
});

barba.init({
    transitions: [
        {
            name: 'fade',
            leave(data) {
                return gsap.to(data.current.container, {
                    opacity: 0,
                    duration: 0.5
                });
            },
            enter(data) {
                return gsap.from(data.next.container, {
                    opacity: 0,
                    duration: 0.5
                });
            }
        }
    ],
    views: [
        {
            namespace: 'your-page-namespace',
            afterEnter() {
                window.initSections();
                window.initWordPopup();
                window.initBranchingChoices();
            }
        }
    ]
});
