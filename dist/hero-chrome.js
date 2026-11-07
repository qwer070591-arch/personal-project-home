// Procedural chrome: a custom closed tube mesh, animated in the vertex shader.
// No model, texture, runtime dependency, or build step is required.
(() => {
  const hero = document.querySelector('.hero');
  const sculpture = document.querySelector('.hero-sculpture');
  const canvas = document.querySelector('.chrome-canvas');
  if (!hero || !sculpture || !canvas) return;

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(pointer: fine)');
  const vertexSource = `#version 300 es
    precision highp float;
    in vec3 aPosition;
    in vec3 aNormal;
    uniform mat4 uProjection;
    uniform mat4 uModel;
    uniform float uTime;
    uniform float uMotion;
    out vec3 vNormal;
    out vec3 vPosition;
    void main() {
      vec3 p = aPosition;
      float wave = sin(p.x * 2.8 + p.y * 1.6 + uTime * .82) * .034
                 + sin(p.z * 4.2 - p.y * 2.1 - uTime * .64) * .024;
      p += aNormal * wave * uMotion;
      vec4 world = uModel * vec4(p, 1.0);
      vPosition = world.xyz;
      vNormal = normalize(mat3(uModel) * aNormal);
      gl_Position = uProjection * world;
    }`;
  const fragmentSource = `#version 300 es
    precision highp float;
    in vec3 vNormal;
    in vec3 vPosition;
    out vec4 outColor;
    float panel(vec3 r, vec2 center, vec2 size, float feather) {
      vec2 edge = abs(r.xy - center) - size;
      return 1.0 - smoothstep(0.0, feather, max(edge.x, edge.y));
    }
    void main() {
      vec3 n = normalize(vNormal);
      vec3 viewDir = normalize(-vPosition);
      vec3 r = reflect(-viewDir, n);
      float facing = max(dot(n, viewDir), 0.0);
      float fresnel = pow(1.0 - facing, 3.0);

      // A monochrome studio: long white softboxes, dark flags, and a cool ceiling.
      float ceiling = smoothstep(-.36, .85, r.y);
      float key = panel(r, vec2(-.32, .26), vec2(.13, .70), .10);
      float strip = panel(r, vec2(.43, .10), vec2(.055, .86), .045);
      float edgeStrip = panel(r, vec2(-.68, .08), vec2(.025, .76), .055);
      float top = panel(r, vec2(.02, .84), vec2(.66, .09), .15);
      float low = panel(r, vec2(-.12, -.73), vec2(.44, .055), .11);
      float flag = panel(r, vec2(.08, -.02), vec2(.15, .92), .10);
      float value = .045 + .22 * ceiling + 1.02 * key + 1.38 * strip + .50 * top + .16 * low + .45 * edgeStrip;
      value *= 1.0 - .83 * flag;
      value += .34 * fresnel;
      value += .12 * pow(max(dot(n, normalize(vec3(-.55, .8, .7))), 0.0), 12.0);
      vec3 silver = vec3(value * .92, value * .965, value);
      silver = silver / (silver + vec3(.35));
      silver = pow(silver, vec3(.77));
      outColor = vec4(silver, 1.0);
    }`;

  function center(t) {
    return [
      1.42 * Math.cos(t) + .26 * Math.cos(3 * t + .5),
      1.08 * Math.sin(t) + .19 * Math.sin(4 * t - .3),
      .39 * Math.sin(2 * t - .25) + .22 * Math.cos(3 * t + .4)
    ];
  }
  function normalize(v) {
    const length = Math.hypot(...v) || 1;
    return v.map(component => component / length);
  }
  function cross(a, b) {
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  }
  function meshData(segments, sides) {
    const positions = [], normals = [], indices = [];
    for (let i = 0; i <= segments; i++) {
      const t = i / segments * Math.PI * 2;
      const c = center(t);
      const before = center(t - .002), after = center(t + .002);
      const tangent = normalize(after.map((v, j) => v - before[j]));
      const side = normalize(cross(tangent, [0, 0, 1]));
      const up = normalize(cross(side, tangent));
      const radius = .34 + .07 * Math.sin(3 * t + .5) + .035 * Math.sin(7 * t - .9);
      for (let j = 0; j <= sides; j++) {
        const angle = j / sides * Math.PI * 2;
        const n = side.map((v, k) => v * Math.cos(angle) + up[k] * Math.sin(angle));
        positions.push(...c.map((v, k) => v + radius * n[k]));
        normals.push(...n);
        if (i < segments && j < sides) {
          const a = i * (sides + 1) + j, b = a + sides + 1;
          indices.push(a, b, a + 1, b, b + 1, a + 1);
        }
      }
    }
    return { positions: new Float32Array(positions), normals: new Float32Array(normals), indices: new Uint16Array(indices) };
  }
  function compile(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(message || 'Shader compilation failed');
    }
    return shader;
  }
  function multiply(a, b) {
    const out = new Float32Array(16);
    for (let col = 0; col < 4; col++) for (let row = 0; row < 4; row++) {
      for (let k = 0; k < 4; k++) out[col * 4 + row] += a[k * 4 + row] * b[col * 4 + k];
    }
    return out;
  }
  function rotation(x, y, z) {
    const sx = Math.sin(x), cx = Math.cos(x), sy = Math.sin(y), cy = Math.cos(y), sz = Math.sin(z), cz = Math.cos(z);
    return multiply(multiply(new Float32Array([cy,0,-sy,0, 0,1,0,0, sy,0,cy,0, 0,0,0,1]),
      new Float32Array([1,0,0,0, 0,cx,sx,0, 0,-sx,cx,0, 0,0,0,1])),
      new Float32Array([cz,sz,0,0, -sz,cz,0,0, 0,0,1,0, 0,0,0,1]));
  }

  let gl, program, vao, drawCount = 0, buffers = [], shaders = [], observer, resizeObserver, raf = 0;
  let visible = true, pointerX = 0, pointerY = 0, targetX = 0, targetY = 0;
  let start = performance.now(), stillFrame = false, destroyed = false;
  const onPointerMove = event => {
    if (reducedMotion.matches || !finePointer.matches) return;
    const rect = hero.getBoundingClientRect();
    targetX = ((event.clientX - rect.left) / rect.width - .5) * .16;
    targetY = ((event.clientY - rect.top) / rect.height - .5) * .12;
  };
  const onPointerLeave = () => { targetX = targetY = 0; };
  const schedule = () => { if (!raf && visible && !document.hidden && !destroyed) raf = requestAnimationFrame(render); };
  const onVisibility = () => { if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else schedule(); };
  const onMotion = () => { stillFrame = false; schedule(); };

  function render(now) {
    raf = 0;
    if (!gl || destroyed || !visible || document.hidden) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const mobile = innerWidth <= 700;
    const dpr = Math.min(devicePixelRatio || 1, mobile ? 1.2 : 1.5);
    const pixelSize = Math.min(Math.round(rect.width * dpr), 1200);
    if (canvas.width !== pixelSize || canvas.height !== pixelSize) {
      canvas.width = canvas.height = pixelSize;
      gl.viewport(0, 0, pixelSize, pixelSize);
    }
    const reduced = reducedMotion.matches;
    if (reduced && stillFrame) return;
    const elapsed = reduced ? 0 : (now - start) / 1000;
    const scroll = reduced ? 0 : Math.min(Math.max(scrollY / Math.max(hero.offsetHeight, 1), 0), 1);
    pointerX += (targetX - pointerX) * .075;
    pointerY += (targetY - pointerY) * .075;
    const rx = -.19 + pointerY + .025 * Math.sin(elapsed * .45);
    const ry = .36 + pointerX + elapsed * .045 + scroll * .62;
    const rz = -.19 + .028 * Math.sin(elapsed * .32) - scroll * .15;
    const model = rotation(rx, ry, rz);
    const f = 1 / Math.tan(34 * Math.PI / 360);
    const near = .1, far = 40;
    const projection = new Float32Array([f,0,0,0, 0,f,0,0, 0,0,(far+near)/(near-far),-1, 0,0,(2*far*near)/(near-far),0]);
    model[14] = -7.4;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(program);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uProjection'), false, projection);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uModel'), false, model);
    gl.uniform1f(gl.getUniformLocation(program, 'uTime'), elapsed);
    gl.uniform1f(gl.getUniformLocation(program, 'uMotion'), reduced ? 0 : 1);
    gl.bindVertexArray(vao);
    gl.drawElements(gl.TRIANGLES, drawCount, gl.UNSIGNED_SHORT, 0);
    sculpture.classList.add('has-webgl');
    stillFrame = reduced;
    if (!reduced) schedule();
  }
  function clean() {
    destroyed = true;
    cancelAnimationFrame(raf);
    observer?.disconnect();
    resizeObserver?.disconnect();
    hero.removeEventListener('pointermove', onPointerMove);
    hero.removeEventListener('pointerleave', onPointerLeave);
    document.removeEventListener('visibilitychange', onVisibility);
    reducedMotion.removeEventListener('change', onMotion);
    for (const buffer of buffers) gl?.deleteBuffer(buffer);
    if (vao) gl?.deleteVertexArray(vao);
    if (program) gl?.deleteProgram(program);
    for (const shader of shaders) gl?.deleteShader(shader);
    sculpture.classList.remove('has-webgl');
  }
  function init() {
    try {
      destroyed = false;
      buffers = [];
      shaders = [];
      gl = canvas.getContext('webgl2', { alpha: true, antialias: true, preserveDrawingBuffer: true, powerPreference: 'low-power' });
      if (!gl) return;
      const vertex = compile(gl, gl.VERTEX_SHADER, vertexSource);
      const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
      shaders.push(vertex, fragment);
      program = gl.createProgram();
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
      const mobileMesh = matchMedia('(max-width: 700px)').matches;
      const { positions, normals, indices } = meshData(mobileMesh ? 192 : 320, mobileMesh ? 32 : 48);
      drawCount = indices.length;
      vao = gl.createVertexArray();
      gl.bindVertexArray(vao);
      for (const [name, values] of [['aPosition', positions], ['aNormal', normals]]) {
        const buffer = gl.createBuffer(); buffers.push(buffer);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, values, gl.STATIC_DRAW);
        const location = gl.getAttribLocation(program, name);
        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 0, 0);
      }
      const indexBuffer = gl.createBuffer(); buffers.push(indexBuffer);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
      gl.enable(gl.DEPTH_TEST);
      gl.clearColor(0, 0, 0, 0);
      sculpture.dataset.rendering = 'webgl2';
      observer = new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        if (visible) schedule(); else { cancelAnimationFrame(raf); raf = 0; }
      }, { threshold: 0 });
      observer.observe(hero);
      resizeObserver = new ResizeObserver(() => { stillFrame = false; schedule(); });
      resizeObserver.observe(canvas);
      hero.addEventListener('pointermove', onPointerMove, { passive: true });
      hero.addEventListener('pointerleave', onPointerLeave);
      document.addEventListener('visibilitychange', onVisibility);
      reducedMotion.addEventListener('change', onMotion);
      canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); clean(); sculpture.dataset.rendering = 'fallback'; }, { once: true });
      addEventListener('pagehide', clean, { once: true });
      schedule();
    } catch (error) {
      clean();
      sculpture.dataset.rendering = 'fallback';
      console.warn('Hero WebGL unavailable; CSS sculpture is in use.', error.message);
    }
  }
  canvas.addEventListener('webglcontextrestored', init);
  addEventListener('pageshow', event => { if (event.persisted && destroyed) init(); });
  init();
})();
