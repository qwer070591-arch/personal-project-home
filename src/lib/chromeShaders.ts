// Procedural chrome shaders ported unchanged from the static build (no textures or models).
export const vertexSource = `#version 300 es
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

export const fragmentSource = `#version 300 es
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
