/** Returns true when the browser can create a WebGL1/2 context for Three.js. */
export function canUseWebGL(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const canvas = document.createElement("canvas");
    const options: WebGLContextAttributes = {
      failIfMajorPerformanceCaveat: false,
      antialias: true,
      alpha: true,
    };

    const gl = (canvas.getContext("webgl2", options) ??
      canvas.getContext("webgl", options) ??
      canvas.getContext(
        "experimental-webgl",
        options,
      )) as WebGLRenderingContext | null;

    if (!gl) return false;

    const loseExt = gl.getExtension("WEBGL_lose_context");
    loseExt?.loseContext();
    return true;
  } catch {
    return false;
  }
}
