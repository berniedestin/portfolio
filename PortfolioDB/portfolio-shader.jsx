// portfolio-shader.jsx
// Subtle WebGL flowing-mesh shader background. Tinted by --accent.
// Falls back silently if WebGL is unavailable.

function ShaderBg() {
  const ref = React.useRef(null);
  const stateRef = React.useRef({});

  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: true, alpha: true });
    if (!gl) return;

    const vs = `
      attribute vec2 a;
      void main(){ gl_Position = vec4(a, 0.0, 1.0); }
    `;
    const fs = `
      precision mediump float;
      uniform vec2  u_res;
      uniform float u_t;
      uniform vec3  u_accent;
      uniform float u_dark;

      // simple smooth noise via interpolated trig sums
      float n21(vec2 p){
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }
      float smoothNoise(vec2 p){
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f*f*(3.0-2.0*f);
        float a = n21(i);
        float b = n21(i + vec2(1.0,0.0));
        float c = n21(i + vec2(0.0,1.0));
        float d = n21(i + vec2(1.0,1.0));
        return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
      }
      float fbm(vec2 p){
        float v = 0.0;
        float amp = 0.5;
        for (int i=0; i<5; i++){
          v += amp * smoothNoise(p);
          p *= 2.02;
          amp *= 0.5;
        }
        return v;
      }

      void main(){
        vec2 uv = (gl_FragCoord.xy - 0.5*u_res) / min(u_res.x, u_res.y);
        float t = u_t * 0.06;

        // warped fbm field
        vec2 q = vec2(fbm(uv*1.4 + vec2(t, -t*0.7)),
                      fbm(uv*1.4 + vec2(-t*0.5, t*1.2) + 7.3));
        vec2 r = vec2(fbm(uv*1.6 + 3.0*q + vec2(t*0.9, 0.0)),
                      fbm(uv*1.6 + 3.0*q + vec2(0.0, t*0.6)));
        float f = fbm(uv*1.8 + 2.2*r);

        // soft contour rings — gives the "mesh" feel
        float rings = 0.5 + 0.5 * sin(f * 14.0 - t * 2.4);
        rings = pow(rings, 6.0);

        // base gradient
        float vign = smoothstep(1.4, 0.2, length(uv));

        // assemble color
        vec3 base = mix(vec3(0.04, 0.045, 0.055), vec3(0.96, 0.955, 0.94), u_dark);
        // dark mode: tint with accent in deep regions; light: tint highlights
        vec3 col;
        if (u_dark < 0.5) {
          // dark
          col = base + u_accent * (rings * 0.18 + f * 0.05) * vign;
          col += u_accent * 0.04 * smoothstep(0.7, 0.0, length(uv - vec2(0.55,-0.25)));
          col *= mix(0.85, 1.05, vign);
        } else {
          // light
          col = base - u_accent * (rings * 0.06 + 0.02) * vign;
          col -= (1.0 - u_accent) * (rings * 0.02);
        }

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    function compile(src, type) {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.warn('shader err', gl.getShaderInfoLog(sh));
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    }
    const v = compile(vs, gl.VERTEX_SHADER);
    const f = compile(fs, gl.FRAGMENT_SHADER);
    if (!v || !f) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, v);
    gl.attachShader(prog, f);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const a = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(a);
    gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'u_res');
    const uT   = gl.getUniformLocation(prog, 'u_t');
    const uAcc = gl.getUniformLocation(prog, 'u_accent');
    const uDk  = gl.getUniformLocation(prog, 'u_dark');

    function hexToRgb(h) {
      h = h.replace('#', '');
      if (h.length === 3) h = h.split('').map(c=>c+c).join('');
      const n = parseInt(h, 16);
      return [((n>>16)&255)/255, ((n>>8)&255)/255, (n&255)/255];
    }
    function readVars() {
      const cs = getComputedStyle(document.documentElement);
      const acc = cs.getPropertyValue('--accent').trim() || '#ff7a3d';
      const dk = (document.documentElement.getAttribute('data-theme') || 'dark') === 'dark' ? 0.0 : 1.0;
      let rgb;
      try { rgb = hexToRgb(acc); } catch { rgb = [1, 0.48, 0.24]; }
      return { rgb, dk };
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = canvas.clientWidth | 0, h = canvas.clientHeight | 0;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();
    const ro = new ResizeObserver(() => requestAnimationFrame(resize));
    ro.observe(canvas);

    const start = performance.now();
    let raf = 0;
    function frame(now) {
      const t = (now - start) / 1000;
      const { rgb, dk } = readVars();
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uT, t);
      gl.uniform3f(uAcc, rgb[0], rgb[1], rgb[2]);
      gl.uniform1f(uDk, dk);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={ref} className="shader-bg" aria-hidden="true" />;
}

window.ShaderBg = ShaderBg;
