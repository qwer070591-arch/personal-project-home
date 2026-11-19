import { fragmentSource, vertexSource } from './chromeShaders'

type Vec3 = [number, number, number]

function center(t: number): Vec3 {
  return [
    1.42 * Math.cos(t) + 0.26 * Math.cos(3 * t + 0.5),
    1.08 * Math.sin(t) + 0.19 * Math.sin(4 * t - 0.3),
    0.39 * Math.sin(2 * t - 0.25) + 0.22 * Math.cos(3 * t + 0.4),
  ]
}
function normalize(v: Vec3): Vec3 {
  const length = Math.hypot(...v) || 1
  return [v[0] / length, v[1] / length, v[2] / length]
}
function cross(a: Vec3, b: Vec3): Vec3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
}

function meshData(segments: number, sides: number) {
  const positions: number[] = []
  const normals: number[] = []
  const indices: number[] = []
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2
    const c = center(t)
    const before = center(t - 0.002)
    const after = center(t + 0.002)
    const tangent = normalize([after[0] - before[0], after[1] - before[1], after[2] - before[2]])
    const side = normalize(cross(tangent, [0, 0, 1]))
    const up = normalize(cross(side, tangent))
    const radius = 0.34 + 0.07 * Math.sin(3 * t + 0.5) + 0.035 * Math.sin(7 * t - 0.9)
    for (let j = 0; j <= sides; j++) {
      const angle = (j / sides) * Math.PI * 2
      const n: Vec3 = [0, 1, 2].map((k) => side[k] * Math.cos(angle) + up[k] * Math.sin(angle)) as Vec3
      positions.push(c[0] + radius * n[0], c[1] + radius * n[1], c[2] + radius * n[2])
      normals.push(...n)
      if (i < segments && j < sides) {
        const a = i * (sides + 1) + j
        const b = a + sides + 1
        indices.push(a, b, a + 1, b, b + 1, a + 1)
      }
    }
  }
  return { positions: new Float32Array(positions), normals: new Float32Array(normals), indices: new Uint16Array(indices) }
}

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) throw new Error('Unable to create shader')
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(message || 'Shader compilation failed')
  }
  return shader
}

function multiply(a: Float32Array, b: Float32Array) {
  const out = new Float32Array(16)
  for (let col = 0; col < 4; col++)
    for (let row = 0; row < 4; row++)
      for (let k = 0; k < 4; k++) out[col * 4 + row] += a[k * 4 + row] * b[col * 4 + k]
  return out
}
function rotation(x: number, y: number, z: number) {
  const sx = Math.sin(x), cx = Math.cos(x), sy = Math.sin(y), cy = Math.cos(y), sz = Math.sin(z), cz = Math.cos(z)
  return multiply(
    multiply(new Float32Array([cy, 0, -sy, 0, 0, 1, 0, 0, sy, 0, cy, 0, 0, 0, 0, 1]), new Float32Array([1, 0, 0, 0, 0, cx, sx, 0, 0, -sx, cx, 0, 0, 0, 0, 1])),
    new Float32Array([cz, sz, 0, 0, -sz, cz, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
  )
}

/**
 * Starts the procedural chrome sculpture on `canvas`. `host` supplies pointer events, visibility and
 * scroll progress. Returns a cleanup function. Calls `onState('webgl' | 'fallback')`.
 * Notes: preserveDrawingBuffer is off (it forces extra readbacks); rendering pauses when the host is
 * off-screen or the tab is hidden; reduced motion renders a single still frame.
 */
export function startChrome(canvas: HTMLCanvasElement, host: HTMLElement, report: (s: 'webgl' | 'fallback') => void) {
  let lastState: 'webgl' | 'fallback' | null = null
  const onState = (s: 'webgl' | 'fallback') => {
    if (s === lastState) return
    lastState = s
    report(s)
  }
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')
  const finePointer = matchMedia('(pointer: fine)')
  let destroyed = false
  let raf = 0
  let visible = true
  let still = false
  let pointerX = 0, pointerY = 0, targetX = 0, targetY = 0
  const start = performance.now()
  const cleanups: Array<() => void> = []

  let gl: WebGL2RenderingContext | null = null
  try {
    // alpha:false -> opaque canvas matching the page background (#0a0a0a). Avoids the transparent-canvas
    // compositing readback that caused "GPU stall due to ReadPixels" warnings, and is cheaper to composite.
    gl = canvas.getContext('webgl2', { alpha: false, antialias: true, powerPreference: 'low-power' })
    if (!gl) throw new Error('WebGL2 unavailable')
    const ctx = gl
    const vs = compile(ctx, ctx.VERTEX_SHADER, vertexSource)
    const fs = compile(ctx, ctx.FRAGMENT_SHADER, fragmentSource)
    const program = ctx.createProgram()!
    ctx.attachShader(program, vs)
    ctx.attachShader(program, fs)
    ctx.linkProgram(program)
    if (!ctx.getProgramParameter(program, ctx.LINK_STATUS)) throw new Error(ctx.getProgramInfoLog(program) || 'Program link failed')

    const mobileMesh = matchMedia('(max-width: 700px)').matches
    const { positions, normals, indices } = meshData(mobileMesh ? 192 : 320, mobileMesh ? 32 : 48)
    const vao = ctx.createVertexArray()!
    ctx.bindVertexArray(vao)
    const buffers: WebGLBuffer[] = []
    for (const [name, values] of [['aPosition', positions], ['aNormal', normals]] as const) {
      const buffer = ctx.createBuffer()!
      buffers.push(buffer)
      ctx.bindBuffer(ctx.ARRAY_BUFFER, buffer)
      ctx.bufferData(ctx.ARRAY_BUFFER, values, ctx.STATIC_DRAW)
      const location = ctx.getAttribLocation(program, name)
      ctx.enableVertexAttribArray(location)
      ctx.vertexAttribPointer(location, 3, ctx.FLOAT, false, 0, 0)
    }
    const indexBuffer = ctx.createBuffer()!
    buffers.push(indexBuffer)
    ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, indexBuffer)
    ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, indices, ctx.STATIC_DRAW)
    ctx.enable(ctx.DEPTH_TEST)
    ctx.clearColor(0.04, 0.04, 0.04, 1)
    const uProjection = ctx.getUniformLocation(program, 'uProjection')
    const uModel = ctx.getUniformLocation(program, 'uModel')
    const uTime = ctx.getUniformLocation(program, 'uTime')
    const uMotion = ctx.getUniformLocation(program, 'uMotion')

    // Projection is constant (square canvas, fixed FOV): build it once instead of every frame.
    const f = 1 / Math.tan((34 * Math.PI) / 360)
    const near = 0.1, far = 40
    const projection = new Float32Array([f, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) / (near - far), -1, 0, 0, (2 * far * near) / (near - far), 0])

    const schedule = () => {
      if (!raf && visible && !document.hidden && !destroyed) raf = requestAnimationFrame(render)
    }
    const render = (now: number) => {
      raf = 0
      if (destroyed || !visible || document.hidden) return
      const rect = canvas.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const mobile = innerWidth <= 700
      const dpr = Math.min(devicePixelRatio || 1, mobile ? 1.2 : 1.5)
      const pixelSize = Math.min(Math.round(rect.width * dpr), 1200)
      if (canvas.width !== pixelSize || canvas.height !== pixelSize) {
        canvas.width = canvas.height = pixelSize
        ctx.viewport(0, 0, pixelSize, pixelSize)
      }
      const reduced = reducedMotion.matches
      if (reduced && still) return
      const elapsed = reduced ? 0 : (now - start) / 1000
      const scroll = reduced ? 0 : Math.min(Math.max(scrollY / Math.max(host.offsetHeight, 1), 0), 1)
      pointerX += (targetX - pointerX) * 0.075
      pointerY += (targetY - pointerY) * 0.075
      const rx = -0.19 + pointerY + 0.025 * Math.sin(elapsed * 0.45)
      const ry = 0.36 + pointerX + elapsed * 0.045 + scroll * 0.62
      const rz = -0.19 + 0.028 * Math.sin(elapsed * 0.32) - scroll * 0.15
      const model = rotation(rx, ry, rz)
      model[14] = -7.4
      ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT)
      ctx.useProgram(program)
      ctx.uniformMatrix4fv(uProjection, false, projection)
      ctx.uniformMatrix4fv(uModel, false, model)
      ctx.uniform1f(uTime, elapsed)
      ctx.uniform1f(uMotion, reduced ? 0 : 1)
      ctx.bindVertexArray(vao)
      ctx.drawElements(ctx.TRIANGLES, indices.length, ctx.UNSIGNED_SHORT, 0)
      onState('webgl')
      still = reduced
      if (!reduced) schedule()
    }

    const onPointerMove = (e: PointerEvent) => {
      if (reducedMotion.matches || !finePointer.matches) return
      const r = host.getBoundingClientRect()
      targetX = ((e.clientX - r.left) / r.width - 0.5) * 0.16
      targetY = ((e.clientY - r.top) / r.height - 0.5) * 0.12
    }
    const onPointerLeave = () => { targetX = targetY = 0 }
    const onVisibility = () => { if (document.hidden) { cancelAnimationFrame(raf); raf = 0 } else schedule() }
    const onMotion = () => { still = false; schedule() }
    const onLost = (e: Event) => { e.preventDefault(); cleanup(); onState('fallback') }

    host.addEventListener('pointermove', onPointerMove, { passive: true })
    host.addEventListener('pointerleave', onPointerLeave)
    document.addEventListener('visibilitychange', onVisibility)
    reducedMotion.addEventListener('change', onMotion)
    canvas.addEventListener('webglcontextlost', onLost, { once: true })
    const io = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting
      if (visible) schedule(); else { cancelAnimationFrame(raf); raf = 0 }
    })
    io.observe(host)
    const ro = new ResizeObserver(() => { still = false; schedule() })
    ro.observe(canvas)

    const cleanup = () => {
      if (destroyed) return
      destroyed = true
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      host.removeEventListener('pointermove', onPointerMove)
      host.removeEventListener('pointerleave', onPointerLeave)
      document.removeEventListener('visibilitychange', onVisibility)
      reducedMotion.removeEventListener('change', onMotion)
      canvas.removeEventListener('webglcontextlost', onLost)
      for (const b of buffers) ctx.deleteBuffer(b)
      ctx.deleteVertexArray(vao)
      ctx.deleteProgram(program)
      ctx.deleteShader(vs)
      ctx.deleteShader(fs)
    }
    cleanups.push(cleanup)
    schedule()
  } catch (error) {
    onState('fallback')
    console.warn('Hero WebGL unavailable; CSS sculpture is in use.', (error as Error).message)
  }
  return () => cleanups.forEach((fn) => fn())
}
