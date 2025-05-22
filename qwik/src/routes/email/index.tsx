import { component$, useVisibleTask$, useSignal } from '@builder.io/qwik';
import { useLocation, useNavigate } from '@builder.io/qwik-city';
import { CrudService } from '../api/base/oop';
import { env } from '../api/base/config';
import { CheckCircleIcon, XCircleIcon, Loader2Icon } from 'lucide-qwik';


export default component$(() => {
  const loc = useLocation();
  const status = useSignal<'pending' | 'success' | 'error'>('pending');
  const message = useSignal('Inahakiki email yako ...');

  const navigation = useNavigate();
  const frontendURL = env.mode === 'development'
                              ? env.frontendURL_DEV
                              : env.frontendURL;

  useVisibleTask$(async () => {
    const token = loc.url.searchParams.get('token');
    if (!token) {
      status.value = 'error';
      message.value = 'Token imekosekana kwenye URL.';
      return;
    }

    const sendTokenApi = new CrudService(`verify-email?token=${token}`);
    const isVerified = await sendTokenApi.get();
    status.value = isVerified.success ? "success" : "error";
    if (!isVerified.message) return;
    message.value = isVerified.success ? isVerified.message : `Tokeni imeshatumika au kuisha muda, Jisajili tena`;

    if(isVerified.success) {
      setTimeout(() => {
        navigation(`${frontendURL}/private`); 
      }, 1500);
      return
    }

    setTimeout(() => {
      navigation(`${frontendURL}/auth?reg=true`); 
    }, 2000);
  });

  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-300 px-4">
      <div class="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-4">
        <div class="text-5xl flex justify-center mb-5">
          {status.value === 'pending' && <Loader2Icon class="animate-spin text-gray-400 w-16 h-16" />}
          {status.value === 'success' && <CheckCircleIcon class="text-green-500 w-16 h-16" />}
          {status.value === 'error' && <XCircleIcon class="text-red-400 w-16 h-16" />}
        </div>
        <h1 class="text-2xl font-semibold text-gray-800">Hakiki Email</h1>
        <p class={`text-lg ${status.value === 'error' ? 'text-red-500' : 'text-green-600'}`}>
          {message.value}
        </p>
      </div>
    </div>

  );
});
