// Main transition setup
barba.init({
    transitions: [
      {
        name: "fade-transition",
        async leave(data) {
          const done = this.async();
          // Fade out current container
          await gsap.to(data.current.container, {
            opacity: 0,
            duration: 0.5,
            ease: "power1.out"
          });
          done();
        },
        async enter(data) {
          // Fade in new container
          await gsap.from(data.next.container, {
            opacity: 0,
            duration: 0.5,
            ease: "power1.out"
          });
        },
        async once(data) {
          // First page load
          gsap.from(data.current.container, {
            opacity: 0,
            duration: 0.5,
            ease: "power1.out"
          });
        }
      }
    ]
  });
  
  // Optional: Re-run scripts after transition
  barba.hooks.afterEnter((data) => {
    if (typeof initWordPopup === "function") initWordPopup();
    if (data.next.namespace === "respond") {
      if (typeof initRespond === "function") initRespond();
    }
  });
  // Optional: Keep music across transitions
  const audio = document.querySelector("audio");
  if (audio) {
    audio.setAttribute("data-persistent", "true");
  }
  
  barba.hooks.beforeLeave(() => {
    document.querySelectorAll("audio:not([data-persistent='true'])").forEach(el => el.remove());
  });
  