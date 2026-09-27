const DEFAULT_OPTIONS = {
  enableHighAccuracy: false,
  maximumAge: 5 * 60 * 1000,
  timeout: 30_000,
};

const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 400;

function readPosition(pos) {
  const lat = pos.coords.latitude;
  const lng = pos.coords.longitude;
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return null;
  }
  return { lat, lng };
}

function getCurrentPositionOnce(options) {
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(readPosition(pos)),
      () => resolve(null),
      options
    );
  });
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Resolves { lat, lng } for attendance submit. Retries because the first
 * getCurrentPosition often fails or times out while the browser permission
 * prompt is still open.
 */
export async function getSubmitGeoLocation() {
  if (!navigator.geolocation) {
    return null;
  }

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const geo = await getCurrentPositionOnce(DEFAULT_OPTIONS);
    if (geo) {
      return geo;
    }
    if (attempt < MAX_ATTEMPTS - 1) {
      await delay(RETRY_DELAY_MS);
    }
  }

  return null;
}
