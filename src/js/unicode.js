const el = document.getElementById('char');
const cursor = document.getElementById('cursor');

const speed = 0.30;

const clamp = (x, min, max) => Math.min(Math.max(x, min), max); 
const toRange = (x, min, max) => clamp(
    Math.round(x * (max - min) + min), min, max);
const mix = (a, b, t) => a * (1 - t) + b * t;

let x = 0.5, y = 0.5;
let tx = 0.5, ty = 0.5;

document.body.addEventListener('mousemove', (e) => {
  tx = e.clientX / window.innerWidth;
  ty = e.clientY / window.innerHeight;    
});

let skip = 0;
function loop() { 
  requestAnimationFrame(loop);
  
  x = mix(x, tx, speed);
  y = mix(y, ty, speed);
  cursor.style.left = `${x * window.innerWidth - 40}px`;
  cursor.style.top = `${y * window.innerHeight - 40}px`;  
  
  if (skip++ % 5 != 0) {
    return;
  }   

  // Switch unicode range mapping
  const currencySymbols = [
    0x0024, // Dollar
    0x00A2, // Cent
    0x00A3, // Pound Sterling
    0x00A5, // Yen
    0x20A3, // French Franc
    0x20A4, // Lira
    0x20AC, // Euro
    0x20A6, // Naira
    0x20A8, // Rupee
    0x20AA, // New Shekel
    0x20AB, // Dong
    0x20AD, // Kip
    0x20AE, // Tugrik
    0x20AF, // Drachma
    0x20B9, // Indian Rupee
    0x20B1, // Philippine Peso
    0x20B2, // Guarani
    0x20B5, // Cedi
    0x20B8, // Tenge
    0x20BA, // Turkish Lira
    0x20BE, // Lari
    0x20BF, // Bitcoin
    0x0C78  // Somali Shilling
  ];
  
  const cx = currencySymbols[Math.floor(x * currencySymbols.length)];
  
  try {
    el.innerText = String.fromCodePoint(cx);
    el.title = String.fromCodePoint(cx);
    info.innerText = `U+${cx.toString(16).toUpperCase()}`;
  } catch {}   
}
loop();