import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger"; 
import LocomotiveScroll from 'locomotive-scroll';
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);
const scroll = new LocomotiveScroll({
  el: document.querySelector('[data-scroll-container]'),
  smooth: true
});

const produtoSection = document.querySelector(".produto_section");
let painel = document.querySelector(".painel");

let sections = gsap.utils.toArray(".painel");

let scrollTween = gsap.to(sections, {
    xPercent: -100 * (sections.length - 1),
    ease:"none", //Importante!!
    scrollTrigger: {
        trigger:produtoSection,
        pin:true, 
        scrub:.01,
        end:"+=3000"
    }
})

// Lenis
const lenis = new Lenis();

lenis.on('scroll', (e) => {
    // console.log(e);
})

function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}

requestAnimationFrame(raf);

const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

function smoothMoves(event) {
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  gsap.to(circle, { duration: 1.5, attr: { cx: mouseX, cy: mouseY } });
}

function expandHero() {
  tl.to(circle, {
    duration: 1,
    attr: {
      r: "1000"
    },
    ease: "power2.inOut"
  })
    .to(
      hero,
      {
        duration: 1,
        scale: 1,
        borderRadius: 0,
        ease: "power2.inOut"
      },
      "-=0.5"
    )
    .to(body, {
      overflow: "auto"
    });
}

document.addEventListener("mousemove", smoothMoves);
hero.addEventListener("click", expandHero);