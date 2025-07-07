import { component$, useSignal, $ } from "@builder.io/qwik";

export default component$(() => {
  const userLat = useSignal<number | null>(null);
  const userLng = useSignal<number | null>(null);
  const vendorLat = useSignal("");  // user input
  const vendorLng = useSignal("");  // user input
  const distance = useSignal<string | null>(null);
  const error = useSignal("");
  const isLoading = useSignal(false);

  const getLocation = $(() => {
    error.value = "";
    isLoading.value = true;
    
    if (!navigator.geolocation) {
      error.value = "Geolocation not supported.";
      isLoading.value = false;
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        userLat.value = pos.coords.latitude;
        userLng.value = pos.coords.longitude;
        isLoading.value = false;
      },
      (err) => {
        error.value = "Failed to get location: " + err.message;
        isLoading.value = false;
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });

  const toRad = $((value: number) => (value * Math.PI) / 180);

const calculateDistance = $(() => {
  distance.value = null;

  const lat1 = userLat.value;
  const lng1 = userLng.value;
  const lat2 = parseFloat(vendorLat.value);
  const lng2 = parseFloat(vendorLng.value);

  if (lat1 == null || lng1 == null) {
    error.value = "Please get your location first";
    return;
  }

  if (isNaN(lat2) || isNaN(lng2)) {
    error.value = "Please enter valid vendor coordinates";
    return;
  }

  const R = 6371; // Radius of Earth in KM
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const dist = R * c;

  distance.value = dist < 1
    ? `${(dist * 1000).toFixed(1)} meters`
    : `${dist.toFixed(2)} km`;

  error.value = "";
});


  return (
    <div class="p-6 max-w-md mx-auto bg-white rounded-xl shadow space-y-4 text-center">
      <h2 class="text-xl font-bold">📍 Umbali kati yako na muuzaji</h2>

      <button
        onClick$={getLocation}
        disabled={isLoading.value}
        class={`px-4 py-2 rounded text-white ${
          isLoading.value ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {isLoading.value ? 'Inapata mahali...' : 'Pata Mahali Ulipo'}
      </button>

      {error.value && <p class="text-red-500 text-sm">{error.value}</p>}

      {userLat.value && userLng.value && (
        <p class="text-sm text-gray-600">
          Lat: {userLat.value.toFixed(5)} | Lng: {userLng.value.toFixed(5)}
        </p>
      )}

      <div class="flex flex-col gap-2 mt-4">
        <input
          type="number"
          placeholder="Lat ya muuzaji"
          class="border px-3 py-2 rounded"
          bind:value={vendorLat}
        />
        <input
          type="number"
          placeholder="Lng ya muuzaji"
          class="border px-3 py-2 rounded"
          bind:value={vendorLng}
        />
        <button
          onClick$={calculateDistance}
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Hesabu Umbali
        </button>
      </div>

      {distance.value && (
        <p class="mt-4 text-lg font-semibold text-gray-800">
          Umbali: {distance.value}
        </p>
      )}
    </div>
  );
});