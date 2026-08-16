import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    __zzyzxContinuumCleanup?: () => void;
  }
}

export interface ScrollContinuumOptions {
  enableWebGL?: boolean;
}

type SceneId = "hero" | "proof" | "services" | "approach" | "studio" | "cta";

interface SealState {
  xPct: number;
  yPct: number;
  scale: number;
  rotation: number;
  opacity: number;
  edgeAlpha: number;
}

interface SealRenderer {
  render: (state: SealState) => void;
  resize: () => void;
  dispose: () => void;
}

interface ElementSnapshot {
  style: string | null;
  active: string | undefined;
}

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const mix = (from: number, to: number, progress: number) => from + (to - from) * progress;

function snapshotElements(elements: HTMLElement[]) {
  const snapshots = new Map<HTMLElement, ElementSnapshot>();
  elements.forEach((element) => {
    snapshots.set(element, {
      style: element.getAttribute("style"),
      active: element.dataset.active,
    });
  });
  return snapshots;
}

function restoreElements(snapshots: Map<HTMLElement, ElementSnapshot>) {
  snapshots.forEach((snapshot, element) => {
    gsap.killTweensOf(element);
    if (snapshot.style === null) element.removeAttribute("style");
    else element.setAttribute("style", snapshot.style);
    if (snapshot.active === undefined) delete element.dataset.active;
    else element.dataset.active = snapshot.active;
  });
}

async function createSealRenderer(canvas: HTMLCanvasElement): Promise<SealRenderer> {
  const THREE = await import("three");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
    premultipliedAlpha: true,
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-2, 2, 2, -2, 0.1, 20);
  camera.position.set(0, 0, 6);

  const ambient = new THREE.AmbientLight(0xdfe3df, 0.32);
  const key = new THREE.DirectionalLight(0xffffff, 2.15);
  key.position.set(-4.5, 5.2, 6.4);
  const rim = new THREE.DirectionalLight(0x79d8dd, 0.52);
  rim.position.set(5.2, -3.2, 4.8);
  scene.add(ambient, key, rim);

  const root = new THREE.Group();
  scene.add(root);

  const barGeometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
  const edgeGeometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
  const metal = new THREE.MeshPhysicalMaterial({
    color: 0x1b2021,
    metalness: 1,
    roughness: 0.31,
    clearcoat: 0.18,
    clearcoatRoughness: 0.4,
    anisotropy: 0.72,
    anisotropyRotation: Math.PI * 0.5,
    transparent: true,
    opacity: 1,
    dithering: true,
  });
  const edgeMaterial = new THREE.MeshBasicMaterial({
    color: 0x62cbd1,
    transparent: true,
    opacity: 0.72,
    depthWrite: false,
    toneMapped: false,
  });

  const bars = Array.from({ length: 3 }, (_, index) => {
    const group = new THREE.Group();
    const body = new THREE.Mesh(barGeometry, metal);
    const edge = new THREE.Mesh(edgeGeometry, edgeMaterial);
    edge.position.z = 0.071;
    edge.visible = index === 1;
    group.add(body, edge);
    root.add(group);
    return { group, body, edge };
  });

  let halfWidth = 2;
  let halfHeight = 2.05;

  const resize = () => {
    const bounds = canvas.getBoundingClientRect();
    const width = Math.max(1, Math.round(bounds.width));
    const height = Math.max(1, Math.round(bounds.height));
    const pixelBudget = 2_200_000;
    const budgetRatio = Math.sqrt(pixelBudget / Math.max(1, width * height));
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, budgetRatio, 1.25));
    renderer.setSize(width, height, false);
    halfHeight = 2.05;
    halfWidth = halfHeight * width / height;
    camera.left = -halfWidth;
    camera.right = halfWidth;
    camera.top = halfHeight;
    camera.bottom = -halfHeight;
    camera.updateProjectionMatrix();
  };

  const render = (state: SealState) => {
    const toX = (percentage: number) => mix(-halfWidth, halfWidth, percentage / 100);
    const toY = (percentage: number) => mix(halfHeight, -halfHeight, percentage / 100);

    const zPoses = [
      { x: 0, y: 0.58, rotation: 0, length: 1.46 },
      { x: 0, y: 0, rotation: -0.69, length: 1.62 },
      { x: 0, y: -0.58, rotation: 0, length: 1.46 },
    ];
    root.position.set(toX(state.xPct), toY(state.yPct), 0);
    root.rotation.z = state.rotation;
    root.scale.setScalar(state.scale);

    bars.forEach((bar, index) => {
      const zPose = zPoses[index];
      const thickness = 0.058;
      bar.group.position.set(zPose.x, zPose.y, index * -0.012);
      bar.group.rotation.z = zPose.rotation;
      bar.body.scale.set(zPose.length, thickness, 0.08);
      bar.edge.scale.set(zPose.length * 0.96, 0.007, 0.012);
      bar.edge.position.y = -thickness * 0.43;
    });

    metal.opacity = clamp01(state.opacity);
    edgeMaterial.opacity = clamp01(state.edgeAlpha * state.opacity);
    canvas.style.opacity = clamp01(state.opacity).toFixed(3);
    renderer.render(scene, camera);
  };

  resize();

  return {
    render,
    resize,
    dispose: () => {
      barGeometry.dispose();
      edgeGeometry.dispose();
      metal.dispose();
      edgeMaterial.dispose();
      renderer.dispose();
      canvas.style.removeProperty("opacity");
    },
  };
}

export function mountScrollContinuum(options: ScrollContinuumOptions = {}) {
  if (typeof window === "undefined") return undefined;

  window.__zzyzxContinuumCleanup?.();

  const shell = document.querySelector<HTMLElement>("[data-continuum-shell]");
  const stage = document.querySelector<HTMLElement>("[data-scroll-continuum]");
  const canvas = stage?.querySelector<HTMLCanvasElement>("[data-scroll-continuum-canvas]");
  if (!shell || !stage || !canvas) return undefined;

  const enableWebGL = options.enableWebGL !== false;
  const heroSection = shell.querySelector<HTMLElement>("[data-scene-marker='hero']");
  const proofSection = shell.querySelector<HTMLElement>("[data-scene-marker='proof']");
  const proofStory = shell.querySelector<HTMLElement>("[data-proof-story]");
  const proofImage = shell.querySelector<HTMLElement>("[data-proof-image]");
  const proofImageInner = proofImage?.querySelector<HTMLElement>("img");
  const witnessScan = shell.querySelector<HTMLElement>("[data-witness-scan]");
  const servicesSection = shell.querySelector<HTMLElement>("[data-scene-marker='services']");
  const serviceRows = Array.from(shell.querySelectorAll<HTMLElement>("[data-service-row]"));
  const serviceWipes = serviceRows.map((row) => row.querySelector<HTMLElement>(".service-wipe"));
  const approachSection = shell.querySelector<HTMLElement>("[data-scene-marker='approach']");
  const handoffProgress = shell.querySelector<HTMLElement>("[data-handoff-progress]");
  const handoffSteps = Array.from(shell.querySelectorAll<HTMLElement>("[data-handoff-steps] li"));
  const studioSection = shell.querySelector<HTMLElement>("[data-scene-marker='studio']");
  const credits = Array.from(shell.querySelectorAll<HTMLElement>("[data-credit]"));
  const ctaSection = shell.querySelector<HTMLElement>("[data-scene-marker='cta']");
  const ctaSealAnchor = shell.querySelector<HTMLElement>("[data-cta-seal-anchor]");
  const ctaCopy = shell.querySelector<HTMLElement>("[data-cta-copy]");
  const heroMedia = shell.querySelector<HTMLElement>("[data-hero-media]");
  const heroMediaImage = heroMedia?.querySelector<HTMLElement>("img");
  const heroLines = Array.from(shell.querySelectorAll<HTMLElement>("[data-hero-line]"));
  const heroKicker = shell.querySelector<HTMLElement>("[data-hero-kicker]");
  const heroSupport = shell.querySelector<HTMLElement>("[data-hero-support]");

  const managed = Array.from(new Set<HTMLElement>([
    ...(heroMediaImage ? [heroMediaImage] : []),
    ...heroLines,
    ...(heroKicker ? [heroKicker] : []),
    ...(heroSupport ? [heroSupport] : []),
    ...(proofImageInner ? [proofImageInner] : []),
    ...(witnessScan ? [witnessScan] : []),
    ...serviceRows,
    ...serviceWipes.filter((item): item is HTMLElement => Boolean(item)),
    ...(handoffProgress ? [handoffProgress] : []),
    ...handoffSteps,
    ...credits,
    ...(ctaCopy ? [ctaCopy] : []),
  ]));
  const snapshots = snapshotElements(managed);
  const shellStatus = shell.getAttribute("data-continuum-status");
  const shellMode = shell.getAttribute("data-continuum-mode");
  const stageState = stage.getAttribute("data-state");
  const stageScene = stage.getAttribute("data-scene");

  const state: SealState = {
    xPct: 78,
    yPct: 47,
    scale: 0.72,
    rotation: 0.015,
    opacity: 0,
    edgeAlpha: 0.58,
  };

  let disposed = false;
  let activeScene: SceneId = "hero";
  let activeService = -1;
  let renderFrame = 0;
  let resizeFrame = 0;
  let rendererGeneration = 0;
  let sealRenderer: SealRenderer | undefined;
  const disposers: Array<() => void> = [];

  const setMode = (mode: "webgl" | "dom") => {
    shell.dataset.continuumStatus = "ready";
    shell.dataset.continuumMode = mode;
    stage.dataset.state = mode === "webgl" ? "ready" : "dom";
    if (mode === "dom") canvas.style.opacity = "0";
  };

  const render = () => {
    if (disposed || !sealRenderer || document.hidden) return;
    sealRenderer.render(state);
  };

  const queueRender = () => {
    if (disposed || renderFrame || document.hidden) return;
    renderFrame = window.requestAnimationFrame(() => {
      renderFrame = 0;
      render();
    });
  };

  const commit = (next: Partial<SealState>) => {
    Object.assign(state, next);
    queueRender();
  };

  const animateSeal = (next: Partial<SealState>, duration = 0.55) => {
    gsap.to(state, {
      ...next,
      duration,
      ease: "power3.inOut",
      overwrite: "auto",
      onUpdate: queueRender,
    });
  };

  const activateScene = (scene: SceneId) => {
    activeScene = scene;
    stage.dataset.scene = scene;
  };

  const percentageAtElement = (element: HTMLElement | null | undefined, xRatio = 0.5) => {
    if (!element) return 50;
    const rect = element.getBoundingClientRect();
    return (rect.left + rect.width * xRatio) / Math.max(1, window.innerWidth) * 100;
  };

  const yPercentageAtElement = (element: HTMLElement | null | undefined, yRatio = 0.5) => {
    if (!element) return 50;
    const rect = element.getBoundingClientRect();
    const viewportTop = 4.25 * 16;
    const viewportHeight = Math.max(1, window.innerHeight - viewportTop);
    return clamp01((rect.top + rect.height * yRatio - viewportTop) / viewportHeight) * 100;
  };

  const activateService = (index: number) => {
    const next = Math.max(0, Math.min(serviceRows.length - 1, index));
    if (next === activeService || !serviceRows[next]) return;
    activeService = next;

    serviceRows.forEach((row, rowIndex) => {
      const isActive = rowIndex === next;
      if (isActive) row.dataset.active = "true";
      else delete row.dataset.active;
      const wipe = serviceWipes[rowIndex];
      if (wipe) {
        gsap.to(wipe, {
          scaleX: isActive ? 1 : 0,
          transformOrigin: isActive ? "left center" : "right center",
          duration: isActive ? 0.62 : 0.38,
          ease: "power3.inOut",
          overwrite: true,
        });
      }
    });

  };

  const ctaSealState = (): Partial<SealState> => ({
    xPct: percentageAtElement(ctaSealAnchor, 0.36),
    yPct: yPercentageAtElement(ctaSealAnchor),
    scale: 0.62,
    rotation: 0,
    opacity: enableWebGL ? 0.56 : 0,
    edgeAlpha: 0.56,
  });

  const animationContext = gsap.context(() => {
    if (heroMediaImage) gsap.set(heroMediaImage, { scale: 1.06, transformOrigin: "center center" });
    if (heroLines.length) gsap.set(heroLines, { yPercent: 112 });
    if (heroKicker) gsap.set(heroKicker, { autoAlpha: 0, y: 10 });
    if (heroSupport) gsap.set(heroSupport, { autoAlpha: 0, y: 12 });

    if (window.scrollY < 80) {
      const intro = gsap.timeline({ defaults: { ease: "power4.out" } });
      if (heroKicker) intro.to(heroKicker, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.08);
      if (heroLines.length) intro.to(heroLines, { yPercent: 0, duration: 0.9, stagger: 0.1 }, 0.14);
      if (heroMediaImage) intro.to(heroMediaImage, { scale: 1, duration: 1.25 }, 0.02);
      if (heroSupport) intro.to(heroSupport, { autoAlpha: 1, y: 0, duration: 0.62 }, 0.48);
      gsap.to(state, {
        opacity: enableWebGL ? 0.58 : 0,
        duration: 0.72,
        delay: 0.12,
        ease: "power3.out",
        onUpdate: queueRender,
      });
    } else {
      gsap.set([...heroLines, ...(heroKicker ? [heroKicker] : []), ...(heroSupport ? [heroSupport] : [])], { clearProps: "all" });
      if (heroMediaImage) gsap.set(heroMediaImage, { scale: 1 });
      state.opacity = enableWebGL ? 0.92 : 0;
    }

    if (heroSection) {
      const heroDriver = { progress: 0 };
      gsap.to(heroDriver, {
        progress: 1,
        ease: "none",
        scrollTrigger: {
          id: "zzyzx-v7-hero",
          trigger: heroSection,
          start: "top top",
          end: "bottom top",
          scrub: 0.25,
          invalidateOnRefresh: true,
          onEnter: () => activateScene("hero"),
          onEnterBack: () => activateScene("hero"),
        },
        onUpdate: () => {
          if (heroMediaImage) gsap.set(heroMediaImage, { scale: mix(1, 1.045, heroDriver.progress), yPercent: -2.2 * heroDriver.progress });
          if (activeScene !== "hero") return;
          const exit = clamp01((heroDriver.progress - 0.12) / 0.28);
          commit({
            xPct: 78,
            yPct: 47,
            scale: mix(0.72, 0.62, heroDriver.progress),
            rotation: mix(0.015, 0, heroDriver.progress),
            opacity: enableWebGL ? 0.58 * (1 - exit) : 0,
          });
        },
      });
    }

    if (proofStory) {
      const proofDriver = { progress: 0 };
      gsap.to(proofDriver, {
        progress: 1,
        ease: "none",
        scrollTrigger: {
          id: "zzyzx-v7-proof",
          trigger: proofStory,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.2,
          invalidateOnRefresh: true,
          onEnter: () => activateScene("proof"),
          onEnterBack: () => activateScene("proof"),
          onLeaveBack: () => activateScene("hero"),
        },
        onUpdate: () => {
          const progress = clamp01(proofDriver.progress);
          const scan = clamp01((progress - 0.05) / 0.72);
          if (proofImageInner) gsap.set(proofImageInner, { scale: mix(1.035, 1, progress), xPercent: mix(1.2, 0, progress) });
          if (witnessScan) {
            witnessScan.style.left = (scan * 100).toFixed(3) + "%";
            witnessScan.style.opacity = progress < 0.04 || progress > 0.87 ? "0" : "1";
            witnessScan.style.transform = "translate3d(-50%, 0, 0)";
          }
        },
      });
    }

    serviceRows.forEach((row, index) => {
      ScrollTrigger.create({
        id: `zzyzx-v7-service-${index}`,
        trigger: row,
        start: "top 58%",
        end: "bottom 42%",
        onEnter: () => {
          activateScene("services");
          activateService(index);
        },
        onEnterBack: () => {
          activateScene("services");
          activateService(index);
        },
        onLeaveBack: index === 0 ? () => activateScene("proof") : undefined,
      });
    });

    if (approachSection) {
      const handoffDriver = { progress: 0 };
      gsap.to(handoffDriver, {
        progress: 1,
        ease: "none",
        scrollTrigger: {
          id: "zzyzx-v7-approach",
          trigger: approachSection,
          start: "top 78%",
          end: "bottom 22%",
          scrub: 0.2,
          invalidateOnRefresh: true,
          onEnter: () => activateScene("approach"),
          onEnterBack: () => activateScene("approach"),
          onLeaveBack: () => activateScene("services"),
        },
        onUpdate: () => {
          const progress = clamp01(handoffDriver.progress);
          if (handoffProgress) gsap.set(handoffProgress, { scaleX: progress, transformOrigin: "left center" });
          handoffSteps.forEach((step, index) => {
            const local = clamp01((progress - index * 0.24) / 0.28);
            gsap.set(step, { opacity: mix(0.34, 1, local), y: mix(12, 0, local) });
          });
        },
      });
    }

    if (studioSection) {
      const studioTimeline = gsap.timeline({
        scrollTrigger: {
          id: "zzyzx-v7-studio",
          trigger: studioSection,
          start: "top 72%",
          toggleActions: "play none none reverse",
          onEnter: () => {
            activateScene("studio");
            animateSeal({ opacity: 0 }, 0.35);
          },
          onEnterBack: () => activateScene("studio"),
          onLeaveBack: () => activateScene("approach"),
        },
      });
      if (credits.length) {
        studioTimeline.fromTo(credits, {
          clipPath: "inset(0 100% 0 0)",
          y: 8,
        }, {
          clipPath: "inset(0 0% 0 0)",
          y: 0,
          duration: 0.62,
          ease: "power3.inOut",
          stagger: 0.07,
        });
      }
    }

    if (ctaSection) {
      const ctaTimeline = gsap.timeline({
        defaults: { ease: "power4.inOut" },
        scrollTrigger: {
          id: "zzyzx-v7-cta",
          trigger: ctaSection,
          start: "top 68%",
          toggleActions: "restart none none reverse",
          onEnter: () => {
            activateScene("cta");
            animateSeal(ctaSealState(), 0.62);
          },
          onEnterBack: () => activateScene("cta"),
          onLeaveBack: () => {
            activateScene("studio");
            animateSeal({ opacity: 0 }, 0.28);
          },
        },
      });
      if (ctaCopy) {
        ctaTimeline.fromTo(ctaCopy, { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.62, ease: "power3.out" }, 0.12);
      }
    }
  }, shell);
  disposers.push(() => animationContext.revert());

  const chooseInitialScene = () => {
    const checkpoints: Array<[SceneId, HTMLElement | null, number]> = [
      ["hero", heroSection, 0],
      ["proof", proofSection, 0.56],
      ["services", servicesSection, 0.58],
      ["approach", approachSection, 0.7],
      ["studio", studioSection, 0.7],
      ["cta", ctaSection, 0.68],
    ];
    let next: SceneId = "hero";
    for (const [scene, element, threshold] of checkpoints) {
      if (element && element.getBoundingClientRect().top <= window.innerHeight * threshold) next = scene;
    }
    activateScene(next);
    if (next === "services") {
      const visibleIndex = serviceRows.findLastIndex((row) => row.getBoundingClientRect().top <= window.innerHeight * 0.58);
      activateService(Math.max(0, visibleIndex));
    }
    if (next === "cta") commit(ctaSealState());
    else if (next !== "hero") commit({ opacity: 0 });
  };

  const resize = () => {
    if (disposed) return;
    sealRenderer?.resize();
    chooseInitialScene();
    queueRender();
  };

  const queueResize = () => {
    if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(() => {
      resizeFrame = 0;
      resize();
      ScrollTrigger.refresh();
    });
  };

  let observingResize = false;
  if (typeof ResizeObserver !== "undefined") {
    try {
      const resizeObserver = new ResizeObserver(queueResize);
      resizeObserver.observe(stage);
      if (proofImage) resizeObserver.observe(proofImage);
      if (ctaSealAnchor) resizeObserver.observe(ctaSealAnchor);
      disposers.push(() => resizeObserver.disconnect());
      observingResize = true;
    } catch {
      observingResize = false;
    }
  }
  if (!observingResize) {
    window.addEventListener("resize", queueResize, { passive: true });
    disposers.push(() => window.removeEventListener("resize", queueResize));
  }

  const handleVisibility = () => {
    if (!document.hidden) queueRender();
  };
  document.addEventListener("visibilitychange", handleVisibility);
  disposers.push(() => document.removeEventListener("visibilitychange", handleVisibility));

  const initializeRenderer = async () => {
    if (!enableWebGL || disposed) {
      setMode("dom");
      return;
    }
    const generation = ++rendererGeneration;
    try {
      const nextRenderer = await createSealRenderer(canvas);
      if (disposed || generation !== rendererGeneration) {
        nextRenderer.dispose();
        return;
      }
      sealRenderer?.dispose();
      sealRenderer = nextRenderer;
      setMode("webgl");
      resize();
      queueRender();
    } catch {
      if (disposed || generation !== rendererGeneration) return;
      sealRenderer?.dispose();
      sealRenderer = undefined;
      setMode("dom");
    }
  };

  const handleContextLost = (event: Event) => {
    event.preventDefault();
    rendererGeneration += 1;
    sealRenderer?.dispose();
    sealRenderer = undefined;
    setMode("dom");
  };
  const handleContextRestored = () => void initializeRenderer();
  canvas.addEventListener("webglcontextlost", handleContextLost);
  canvas.addEventListener("webglcontextrestored", handleContextRestored);
  disposers.push(() => canvas.removeEventListener("webglcontextlost", handleContextLost));
  disposers.push(() => canvas.removeEventListener("webglcontextrestored", handleContextRestored));

  const cleanup = () => {
    if (disposed) return;
    disposed = true;
    rendererGeneration += 1;
    gsap.killTweensOf(state);
    if (renderFrame) window.cancelAnimationFrame(renderFrame);
    if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
    for (const dispose of disposers.splice(0).reverse()) dispose();
    sealRenderer?.dispose();
    sealRenderer = undefined;
    restoreElements(snapshots);
    if (shellStatus === null) shell.removeAttribute("data-continuum-status");
    else shell.setAttribute("data-continuum-status", shellStatus);
    if (shellMode === null) shell.removeAttribute("data-continuum-mode");
    else shell.setAttribute("data-continuum-mode", shellMode);
    if (stageState === null) stage.removeAttribute("data-state");
    else stage.setAttribute("data-state", stageState);
    if (stageScene === null) stage.removeAttribute("data-scene");
    else stage.setAttribute("data-scene", stageScene);
    canvas.style.removeProperty("opacity");
    if (window.__zzyzxContinuumCleanup === cleanup) delete window.__zzyzxContinuumCleanup;
  };

  window.__zzyzxContinuumCleanup = cleanup;
  setMode("dom");
  chooseInitialScene();
  ScrollTrigger.refresh();
  void initializeRenderer();

  window.requestAnimationFrame(() => {
    if (disposed) return;
    ScrollTrigger.refresh();
    chooseInitialScene();
    queueRender();
  });

  document.fonts?.ready.then(() => {
    if (disposed) return;
    ScrollTrigger.refresh();
    chooseInitialScene();
    queueRender();
  });

  const handleBeforeSwap = () => cleanup();
  const handlePageHide = () => cleanup();
  document.addEventListener("astro:before-swap", handleBeforeSwap, { once: true });
  window.addEventListener("pagehide", handlePageHide, { once: true });
  disposers.push(() => document.removeEventListener("astro:before-swap", handleBeforeSwap));
  disposers.push(() => window.removeEventListener("pagehide", handlePageHide));

  return cleanup;
}
