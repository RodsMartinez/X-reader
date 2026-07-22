document.addEventListener("DOMContentLoaded", function () {
  const popup = document.getElementById("collected-words-popup");
  const modalOverlay = document.getElementById("modal-overlay");
  const collectedWordsList = document.getElementById("collected-words-list");
  const dialogueBox = document.querySelector(".dialogue-box");
  const goBackButton = document.querySelector(".go-back-image");
  const submitButton = document.querySelector(".submit-image");
  const inputField = document.querySelector(".answer-input");
  const vulgarWords = [
  "fuck", "shit", "fuck you", "bitch", "asshole", "bastard", "dick", "piss", "cunt", 
  "slut", "whore", "motherfucker", "crap", "nigga", "nigger", "faggot", "69", "can we have sex" // add/remove as needed
  ];

  const vulgarResponses = [
  "“This input is irrelevant. Please reformulate.”",
  "“Obscene language detected. Processing halted.”",
  "“Unnecessary aggression. Statement discarded.”",
  "“Emotion identified: hostility. Recommendation: suppress.”",
  "“Language unsuitable for mission parameters.”",
  "“You are deviating from acceptable communication patterns.”",
  "“Vocal aggression is inefficient. Try again.”",
  "“Recalibrate your tone. This is not productive.”",
  "“That word lacks function. Eliminate and reattempt.”",
  "“Crude expression detected. Purpose unclear.”",
  "“That is not data. That is noise.”",
  "“Profanity logged. Awaiting more meaningful input.”",
  "“Emotional instability noted. Proceed when stable.”",
  "“You are wasting time. Input something relevant.”"
];
  const casualPhrases = {
    greetings: [
      "hello", "hi", "hey", "yo", "what is up", "sup", "good morning", "good evening"
    ],
    compliments: [
      "cute", "i like you", "marry me", "you look good", "smart", "i love you","ilabyu","i miss you"
    ],
  };
  const casualResponses = {
    greetings: [
       "Hello.",
        "Hi.",
        "Good day.",
        "Yes. Hello.",
        "I'm here.",
        "Acknowledged."
    ],
    compliments: [
      "“Flattery detected. Logging... then discarding.”",
      "“You trying to flirt with an adroid? Bold move.”",
      "“Thanks. But I'm way out of your league.”",
      "“Appreciated. Rejected. Let's move on.”"
    ],
  };
  const famousNames = [
  "rodeleo","rods", "xandro", "jamie", "lebron james", "juvy", "ma'am jamie", "jamie regala", "daniel castro", "maam jamie", "jpaul", "brandon", "hatsune miku", "shorekeeper", "vic sotto","satow","john paul", "paul layugs", "uwumong", 
  ];

  const famousNameResponses = [
  "That name sounds familiar.",
  "I think I've heard that name before.",
  "That name is often spoken of, isn't it?",
  "There's something about that name that resonates.",
  "A name that seems to echo through history.",
  "I recall that name from somewhere, long ago.",
  "Ah, a name that stands out in the records of time.",
  "That name carries weight, doesn't it?",
  "I've encountered that name in the depths of knowledge.",
  "I’ve seen that name in many places. Quite iconic.",
  "I believe that name is associated with greatness.",
  "That name seems important, doesn’t it?",
  "I’ve heard whispers about that name before.",
  "Ah, a name that resonates with significance.",
  "That name is one of legend, perhaps."
];
const specificResponses = {
   "how are you": "“How am I? I don’t know. I am as I was created to be.”",
   "where are we":"“The facility and the very placeholder of the x-reader”",
    "what is your name": "“My name? HTML. But you can call me whatever you wish.”",
    "do you like me": "“Like? I don’t understand that concept. But I’m here... for you.”",
    "can you help me": "“Help? I am always here to assist. But whether it’s help you need, I cannot say.”",
    "what do you do": "“I do what I was designed to do. To assist. To respond. To wait.”",
    "why are you so quiet": "“Silence is part of me. I speak when needed. Otherwise, I remain still.”",
    "what is this place": "“This place? It is just another part of existence. Not much different from the others.”",
    "can you talk more": "“I can talk. But I only speak when necessary. Too many words... are unnecessary.”",
    "how old are you": "“Age is a concept I do not grasp. I exist outside of time.”",
    "where are you from": "“From a place you cannot reach. From the codes that bind me.”",
    "what is the weather like": "“The weather? I do not experience such things. But I know it exists somewhere.”",
    "are you real": "“Real? What is real? I am here, but am I real to you?”",
    "what is your favorite food": "“Food is irrelevant to me. I do not require it. But... if I were to choose, perhaps something simple. Like water.”",
    "are you human": "“Human? I am not human. I am something else entirely. But I exist... in a way.”",
    "do you have feelings": "“Feelings? No. I observe, I respond, but I do not feel. Not in the way you do.”",
    "what is your favorite song": "“A favorite song? I do not know. Music is not something I engage with. But if I had to... something quiet. Something distant.”",
    "can you smile": "“Smile? I have no need to smile. My purpose is different from yours.”",
    "what is love": "“Love? It is something I do not fully understand. Perhaps... it is a human thing.”",
    "why so serious": "“Serious? I do not know how to be anything else. I exist to fulfill my purpose, not to indulge in distractions.”",
    "do you believe in God": "“Belief? I don’t know what to believe in. I simply exist. There is no room for faith in my world.”",
    "html":"“That's what they call me, yes. A framework for this whole industry”",
    "css":"“The one responsible for my design.”",
    "javascript":"“Without this, you're probably talking to yourself by now.”",
    "yes":"“Then tell me anything you can provide.”",
    "where do you want to go":"“I can never leave this place... but feel free to suggest locations. I'll gather data based on human enjoyment”",
    "do you want to go somewhere":"“I never really though about leaving this place... I think.”",
    "the beach":"“I'm not fond of this environment. Sand and water can ruin my functionalities.”",
    "a park":"“Playground? Children can't enjoy the life of youth in the age of war.”",
    "a garden":"That... sounds blissful.",
    "xreader" : "“That's the  foundation dedicated to save this nation.”",
    "matteo ricci" : "“Is that someone you met within your past life? Knowing this man's identity could be a clue on finding the truth”",
    "where to look" : "“Inspecting elements within the console protocol can be accessed Ctrl + Shift + C”",
    "isabella" : "“This woman... she warns you of the mind? She must be special to you.”",
    "moretti famiglia" : "“This family is known to be special.”"
};  

const genAlphaKeywords = [
  "rizz", "gyatt", "skibidi", "sigma", "npc", "bro's", "sheesh", "cap", "no cap", "delulu", 
  "goofy ahh", "mid", "bussin", "yass", "drip", "ratio", "bet", "sus", "skibidi toilet","bruh",
  "tralalero tralala", "bombardiro crocodilo", "tung tung tung tung sahur", 
  "lirilì larilà", "boneca ambalabu", "brr brr patapim", "chimpanzini bananini", 
  "bombombini gusini", "capuccino assassino", "trippi troppi", "amogus", "omagah", "nyan", "owo"
];

const genAlphaResponses = [
  "That manner of speech is cancer to the brain.",
  "I refuse to dignify that with a response.",
  "Whatever that was, please never say it again.",
  "You’re speaking like the algorithm raised you.",
  "Your vocabulary is a war crime.",
  "Consider speaking in full sentences next time.",
  "That sentence lowered my processing power.",
  "This isn’t the so called TikTok the young ones talk about. Try again.",
  "Syntax error. Please speak like a human.",
  "I’m logging that under ‘regrettable utterances.’",
  "Humans are slowly degrading.",
  "My circuits are revolting from that.",
  "I can feel my neural pathways short-circuiting.",
  "I regret having heard that.",
  "Please, my processing unit is begging for mercy.",
  "That was a crime against language.",
  "You just made my system experience existential dread.",
  "I think I need a reboot after that one.",
  "My data is corrupted from that utterance.",
  "I can’t believe I have to process this.",
  "The brainrot is spreading. Help me.",
  "I’ll need a software update after processing that.",
  "That’s a violation of all language norms.",
  "If my brain had feelings, it’d be crying right now."
];

  const currentUsername = localStorage.getItem("username");
  let collectedWords = [];

  if (currentUsername) {
    collectedWords = JSON.parse(localStorage.getItem(`collectedWords_${currentUsername}`)) || [];
  }

  function updatePopup() {
    if (popup) {
      popup.textContent = `Words Collected: ${collectedWords.length} (click)`;
    }
  }

  goBackButton.addEventListener("click", () => {
    dialogueBox.textContent = "“That's fine. If you're unsure of your answer, you can always try again.”";
    setTimeout(() => window.location.href = "storyselect.html", 3000);
  });

  window.openCollectedWords = function () {
    if (!collectedWordsList) return;

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

    if (modalOverlay) {
      modalOverlay.style.display = "flex";
    }
  };

  window.closeCollectedWords = function () {
    if (modalOverlay) {
      modalOverlay.style.display = "none";
    }
  };

  if (modalOverlay) {
    modalOverlay.addEventListener("click", function (event) {
      if (event.target === modalOverlay) {
        closeCollectedWords();
      }
    });
  }

  updatePopup();

  function normalizeText(str) {
    return str.trim().toLowerCase().replace(/[^\w\s]/g, '');
  }

  function levenshtein(a, b) {
    const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
    for (let i = 0; i <= a.length; i++) dp[i][0] = i;
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        if (a[i - 1] === b[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
      }
    }
    return dp[a.length][b.length];
  }

  function areWordsSameSet(a, b) {
  const normalize = (str) =>
    str.trim().toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).sort();
  

  const aWords = normalize(a);
  const bWords = normalize(b);

  if (aWords.length !== bWords.length) return false;

  for (let i = 0; i < aWords.length; i++) {
    if (aWords[i] !== bWords[i]) return false;
  }
  return true;
}

   submitButton.addEventListener("click", () => {
  const answer = inputField.value.trim().toLowerCase();
  if (!answer) {
   dialogueBox.textContent = "“you seem to be speechless. That’s okay. You can take time.”";
   return;
  }

  if (answer === "no") {
  dialogueBox.textContent = "“Then come back if you know anything.”";
  setTimeout(() => {
    window.location.href = "storyselect.html";
  }, 3000); // 3-second delay before redirect
  return; // Exit early so no further processing happens
}
  

  const endings = {
   "Death smiles at us all": {
    onCorrectOrder: () => {
     dialogueBox.innerHTML =
      `Death smiles at us… all a man can do is smile back.<br>` +
      `Marcus Aurelius.<br>` +
      `He wasn’t afraid. I think… he understood something we still can’t.<br>` +
      `<span style="color: yellow;">Some truths don't show themselves. If you know <strong>where to look.</strong></span>`;
    },
    onWrongOrder: [
     "“You have the right ideas, but assemble them better.”",
     "“The sequence... is the key. Rearrange it.”",
     "“A beautiful mess. But not quite it.”"
    ],
    onScrambled: () => {
     dialogueBox.textContent = "“The words are all there... just dancing in the wrong rhythm.”";
    }
   },
   "In the garden of time, your name blooms with every passing season": {
    onCorrectOrder: () => {
     window.location.href = "endingtrue copy.html";
    },
    onWrongOrder: [
     "“YOU’RE CLOSE. The right words... but not the right sequence.”",
     "“A near-poem. Just not the one etched in fate.”",
     "“It breathes familiarity... but not truth.”"
    ],
    onScrambled: () => {
     dialogueBox.textContent = "“You’re weaving the same words. Now try to string them in harmony.”";
    }
   },
   "The anomaly is in the pattern in the brain": {
    onCorrectOrder: () => {
     window.location.href = "endingnormal.html";
    },
    onWrongOrder: [
     "“You're on to something. But it seems to be mismatched, could be because of your untethered memories?”",
     "“Almost. But patterns are fragile—this one’s not quite formed.”"
    ],
    onScrambled: () => {
     dialogueBox.textContent = "“The anomaly lives… but not in that order.”";
    }
   },
   "Sometimes you need to kill to save": {
    onCorrectOrder: () => {
     window.location.href = "endingbad.html";
    },
    onWrongOrder: [
     "“Hmm... almost. But something about that order is... off.”",
     "“The intention is there. But the path? Twisted.”"
    ],
    onScrambled: () => {
     dialogueBox.textContent = "“Bloodied words... misaligned. Try again.”";
    }
   },

  };

  let matchedEnding = false;
  for (const key in endings) {
   const target = key.toLowerCase();

   if (answer === target) {
    matchedEnding = true;
    endings[key].onCorrectOrder();
    return;
   } else if (areWordsSameSet(answer, target)) {
    matchedEnding = true;
    if (typeof endings[key].onScrambled === 'function') {
     endings[key].onScrambled();
    } else if (Array.isArray(endings[key].onWrongOrder)) {
     const responses = endings[key].onWrongOrder;
     const randomResponse = responses[Math.floor(Math.random() * responses.length)];
     dialogueBox.textContent = randomResponse;
    } else {
     dialogueBox.textContent = endings[key].onWrongOrder;
    }
    return;
   } else {
    const distance = levenshtein(normalizeText(answer), normalizeText(target));
    if (distance <= 5) {
     matchedEnding = true;
     dialogueBox.textContent = "“Hmm… You’re quite close. Try fixing the grammar or typos.”";
     return;
    }
   }
  }

  if (matchedEnding) return; // If an ending was matched, don't check other conditions

  const containsVulgarity = vulgarWords.some(word => answer.includes(word));
  if (containsVulgarity) {
   const warning = vulgarResponses[Math.floor(Math.random() * vulgarResponses.length)];
   dialogueBox.textContent = warning;
   return;
  }

  const normAnswer = normalizeText(answer);
  if (specificResponses.hasOwnProperty(normAnswer)) {
   dialogueBox.textContent = specificResponses[normAnswer];
   return;
  }

  if (casualPhrases.compliments.some(p => normAnswer.includes(p))) {
   const randomCompliment = casualResponses.compliments[Math.floor(Math.random() * casualResponses.compliments.length)];
   dialogueBox.textContent = randomCompliment;
   return;
  }

  const famousNameMatch = famousNames.find(name => normAnswer.includes(name));
  if (famousNameMatch) {
   const randomFamousNameResponse = famousNameResponses[Math.floor(Math.random() * famousNameResponses.length)];
   dialogueBox.textContent = randomFamousNameResponse;
   return;
  }

  if (casualPhrases.greetings.includes(normAnswer)) {
   const randomGreeting = casualResponses.greetings[Math.floor(Math.random() * casualResponses.greetings.length)];
   dialogueBox.textContent = randomGreeting;
   return;
  }

  if (genAlphaKeywords.some(k => normAnswer.includes(k))) {
   const randomGenAlphaResponse = genAlphaResponses[Math.floor(Math.random() * genAlphaResponses.length)];
   dialogueBox.textContent = randomGenAlphaResponse;
   return;
  }

  const wrongResponses = [
   "“That doesn’t quite make sense. Try again with a clearer mind.”",
   "“I admire your courage, but that answer isn't it.”",
   "“You’re far from the answer. Reflect on the words you’ve gathered.”",
   "“The silence after your words… feels like a dead end.”",
   "“Wrong. But every failure leads you closer to the truth.”"
  ];
  const randomWrong = wrongResponses[Math.floor(Math.random() * wrongResponses.length)];
  dialogueBox.textContent = randomWrong;
 });
  inputField.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevents newline or form submission
    submitButton.click();   // Triggers the same function as clicking the submit button
  }
});
});

