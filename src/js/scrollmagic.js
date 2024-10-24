// Import statements
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollMagic from "scrollmagic";
import Splitting from "splitting";


gsap.registerPlugin(ScrollTrigger);

gsap.set('section.footer-container', { yPercent: -50 })

const uncover = gsap.timeline({ paused:true })

uncover
.to('section.footer-container', { yPercent: 0, ease: 'none' })
;

ScrollTrigger.create({  
  trigger: 'section.conclusion',
  start: 'top top',
  end: '+=75%',
  animation: uncover,
  scrub: true,  
})

