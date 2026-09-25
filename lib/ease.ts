// Motion tokens measured on the motion reference, ankar.ai (Framer). One easing family for the whole page.
//
// Source: ankar.ai script_main.DVi7iZV9.mjs, the appear transitions the Framer page passes to its motion components.
//   Reveal spring   {type:"spring", stiffness:500, damping:60, mass:1}   (most common spring on the page)
//   Hover spring    {type:"spring", stiffness:600, damping:40, mass:1}   (pill buttons; confirmed by sampling the
//                   "Book a demo" fill on hover: alpha 1 → 0.6, dips to 0.592 at ~316 ms, settles by ~330 ms)
//   Appear tween    {duration:.4, ease:[.5,0,.88,.77]} with delays .1/.2/.3/.4/.5/.6 (the 0.1 s stagger)

type Spring = { stiffness: number; damping: number; mass?: number };

/** Position (0 → 1) of a spring released from rest at time t, in seconds. */
function position({ stiffness, damping, mass = 1 }: Spring, t: number) {
  const w0 = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  if (zeta < 1) {
    const wd = w0 * Math.sqrt(1 - zeta * zeta);
    return 1 - Math.exp(-zeta * w0 * t) * (Math.cos(wd * t) + (zeta * w0 / wd) * Math.sin(wd * t));
  }
  if (zeta === 1) return 1 - Math.exp(-w0 * t) * (1 + w0 * t);
  const root = Math.sqrt(zeta * zeta - 1);
  const r1 = -w0 * (zeta - root), r2 = -w0 * (zeta + root);
  return 1 - (r2 * Math.exp(r1 * t) - r1 * Math.exp(r2 * t)) / (r2 - r1);
}

/** Time for the spring to stay within 0.2% of rest, which becomes the tween duration. */
function settle(spring: Spring) {
  let last = 0;
  for (let t = 0; t < 3; t += .002) if (Math.abs(1 - position(spring, t)) > .002) last = t;
  return last;
}

/** Turns a physical spring into a GSAP ease plus the duration it needs. */
function springEase(spring: Spring) {
  const duration = settle(spring);
  return { duration, ease: (p: number) => (p >= 1 ? 1 : position(spring, p * duration)) };
}

export const reveal = springEase({ stiffness: 500, damping: 60 }); // ≈ .64 s
export const hover = springEase({ stiffness: 600, damping: 40 });  // ≈ .33 s

/** Ankar's appear tween, used for labels, buttons and small fades. */
export const appear = { duration: .4, ease: "appear", step: .1, bezier: [.5, 0, .88, .77] as const };
