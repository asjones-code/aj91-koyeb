//document.querySelector(".menuToggle").addEventListener("click", ToggleMenu);


function ToggleMenu(){
    //const menuToggle = document.querySelector('.menuToggle');
    //const navigation = document.querySelector('.navigation');
    //menuToggle.classList.toggle('active');
    //navigation.classList.toggle('active');
}
window.addEventListener("scroll",function(){
    var header = document.querySelector("header");
    header.classList.toggle('sticky',window.scrollY > 0);
    
})

// Effect for nav (Credit: Alain @ Codepen)

const word = document.querySelector(".word");

  const shadow = e => {
    const { x, y } = e;
    const gBCR = word.getBoundingClientRect();
    const w = this;
    const xM = (x - gBCR.left - gBCR.width / 2) / gBCR.width * .5;
    const yM = (y - gBCR.top - gBCR.height / 2) / gBCR.height * .5;
    
    transform(xM, yM);
  };

  const transform = (x, y) => {
    word.style.textShadow = `${x}px ${-y}px 0px rgb(102, 249, 255, 0.7),
                             ${-x}px ${y}px 0px rgb(255, 35, 251, 0.7),
                             ${y}px ${-x}px 0px rgb(255, 255, 73, 0.7),
                             ${-y}px ${x}px 0px rgb(102, 249, 255, 0.7)`;
  };

  window.addEventListener("mousemove", shadow);