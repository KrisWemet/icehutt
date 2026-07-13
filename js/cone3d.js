/* Interactive 3D cone builder for The Ice Hut.
   Renders a waffle cone; visitors stack scoops by tapping flavour chips.
   Hides its section gracefully if WebGL/modules are unavailable. */
import * as THREE from './three.module.min.js';

const FLAVOURS = [
  { name: 'Peanut Butter Chocolate', color: 0x8b5e3c },
  { name: 'Cherry Cheesecake', color: 0xf5e3c0 },
  { name: 'Salted Caramel', color: 0xe8a94e },
  { name: 'Tiger Tail', color: 0xff9e3d },
  { name: 'Moose Tracks', color: 0xfff3dc },
  { name: 'Mint Chip', color: 0x7fd8c4 },
  { name: 'Bubblegum', color: 0x8fc7f5 },
  { name: 'Cotton Candy', color: 0xffb3d9 }
];
const MAX_SCOOPS = 5;
const SPRINKLE_COLORS = [0xff5d8f, 0x4fc9b1, 0xffae52, 0x8c5bd8, 0x8ed8f0, 0xffd93d];

export function initConeBuilder(section) {
  const holder = section.querySelector('.builder-canvas');
  const counter = section.querySelector('#scoopCount');
  const quip = section.querySelector('#builderQuip');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  holder.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 60);
  camera.position.set(0, 3.1, 11.5);
  // camera eases out as the scoop tower grows
  const camGoal = { y: 3.1, z: 11.5, look: 2.6 };
  function updateCamGoal(n) {
    camGoal.y = 3.1 + n * 0.42;
    camGoal.z = 11.5 + n * 1.15;
    camGoal.look = 2.6 + n * 0.5;
  }

  scene.add(new THREE.HemisphereLight(0xfff5e8, 0xd9a2b0, 1.35));
  const key = new THREE.DirectionalLight(0xffffff, 2.0);
  key.position.set(4, 7, 5);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xffe0ee, 0.7);
  fill.position.set(-5, 2, -4);
  scene.add(fill);

  const world = new THREE.Group(); // drag-rotates
  scene.add(world);
  const coneGroup = new THREE.Group();
  world.add(coneGroup);

  /* ---- waffle texture (procedural) ---- */
  function waffleTexture() {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const g = c.getContext('2d');
    g.fillStyle = '#E8A25C';
    g.fillRect(0, 0, 256, 256);
    g.strokeStyle = '#C2793A';
    g.lineWidth = 10;
    for (let i = -256; i < 512; i += 42) {
      g.beginPath(); g.moveTo(i, 0); g.lineTo(i + 256, 256); g.stroke();
      g.beginPath(); g.moveTo(i + 256, 0); g.lineTo(i, 256); g.stroke();
    }
    g.fillStyle = 'rgba(255,255,255,0.06)';
    for (let i = 0; i < 400; i++) g.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 2);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  /* ---- cone ---- */
  const coneMat = new THREE.MeshStandardMaterial({ map: waffleTexture(), roughness: 0.8 });
  const cone = new THREE.Mesh(new THREE.ConeGeometry(1.15, 3.4, 48, 1, true), coneMat);
  cone.rotation.x = Math.PI; // point down
  cone.position.y = 1.7;
  coneGroup.add(cone);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.09, 12, 48), coneMat.clone());
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 3.4;
  coneGroup.add(rim);

  /* ---- soft fake shadow ---- */
  const shC = document.createElement('canvas');
  shC.width = shC.height = 128;
  const shG = shC.getContext('2d');
  const grad = shG.createRadialGradient(64, 64, 4, 64, 64, 62);
  grad.addColorStop(0, 'rgba(58,35,24,0.34)');
  grad.addColorStop(1, 'rgba(58,35,24,0)');
  shG.fillStyle = grad;
  shG.fillRect(0, 0, 128, 128);
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(4.6, 4.6),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(shC), transparent: true, depthWrite: false })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -0.02;
  world.add(shadow);

  /* ---- floating sprinkles ---- */
  const sprinkleGroup = new THREE.Group();
  world.add(sprinkleGroup);
  const sprinkleGeo = new THREE.CapsuleGeometry(0.045, 0.16, 3, 8);
  const sprinkles = new THREE.InstancedMesh(
    sprinkleGeo,
    new THREE.MeshStandardMaterial({ roughness: 0.5 }),
    110
  );
  const dummy = new THREE.Object3D();
  const col = new THREE.Color();
  for (let i = 0; i < 110; i++) {
    const r = 4.4 + Math.random() * 2.6;
    const theta = Math.random() * Math.PI * 2;
    const y = 0.4 + Math.random() * 6.4;
    dummy.position.set(Math.cos(theta) * r, y, Math.sin(theta) * r);
    dummy.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
    dummy.updateMatrix();
    sprinkles.setMatrixAt(i, dummy.matrix);
    sprinkles.setColorAt(i, col.setHex(SPRINKLE_COLORS[i % SPRINKLE_COLORS.length]));
  }
  sprinkleGroup.add(sprinkles);

  /* ---- scoops ---- */
  const scoops = [];
  const tweens = [];
  let cherry = null;

  function scoopGeometry() {
    const geo = new THREE.SphereGeometry(1.06, 36, 26);
    const pos = geo.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const n = 1 + (Math.sin(v.x * 5.1) + Math.sin(v.y * 4.3) + Math.sin(v.z * 5.7)) * 0.018
        + (Math.random() - 0.5) * 0.012;
      v.multiplyScalar(n);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    return geo;
  }

  function scoopY(index) { return 3.55 + index * 1.28; }

  function makeCherry() {
    const g = new THREE.Group();
    const ball = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 24, 18),
      new THREE.MeshPhysicalMaterial({ color: 0xd6335f, roughness: 0.15, clearcoat: 1 })
    );
    g.add(ball);
    const stemPts = [];
    for (let i = 0; i <= 8; i++) {
      const t = i / 8;
      stemPts.push(new THREE.Vector3(Math.sin(t * 1.4) * 0.3, 0.2 + t * 0.55, 0));
    }
    const stem = new THREE.Mesh(
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3(stemPts), 8, 0.035, 6),
      new THREE.MeshStandardMaterial({ color: 0x3a2318, roughness: 0.7 })
    );
    g.add(stem);
    return g;
  }

  function placeCherry() {
    if (!cherry) { cherry = makeCherry(); coneGroup.add(cherry); }
    cherry.visible = scoops.length > 0;
    if (scoops.length) cherry.position.set(0.12, scoopY(scoops.length - 1) + 1.02, 0.05);
  }

  const quips = [
    'A classic start. 🍦',
    'Now we’re talking.',
    'Triple decker — bold!',
    'Structural engineers, look away…',
    'That’s a Morinville “single” right there. 😄'
  ];

  function addScoop(flavour) {
    if (scoops.length >= MAX_SCOOPS) {
      tweens.push({ obj: coneGroup.rotation, prop: 'z', from: -0.06, to: 0, t: 0, dur: 0.55, wobble: true });
      return;
    }
    const mesh = new THREE.Mesh(
      scoopGeometry(),
      new THREE.MeshPhysicalMaterial({
        color: flavour.color, roughness: 0.34, clearcoat: 0.55, clearcoatRoughness: 0.5
      })
    );
    const i = scoops.length;
    mesh.position.set((Math.random() - 0.5) * 0.14, scoopY(i) + 4.5, (Math.random() - 0.5) * 0.14);
    mesh.rotation.y = Math.random() * Math.PI;
    coneGroup.add(mesh);
    scoops.push(mesh);
    tweens.push({ obj: mesh.position, prop: 'y', from: mesh.position.y, to: scoopY(i), t: 0, dur: 0.6, squash: mesh });
    counter.textContent = scoops.length;
    quip.textContent = quips[Math.min(i, quips.length - 1)];
    updateCamGoal(scoops.length);
    placeCherry();
  }

  function reset() {
    scoops.forEach((s) => { coneGroup.remove(s); s.geometry.dispose(); s.material.dispose(); });
    scoops.length = 0;
    counter.textContent = '0';
    quip.textContent = 'Pick a flavour to start stacking!';
    updateCamGoal(0);
    placeCherry();
  }

  /* ---- UI chips ---- */
  const chipRow = section.querySelector('.builder-chips');
  FLAVOURS.forEach((f) => {
    const b = document.createElement('button');
    b.className = 'builder-chip';
    b.type = 'button';
    b.innerHTML = `<span class="chip-dot" style="background:#${f.color.toString(16).padStart(6, '0')}"></span>${f.name}`;
    b.addEventListener('click', () => addScoop(f));
    chipRow.appendChild(b);
  });
  section.querySelector('#builderSurprise').addEventListener('click', () => {
    addScoop(FLAVOURS[Math.floor(Math.random() * FLAVOURS.length)]);
  });
  section.querySelector('#builderReset').addEventListener('click', reset);

  /* ---- drag to spin ---- */
  let targetRY = 0, targetRX = 0, dragging = false, lastX = 0, lastY = 0;
  const el = renderer.domElement;
  el.style.touchAction = 'pan-y';
  el.addEventListener('pointerdown', (e) => { dragging = true; lastX = e.clientX; lastY = e.clientY; });
  window.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    targetRY += (e.clientX - lastX) * 0.008;
    targetRX = THREE.MathUtils.clamp(targetRX + (e.clientY - lastY) * 0.004, -0.35, 0.5);
    lastX = e.clientX; lastY = e.clientY;
  });
  window.addEventListener('pointerup', () => { dragging = false; });

  /* ---- sizing ---- */
  function resize() {
    const w = holder.clientWidth;
    const h = holder.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(holder);
  resize();

  /* ---- render loop (paused off-screen) ---- */
  let visible = true;
  new IntersectionObserver((en) => { visible = en[0].isIntersecting; }).observe(holder);

  const clock = new THREE.Clock();
  const easeOutBack = (t) => 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2);

  function frame() {
    requestAnimationFrame(frame);
    if (!visible) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    if (!dragging && !reducedMotion) targetRY += dt * 0.25;
    world.rotation.y += (targetRY - world.rotation.y) * 0.1;
    world.rotation.x += (targetRX - world.rotation.x) * 0.1;

    camera.position.y += (camGoal.y - camera.position.y) * 0.06;
    camera.position.z += (camGoal.z - camera.position.z) * 0.06;
    camera.lookAt(0, camGoal.look, 0);

    if (!reducedMotion) {
      coneGroup.position.y = Math.sin(t * 1.2) * 0.07;
      sprinkleGroup.rotation.y = t * 0.06;
      sprinkleGroup.position.y = Math.sin(t * 0.8) * 0.12;
    }

    for (let i = tweens.length - 1; i >= 0; i--) {
      const tw = tweens[i];
      tw.t += dt / tw.dur;
      const p = Math.min(tw.t, 1);
      if (tw.wobble) {
        tw.obj[tw.prop] = Math.sin(p * Math.PI * 4) * 0.06 * (1 - p);
      } else {
        tw.obj[tw.prop] = tw.from + (tw.to - tw.from) * easeOutBack(p);
        if (tw.squash) {
          const s = p > 0.8 ? 1 - Math.sin((p - 0.8) * 5 * Math.PI) * 0.12 : 1;
          tw.squash.scale.set(2 - s, s, 2 - s).multiplyScalar(0.5).addScalar(0.5);
        }
      }
      if (p >= 1) {
        if (tw.squash) tw.squash.scale.set(1, 1, 1);
        tweens.splice(i, 1);
      }
    }
    renderer.render(scene, camera);
  }
  frame();

  // starter scoops so the scene never looks empty
  addScoop(FLAVOURS[5]);
  addScoop(FLAVOURS[3]);
}
