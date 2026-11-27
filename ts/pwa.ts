if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function (error) {
        console.warn('No se pudo registrar la PWA:', error);
    });
}
