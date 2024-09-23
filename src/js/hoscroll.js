import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger"; 
import LocomotiveScroll from 'locomotive-scroll';

gsap.registerPlugin(ScrollTrigger);

const pageContainer = document.querySelector(".container");

const produtoSection = document.querySelector(".produto_section");
let painel = document.querySelector(".painel");
let sections = gsap.utils.toArray(".painel");

/* SMOOTH SCROLL */
const scroller = new LocomotiveScroll({
  el: pageContainer,
  smooth: true
});

gsap.registerPlugin(ScrollTrigger);

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