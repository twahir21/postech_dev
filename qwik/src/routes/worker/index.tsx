import { $, component$, useStore } from "@builder.io/qwik";
import { TrashIcon } from "lucide-qwik";

interface Assistant {
  id: number;
  name: string;
  permissions: string[];
}

const allPermissions = [
  "Tumia QR Code",
  "Ongeza Bidhaa",
  "Futa Bidhaa",
  "Rekebisha Bei",
  "Angalia Mauzo",
];

export default component$(() => {
  const state = useStore({
    assistants: [] as Assistant[],
    newName: "",
    newPermissions: [] as string[],
  });

  const togglePermission = $((permission: string) => {
    const index = state.newPermissions.indexOf(permission);
    if (index > -1) {
      state.newPermissions.splice(index, 1);
    } else {
      state.newPermissions.push(permission);
    }
  });

  const addAssistant = $(() => {
    if (state.newName.trim()) {
      state.assistants.push({
        id: Date.now(),
        name: state.newName,
        permissions: [...state.newPermissions],
      });
      state.newName = "";
      state.newPermissions = [];
    }
  });

  const deleteAssistant = $((id: number) => {
    state.assistants = state.assistants.filter((a) => a.id !== id);
  });

  return (
    <div class="max-w-lg mx-auto p-4">
      <h2 class="text-xl font-bold mb-4 text-center">Wasaidizi wa Duka</h2>

      {/* Add Assistant */}
      <div class="bg-white shadow p-4 rounded-lg mb-6">
        <input
        class="w-full border px-3 py-2 rounded mb-4"
        type="text"
        placeholder="Jina la msaidizi"
        value={state.newName}
        onInput$={(e) => state.newName = (e.target as HTMLInputElement).value}
        />


        <p class="text-sm font-semibold mb-2">Chagua Majukumu:</p>
        <div class="flex flex-col gap-2 mb-4">
        {allPermissions.map((perm) => (
        <label key={perm} class="flex items-center space-x-2">
            <input
            type="checkbox"
            checked={state.newPermissions.includes(perm)}
            onChange$={() => togglePermission(perm)}
            />
            <span class="text-sm">{perm}</span>
        </label>
        ))}
        </div>

        <button
          class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          onClick$={addAssistant}
        >
          Ongeza Msaidizi
        </button>
      </div>

      {/* List Assistants */}
      {state.assistants.length > 0 ? (
        <div class="space-y-4">
          {state.assistants.map((assistant) => (
            <div
              key={assistant.id}
              class="bg-gray-100 rounded-lg p-4 shadow relative"
            >
              <button
                class="absolute top-2 right-2 text-red-500"
                onClick$={() => deleteAssistant(assistant.id)}
              >
                <TrashIcon class="w-4 h-4" />
              </button>
              <h3 class="text-lg font-semibold">{assistant.name}</h3>
              <ul class="list-disc pl-5 mt-2 text-sm text-gray-700">
                {assistant.permissions.map((perm) => (
                  <li key={perm}>{perm}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p class="text-center text-sm text-gray-500">
          Hakuna wasaidizi waliowekwa bado.
        </p>
      )}
    </div>
  );
});
