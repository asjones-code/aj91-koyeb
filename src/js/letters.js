import { gsap } from "gsap";

var tl = gsap.timeline({ repeat: 0,  delay: 0.5});
tl.from("#line", { scaleX: 0, transformOrigin: "right center" });
tl.from("#upper", { duration: 0.75, y: 30 }, "text");
tl.from("#lower", { duration: 0.75, y: -30 }, "text");
tl.to("#line, #upper, #lower", { duration: 1, opacity: 1, ease:"none" }, "+=2");
