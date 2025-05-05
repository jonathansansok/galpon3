//frontend\src\app\utils\googleMapsLoader.ts
let googleMapsPromise: Promise<typeof google> | null = null;

export const loadGoogleMaps = (apiKey: string): Promise<typeof google> => {
  if (!googleMapsPromise) {
    googleMapsPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        resolve(window.google);
      };
      script.onerror = (error) => {
        reject(error);
      };
      document.head.appendChild(script);
    });
  }
  return googleMapsPromise;
};