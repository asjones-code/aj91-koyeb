const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let interval = null;

// Store the original value (text) inside the h4 tag
const originalText = document.querySelector("h4").innerText;

document.querySelector("h4").onmouseover = event => {  
  let iteration = 0;
  
  // Change data-value to the new text when hovering
  event.target.setAttribute("data-value", "MOUSEOVER"); // New hover text

  clearInterval(interval);

  interval = setInterval(() => {
    event.target.innerText = event.target.innerText
      .split("")
      .map((letter, index) => {
        if (index < iteration) {
          return event.target.dataset.value[index];
        }
        return letters[Math.floor(Math.random() * 26)];
      })
      .join("");
    
    if (iteration >= event.target.dataset.value.length) { 
      clearInterval(interval);
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
          return originalText[index];  // Return to original text on mouse leave
        }
        return letters[Math.floor(Math.random() * 26)];
      })
      .join("");

    if (iteration >= originalText.length) {
      clearInterval(interval);
    }

    iteration += 1 / 3;
  }, 30);
};