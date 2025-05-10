// routes/reset-request/index.tsx
import { component$, useSignal } from '@builder.io/qwik'

export default component$(() => {
  const email = useSignal('')
  const submitted = useSignal(false)

  return (
    <div class="flex items-center justify-center min-h-screen bg-gray-100 animate-fade-in">
      <div class="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md transition-all hover:scale-105">
        <h2 class="text-xl font-bold mb-4">🔐 Omba Kubadilisha Nenosiri</h2>
        <form preventdefault:submit onSubmit$={async () => {
          await fetch('/auth/request-reset', {
            method: 'POST',
            body: JSON.stringify({ email: email.value }),
            headers: { 'Content-Type': 'application/json' }
          })
          submitted.value = true
        }}>
          <input
            type="email"
            placeholder="Ingiza barua pepe"
            class="input input-bordered w-full mb-4"
            bind:value={email}
            required
          />
          <button type="submit" class="btn btn-primary w-full animate-bounce">Tuma Link ya Reset</button>
        </form>
        {submitted.value && <p class="mt-3 text-green-600">✔️ Angalia barua pepe yako kwa link ya kuweka nenosiri jipya.</p>}
      </div>
    </div>
  )
})
