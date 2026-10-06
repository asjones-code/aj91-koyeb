// Draws a QR code as an SVG element, entirely on the device (no network).
import qrcodegen from '../vendor/qrcodegen.ts';

const SVG = 'http://www.w3.org/2000/svg';
const QUIET = 4; // modules of blank margin; scanners need it

/**
 * @param {string} text
 * @param {string} label  accessible name for the image
 * @returns {SVGSVGElement}
 */
export function qrSvg(text, label) {
  const qr = qrcodegen.QrCode.encodeText(text, qrcodegen.QrCode.Ecc.MEDIUM);
  const size = qr.size + QUIET * 2;

  // One path, one square per dark module.
  let d = '';
  for (let y = 0; y < qr.size; y++) {
    for (let x = 0; x < qr.size; x++) {
      if (qr.getModule(x, y)) d += `M${x + QUIET},${y + QUIET}h1v1h-1z`;
    }
  }

  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
  svg.setAttribute('shape-rendering', 'crispEdges');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', label);

  // Dark on light: inverted codes fail on some scanners.
  const bg = document.createElementNS(SVG, 'rect');
  bg.setAttribute('width', '100%');
  bg.setAttribute('height', '100%');
  bg.setAttribute('fill', '#fff');
  const path = document.createElementNS(SVG, 'path');
  path.setAttribute('d', d);
  path.setAttribute('fill', '#05080d');

  svg.append(bg, path);
  return svg;
}
