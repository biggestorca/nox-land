export const registerServiceWorker = () => {
    if ("serviceWorker" in window.navigator) {
        if (window.navigator.serviceWorker.controller) {
            console.log("[PWA Builder] active service worker found, no need to register");
        } else {
            window.navigator.serviceWorker
                .register("pwabuilder-sw.js", {
                    scope: "./",
                })
                .then(reg => console.log("[PWA Builder] Service worker has been registered for scope: ", reg.scope));
        }
    }
};
  
  