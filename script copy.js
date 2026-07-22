// === MASTER SCRIPT WITH FIXES ===
document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll(".section");
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

   let lastActiveSection = null; // 🔄 Move this to global scope

        function checkVisibility() {
            let topSection = null;
            let topOpacity = 0;
            let currentVisibleSections = new Set();

            document.querySelectorAll('.section').forEach((section) => {
                const style = window.getComputedStyle(section);
                if (style.display === "none" || style.visibility === "hidden") return;

                const rect = section.getBoundingClientRect();
                const opacity = Math.max(0, 1 - Math.abs(rect.top) / window.innerHeight);
                section.style.opacity = opacity;

                if (opacity > 0.5) {
                    currentVisibleSections.add(section);
                    if (opacity > topOpacity) {
                        topOpacity = opacity;
                        topSection = section;
                    }
                }
            });

            // 🔍 Only trigger changes if a new top visible section appears
            if (topSection && topSection !== lastActiveSection) {
                const newBackground = topSection.getAttribute("data-background");
                const newBGM = topSection.getAttribute("data-bgm");
                const newSFX = topSection.getAttribute("data-sfx");

                changeBackground(newBackground);
                playSoundEffect(newSFX, topSection);

                if (newBGM && newBGM !== lastBGM) {
                bgmPlayer.src = newBGM;
                bgmPlayer.load();

                bgmPlayer.addEventListener("canplaythrough", function onReady() {
                    bgmPlayer.play().catch(() => {});
                    bgmPlayer.removeEventListener("canplaythrough", onReady);
                });

                lastBGM = newBGM;
            }
                lastActiveSection = topSection;
            }

            // 🔇 Clean up SFX tracking
            activeSFX.forEach((section) => {
                if (!currentVisibleSections.has(section)) {
                    activeSFX.delete(section);
                }
            });
        }

   function initSections() {
    document.removeEventListener("scroll", checkVisibility);
    document.addEventListener("scroll", checkVisibility);

    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => checkVisibility(), { timeout: 500 });
    } else {
        setTimeout(() => checkVisibility(), 100);
    }
}

    // Style for background transitions
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

    enableAudioOnUserInteraction();
    initSections();

    // Init branching logic
    function initBranchingChoices() {
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

                setTimeout(() => {
                checkVisibility();
                    }, 50);

            });
        });
    }

    initBranchingChoices();
});
