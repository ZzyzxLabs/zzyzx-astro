/**
 * Margin pointer for the services list.
 *
 * One arrow rides the cursor in the left gutter of the list. The head chases the
 * cursor on an underdamped spring, so it overshoots and settles instead of snapping;
 * the chevron points whichever way the cursor is travelling, and the tail stretches
 * with the head's speed, extending fast and retracting slowly so a flick leaves a
 * long stroke behind it. Proportions follow the reference sketch: a fixed-size head,
 * a tail that is the only thing that grows.
 */

const STIFFNESS = 220; // spring pull toward the cursor, px/s² per px of offset
const DAMPING = 16; // ζ ≈ 0.54, underdamped, so the head passes the cursor and swings back
const TAIL_MIN = 24; // resting stub behind the head, px
const TAIL_MAX = 220;
const TAIL_PER_SPEED = 0.13; // px of tail per px/s of head speed
const TAIL_EXTEND = 30; // per-second smoothing while the tail grows
const TAIL_RETRACT = 6.5; // slower on the way back in
const FLIP_SPEED = 26; // px/s of cursor travel under which the chevron keeps its last direction
const FLIP_SMOOTHING = 16; // per-second smoothing on the cursor's own speed
const HEAD_HALF_WIDTH = 14;
const HEAD_ASPECT = 1.33; // head is a third taller than it is half-wide
const FADE_IN = 15;
const FADE_OUT = 9;
const MAX_STEP = 1 / 30; // a tab that was backgrounded must not launch the head across the rail

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function mountServicePointer(): (() => void) | undefined {
  const index = document.querySelector<HTMLElement>("[data-service-index]");
  const svg = index?.querySelector<SVGSVGElement>("[data-service-pointer]");
  const path = svg?.querySelector<SVGPathElement>("[data-service-pointer-path]");
  if (!index || !svg || !path) return undefined;

  let railWidth = svg.getBoundingClientRect().width;
  let pointerClientY = 0;
  let hovering = false;
  let seeded = false;
  let headY = 0;
  let velocity = 0;
  let cursorY = 0;
  let cursorVelocity = 0;
  let direction = 1;
  let tail = TAIL_MIN;
  let fade = 0;
  let frame = 0;
  let lastTime = 0;

  const draw = () => {
    const armHalf = Math.min(HEAD_HALF_WIDTH, railWidth * 0.32);
    const armDrop = armHalf * HEAD_ASPECT;
    const x = railWidth / 2;
    const tipY = headY;
    const tailY = tipY - direction * tail;
    const armY = tipY - direction * armDrop;

    path.setAttribute(
      "d",
      `M${x.toFixed(1)} ${tailY.toFixed(1)}V${tipY.toFixed(1)}` +
        `M${(x - armHalf).toFixed(1)} ${armY.toFixed(1)}L${x.toFixed(1)} ${tipY.toFixed(1)}L${(x + armHalf).toFixed(1)} ${armY.toFixed(1)}`,
    );
    svg.style.opacity = fade.toFixed(3);
  };

  const step = (time: number) => {
    frame = 0;

    const delta = lastTime ? Math.min(MAX_STEP, (time - lastTime) / 1000) : 1 / 60;
    lastTime = time;

    // Read the rail every frame: scrolling the list under a still cursor has to move
    // the target too, which is what makes the arrow spring on scroll as well as on move.
    const rect = index.getBoundingClientRect();
    const railHeight = Math.max(1, rect.height);
    const headRoom = Math.min(HEAD_HALF_WIDTH * HEAD_ASPECT, railHeight / 2);
    const target = clamp(pointerClientY - rect.top, headRoom, railHeight - headRoom);

    if (!seeded) {
      headY = target;
      cursorY = target;
      velocity = 0;
      cursorVelocity = 0;
      seeded = true;
    }

    // The chevron points where the cursor is going, not where the spring is going: the
    // head swings back past the cursor as it settles, and that recoil must not flip it.
    cursorVelocity += ((target - cursorY) / delta - cursorVelocity) * (1 - Math.exp(-FLIP_SMOOTHING * delta));
    cursorY = target;
    if (Math.abs(cursorVelocity) > FLIP_SPEED) direction = cursorVelocity > 0 ? 1 : -1;

    velocity += ((target - headY) * STIFFNESS - velocity * DAMPING) * delta;
    headY += velocity * delta;

    const speed = Math.abs(velocity);
    const tailTarget = clamp(TAIL_MIN + speed * TAIL_PER_SPEED, TAIL_MIN, TAIL_MAX);
    const tailRate = tailTarget > tail ? TAIL_EXTEND : TAIL_RETRACT;
    tail += (tailTarget - tail) * (1 - Math.exp(-tailRate * delta));

    fade += ((hovering ? 1 : 0) - fade) * (1 - Math.exp(-(hovering ? FADE_IN : FADE_OUT) * delta));

    draw();

    if (hovering || fade > 0.004) {
      frame = window.requestAnimationFrame(step);
      return;
    }

    fade = 0;
    lastTime = 0;
    seeded = false;
    svg.style.opacity = "0";
  };

  const start = () => {
    if (frame) return;
    lastTime = 0;
    frame = window.requestAnimationFrame(step);
  };

  const track = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    hovering = true;
    pointerClientY = event.clientY;
    start();
  };

  const handleEnter = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    // Appear at the cursor instead of sliding in from wherever it was left.
    seeded = false;
    track(event);
  };

  const handleLeave = () => {
    hovering = false;
    start();
  };

  const measure = () => {
    railWidth = svg.getBoundingClientRect().width;
  };

  index.addEventListener("pointerenter", handleEnter);
  index.addEventListener("pointermove", track);
  index.addEventListener("pointerleave", handleLeave);
  index.addEventListener("pointercancel", handleLeave);
  window.addEventListener("resize", measure, { passive: true });

  let resizeObserver: ResizeObserver | undefined;
  if (typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(svg);
  }

  return () => {
    index.removeEventListener("pointerenter", handleEnter);
    index.removeEventListener("pointermove", track);
    index.removeEventListener("pointerleave", handleLeave);
    index.removeEventListener("pointercancel", handleLeave);
    window.removeEventListener("resize", measure);
    resizeObserver?.disconnect();
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    path.removeAttribute("d");
    svg.style.removeProperty("opacity");
  };
}
