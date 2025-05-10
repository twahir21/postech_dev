// routes/reset-password/index.tsx
import { component$, useSignal } from '@builder.io/qwik'
import { useLocation } from '@builder.io/qwik-city'

export default component$(() => {
  const { url } = useLocation()
  const email = url.searchParams.get('email') || ''
  const token = url.searchParams.get('token') || ''
  const password = useSignal('')
  const confirm = useSignal('')
  const done = useSignal(false)

  return (
    <div class="flex justify-center items-center min-h-screen bg-gradient-to-br from-sky-100 to-blue-50 animate-fade-in">
      <div class="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h2 class="text-lg font-semibold mb-3">🔁 Weka Nenosiri Jipya</h2>
        <form preventdefault:submit onSubmit$={async () => {
          if (password.value !== confirm.value) return alert('Nenosiri hayafanani!')
          await fetch('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ email, token, newPassword: password.value }),
            headers: { 'Content-Type': 'application/json' }
          })
          done.value = true
        }}>
          <input
            type="password"
            placeholder="Nenosiri jipya"
            class="input input-bordered w-full mb-3"
            bind:value={password}
            required
          />
          <input
            type="password"
            placeholder="Rudia nenosiri"
            class="input input-bordered w-full mb-3"
            bind:value={confirm}
            required
          />
          <button class="btn btn-success w-full animate-pulse">Weka Nenosiri</button>
        </form>
        {done.value && <p class="mt-3 text-green-500">✅ Umefanikiwa kuweka nenosiri jipya!</p>}
      </div>
    </div>
  )
})
