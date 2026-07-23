if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('./service-worker.js?v=20260723-single-state-v3', { updateViaCache: 'none' });
      await reg.update();
    } catch (error) {
      console.warn('Service worker registration failed:', error);
    }
  });
}
