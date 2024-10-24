let availableToReveal = false;
console.log('here in hoes')
// container
const container = document.getElementById("reveal");

const startOffset = 250; // pixels

const containerHeight = container.clientHeight;
const containerStart = container.getBoundingClientRect().top + window.pageYOffset - startOffset;
const containerEnd = containerStart + containerHeight;

// gets all words
const words = container.getElementsByTagName("span");
const textContainer = container.getElementsByClassName("text")[0];
const textContainerContent = textContainer.getElementsByTagName("p")[0];

// gets the amount of pixels per each word (halved to make it twice as fast)
const pixelsPerWord = Math.round(containerHeight / words.length / 2);

console.log(`Container height: ${containerHeight}px`);
console.log(`Container start: ${containerStart}px`);
console.log(`Container end: ${containerEnd}px`);
console.log(`Words count: ${words.length}`);
console.log(`Pixels per word: ${pixelsPerWord}px`);

// returns the current scroll position of the page
const getCurrentScroll = () => {
    return document.documentElement.scrollTop || document.body.scrollTop;
};

// reveals the active words
const fitText = () => {
    let fontSize = 52;

    while (
        textContainerContent.offsetWidth > textContainer.offsetWidth ||
        textContainerContent.offsetHeight > textContainer.offsetHeight
    ) {
        fontSize--;

        if (fontSize <= 10) {
            break;
        }

        textContainerContent.style.fontSize = fontSize + "px";
    }

    console.log(`Fitted font size: ${fontSize}px`);
};

const revealActiveWords = () => {
    const currentScrollPosition = getCurrentScroll();

    let activeWords;
    const containerCurrentScroll = currentScrollPosition - containerStart;

    // gets the number of active words
    if (currentScrollPosition > containerEnd) {
        activeWords = words.length;
    } else if (currentScrollPosition < containerStart) {
        activeWords = 0;
    } else {
        availableToReveal = true;
        activeWords = Math.round(containerCurrentScroll / pixelsPerWord);
    }

    console.log(`Current scroll position: ${currentScrollPosition}px`);
    console.log(`Active words: ${activeWords}`);

    if (availableToReveal) {
        for (var i = 0; i < words.length; i++) {
            if (activeWords > i) {
                words[i].style.opacity = 1;
            } else {
                words[i].style.opacity = 0.1;
            }
        }
    }

    if (
        currentScrollPosition > containerEnd ||
        currentScrollPosition < containerStart
    ) {
        availableToReveal = false;
    }

    console.log(`Available to reveal: ${availableToReveal}`);
};

// init
fitText();
revealActiveWords();

document.addEventListener("scroll", () => {
    revealActiveWords();
});

window.addEventListener("resize", () => {
    fitText();
    console.log("Window resized, text refitted");
});
