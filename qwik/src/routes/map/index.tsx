import { component$, useSignal, $ } from "@builder.io/qwik";

export default component$(() => {
  const lat = useSignal<number | null>(null);
  const lng = useSignal<number | null>(null);
  const loading = useSignal(false);
  const error = useSignal("");

const getLocation = $(() => {
  loading.value = true;
  error.value = "";

  if (!navigator.geolocation) {
    error.value = "Geolocation not supported.";
    loading.value = false;
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      lat.value = position.coords.latitude;
      lng.value = position.coords.longitude;
      loading.value = false;
    },
    (err) => {
      error.value = "Failed to get location: " + err.message;
      loading.value = false;
    },
    {
      enableHighAccuracy: true, // ✅ This line enables highest GPS accuracy
      timeout: 10000,            // Optional: fail after 10 seconds
      maximumAge: 0              // Always get fresh location
    }
  );
});


  const openMapWithCoords = $(() => {
    if (lat.value && lng.value) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat.value},${lng.value}`;
      window.open(url, "_blank");
    }
  });

  const openMapWithName = $(() => {
    const vendorName = "Twahir Electronics, Dar es Salaam";
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(vendorName)}`;
    window.open(url, "_blank");
  });

  return (
    <div class="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4 text-center">
      <h2 class="text-xl font-bold">📍 Ramani ya Muuzaji</h2>

      <button
        onClick$={getLocation}
        class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
      >
        {loading.value ? "Inachukua nafasi..." : "Pata Mahali Ulipo"}
      </button>

      {error.value && <p class="text-red-500 text-sm mt-2">{error.value}</p>}

      {lat.value && lng.value && (
        <div class="text-sm text-gray-700 mt-4">
          <p><strong>Latitude:</strong> {lat.value.toFixed(5)}</p>
          <p><strong>Longitude:</strong> {lng.value.toFixed(5)}</p>
        </div>
      )}

      <div class="flex flex-col gap-2 mt-4">
        <button
          onClick$={openMapWithCoords}
          disabled={!lat.value || !lng.value}
          class="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          Fungua Ramani (Kwa Lat/Lng)
        </button>

        <button
          onClick$={openMapWithName}
          class="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded"
        >
          Fungua Ramani (Kwa Jina)
        </button>
      </div>
    </div>
  );
});
