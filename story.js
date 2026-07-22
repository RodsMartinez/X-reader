document.addEventListener("DOMContentLoaded", () => {
    const returnButton = document.getElementById("return-button");

    if (returnButton) {
        returnButton.addEventListener("click", () => {
            const pageName = window.location.pathname.split("/").pop().split(".")[0];  // Get the page name, e.g., story5
            const username = localStorage.getItem("username") || "XReader";

            // Set different dialogues based on the current page
            let returnDialogue;
            if (pageName === "STORY1") {
                returnDialogue = [
                    `Welcome back, ${username}. You look lonely?`
                ];
            } else if (pageName === "STORY2") {
                returnDialogue = [
                    `Hello, ${username}. You look traumatized? Was your previous life that traumatizing?`
                ];
            } else if (pageName === "STORY3") {
                returnDialogue = [
                    `Ah, ${username}, you look determined. That look on your face suits you.`
                ];
            } else if (pageName === "STORY4") {
                returnDialogue = [
                    `Hm? ${username}, you look shocked and confused`
                ];
            } else if (pageName === "STORY5") {
                returnDialogue = [
                    `${username}. That expression looks resolute.`
                ];
            } else {
                // Default case if no specific page is found
                returnDialogue = [
                    `Welcome back, ${username}. What awaits now?`
                ];
            }

            // Store the dialogue in localStorage with the current page name
            localStorage.setItem("returnDialogue", JSON.stringify(returnDialogue));
            localStorage.setItem("currentPage", pageName);  // Store the page name

            // Add GSAP transition for fade-out effect
            gsap.to(document.body, {
                opacity: 0,
                duration: 1,  // You can change this duration to make it slower/faster
                onComplete: () => {
                    // After the fade-out, redirect to storyselect.html
                    setTimeout(() => {
                        window.location.href = "storyselect.html";
                    }, 500);  // Delay before redirecting to allow the fade-out to complete
                }
            });
        });
    }
});
