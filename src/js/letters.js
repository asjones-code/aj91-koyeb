const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let interval = null;

// Store the original value (text) inside the h4 tag
const originalText = document.querySelector("h4").innerText;

document.querySelector("h4").onmouseover = event => {  
  let iteration = 0;
  
  // Change the innerText directly to the new hover text
  const hoverText = "Web Developer";  // <-- Change this to the new text you want on hover
  clearInterval(interval);

  interval = setInterval(() => {
    event.target.innerText = event.target.innerText
      .split("")
      .map((letter, index) => {
        if (index < iteration) {
          return hoverText[index] || "";  // Change the inner text to the new hover text
        }
        return letters[Math.floor(Math.random() * 26)];
      })
      .join("");
    
    if (iteration >= hoverText.length) { 
      clearInterval(interval);
      event.target.innerText = hoverText; // Ensure the full hover text is displayed after animation
    }
    
    iteration += 1 / 3;
  }, 30);
};

document.querySelector("h4").onmouseleave = event => {
  let iteration = 0;
  clearInterval(interval);

  interval = setInterval(() => {
    event.target.innerText = event.target.innerText
      .split("")
      .map((letter, index) => {
        if (index < iteration) {
          return originalText[index] || "";  // Return to original text on mouse leave
        }
        return letters[Math.floor(Math.random() * 26)];
      })
      .join("");

    if (iteration >= originalText.length) {
      clearInterval(interval);
      event.target.innerText = "poop"; // Ensure the full original text is displayed after animation
    }

    iteration += 1 / 3;
  }, 30);
};
