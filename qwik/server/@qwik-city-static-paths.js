const staticPaths = new Set(["/bun.webp","/clickpesa.jpeg","/desktop.png","/drizzle.png","/elysia.png","/favicon.ico","/google.svg","/gpt.png","/hero-big.webp","/hero.png","/login-image.jpg","/man.webp","/manifest.js","/manifest.json","/manifest.webmanifest","/mfumo.png","/mobile.png","/money.glb","/newLogo.png","/q-manifest.json","/qwik-prefetch-service-worker.js","/qwik.png","/register-image.jpg","/registerSW.js","/robots.txt","/service-worker.js","/thumbnail.webp","/thumbnail2.webp","/vercel.png","/vite.svg","/whatsApp.svg","/woman.webp","/workbox-5ffe50d4.js"]);
function isStaticPath(method, url) {
  if (method.toUpperCase() !== 'GET') {
    return false;
  }
  const p = url.pathname;
  if (p.startsWith("/build/")) {
    return true;
  }
  if (p.startsWith("/assets/")) {
    return true;
  }
  if (staticPaths.has(p)) {
    return true;
  }
  if (p.endsWith('/q-data.json')) {
    const pWithoutQdata = p.replace(/\/q-data.json$/, '');
    if (staticPaths.has(pWithoutQdata + '/')) {
      return true;
    }
    if (staticPaths.has(pWithoutQdata)) {
      return true;
    }
  }
  return false;
}
export { isStaticPath };