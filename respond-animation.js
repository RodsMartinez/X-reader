document.addEventListener("DOMContentLoaded", () => {
    const character = document.getElementById("character-image");

    // Initial state: off-screen
    gsap.set(character, { x: 300, opacity: 0 });

    // Animate in on load
    gsap.to(character, {
        duration: 1,
        x: 0,
        opacity: 1,
        ease: "power2.out"
    });
});
