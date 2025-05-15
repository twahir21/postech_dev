import { $, component$, useStore } from '@builder.io/qwik';
import svgGoogle from "/google.svg"
import { env } from '~/routes/api/base/config';
import { CrudService } from '~/routes/api/base/oop';

interface AuthFormProps {
  isLogin?: boolean;
  isLoading?: boolean;
}

export const AuthForm = component$<AuthFormProps>(({ isLogin }) => {
  const state = useStore({
    isLogin,
    name: '',
    email: '',
    username: '',
    password: '',
    phoneNumber: '', // New state for phone number
    showPassword: false,
    errors: {} as Record<string, string>,
    valid: {} as Record<string, boolean>,
    modal: {
      isOpen: false,
      message: '' as string,
      isSuccess: false,
    },
    isLoading: false
  });

  // Real-time validation
  const validateField = $((field: string, value: string) => {
    let error = '';
    let isValid = false;

    switch (field) {
      case 'name':
        isValid = value.trim().length >= 3;
        error = isValid ? '' : 'Jina la duka linahitajika, herufi 3 au zaidi';
        break;
      case 'email':
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        error = isValid ? '' : 'Barua pepe sahihi inahitajika';
        break;
      case 'username':
        isValid = value.trim().length >= 3;
        error = isValid ? '' : 'Jina la mtumiaji lazima liwe na herufi 3 au zaidi';
        break;
      case 'password':
        isValid = value.trim().length >= 6;
        error = isValid ? '' : 'Nenosiri lazima liwe na herufi 6 au zaidi';
        break;
      case 'phoneNumber': // Add validation for phone number
        isValid = /^[0-9]{10,15}$/.test(value);  // Ensure it's a valid phone number
        error = isValid ? '' : 'Nambari ya simu ni lazima iwe sahihi';
        break;
    }

    state.errors[field] = error;
    state.valid[field] = isValid;
  });

  // Update field values & validate
  type StateField = keyof Pick<typeof state, "name" | "email" | "username" | "password" | "phoneNumber">;
  const backendURL = env.mode === 'development' ? env.backendURL_DEV : env.backendURL;

  const handleInputChange = $((field: StateField, value: string) => {
    let sanitizedValue = value.trim();
  
    if (field === 'name' || field === 'username') {
      sanitizedValue = sanitizedValue.toLowerCase();
    }
  
    state[field] = sanitizedValue; // Now type-safe
    validateField(field, sanitizedValue);
  });

  const getRecaptchaToken = $(() => {
    const tokenInput = document.getElementById('g-recaptcha-token') as HTMLInputElement | null;
    if (!tokenInput) return;
    return tokenInput.value;
  });
  


  const handleSubmit = $(async () => {
    if (state.isLoading) return; // prevent multiple reqs
    if (Object.values(state.valid).every((valid) => valid)) {     
      const endpoint = state.isLogin ? `login` : `register`;
      state.isLoading = true; // Start loading ...
      try {
        // recaptcha
        if (!state.isLogin) {
          const token = await getRecaptchaToken();
    
          if (!token) {
            state.modal = { 
              isOpen: true, 
              message: 'Tafadhali hakiki reCAPTCHA!', 
              isSuccess: false
            };
            return;
          }
      
          const recaptchaPayload = {token};
          interface recaptcha {
            id?: string;
            token: string
          }
          // send token
          const sendToken = new CrudService<recaptcha>("verify-captcha");
          const isVerified = await sendToken.create(recaptchaPayload);

          if (!isVerified.success) {
            state.modal = { 
              isOpen: true, 
              message: isVerified.message || 'Hujaruhusiwa reCAPTCHA imekuzuia', 
              isSuccess: false
            };
            return;
          }
        }
        const payload = {
          ...(state.isLogin ? {} : { name: state.name, phoneNumber: state.phoneNumber }),
          email: state.email,
          username: state.username,
          password: state.password,
        };

        interface authTypes {
          id?: string;
          email: string;
          username: string;
          password: string;
          name?: string;
          phoneNumber?: string;
        }

        const authApi = new CrudService<authTypes>(endpoint);

        const result = await authApi.create(payload);

        if (!result.success) {
          state.modal = { 
            isOpen: true, 
            message: result.message || 'Hitilafu imetokea wakati wa kutuma', 
            isSuccess: false 
          };
          return;
        }

        state.modal = { 
          isOpen: true, 
          message: result.message || 'Umefanikiwa', 
          isSuccess: true 
        };


        // 🔄 Conditional redirect logic
        if (state.isLogin) {
          localStorage.setItem("username", state.username || "Guest");
          // Set token cookie manually is not allowed for production in frontend
          const frontendURL = env.mode === 'development'
                              ? env.frontendURL_DEV
                              : env.frontendURL;

          window.location.href = frontendURL; // Redirect to home
        } else {
          // After registration, redirect to login
          setTimeout(() => {
            state.isLogin = true; // Switch to login mode
          }, 1000);
        }

        // ✅ Reset state after successful submission
        state.name = '';
        state.email = '';
        state.username = '';
        state.password = '';
        state.phoneNumber = '';  // Reset phone number
        state.errors = {};
        state.valid = {};
        state.showPassword = false; // Reset password visibility
        
      } catch (error) {
        state.modal = { 
          isOpen: true, 
          message: error instanceof Error ? error.message : 'Tatizo la mtandao. Tafadhali jaribu tena', 
          isSuccess: false 
        };
      } finally {
        state.isLoading = false; // end loading ...
      }
    }
  });

  return (
    <div class="flex items-center justify-center min-h-screen bg-gray-300">
      <div class="bg-white p-6 rounded-lg shadow-md w-96 flex flex-col items-center relative mr-4 ml-4">
        {/* Profile Image */}
        <div class={`absolute -top-12 flex justify-center items-center w-24 h-24 rounded-full border-4 ${state.isLogin ? 'border-double' : 'border-dotted'}`}>
          <img src={state.isLogin ? '/login-image.jpg' : '/register-image.jpg'} class="w-20 h-20 rounded-full" alt={state.isLogin ? 'Ingia' : 'Jisajili'} loading='lazy'/>
        </div>

        <h2 class="text-2xl font-bold mb-4 mt-10">{state.isLogin ? 'Ingia' : 'Jisajili'}</h2>

        {/* Modal Popup */}
        {state.modal.isOpen && (
          <div class="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-neutral-500 z-50">
            <div class="bg-white p-6 rounded shadow-lg text-center">
              <p class={state.modal.isSuccess ? 'text-green-600' : 'text-red-600'}>{state.modal.message}</p>
              <button class="mt-4 bg-blue-500 text-white px-4 py-2 rounded" onClick$={() => (state.modal.isOpen = false)}>
                Ok
              </button>
            </div>
          </div>
        )}

        {/* Jina la Duka (Only for Registration) */}
        {!state.isLogin && (
          <>
            <input class="w-full p-2 border rounded mb-2" type="text" placeholder="Jina la Duka" value={state.name} 
              onInput$={(e) => handleInputChange('name', (e.target as HTMLInputElement).value)} />
            {state.errors.name && <p class="text-red-500 text-sm">{state.errors.name}</p>}
            {state.valid.name && <p class="text-green-500 text-sm">✔ Sahihi</p>}
          </>
        )}

        {/* Barua Pepe */}
        {!state.isLogin && (
          <>
            <input class="w-full p-2 border rounded mb-2" type="email" placeholder="Barua Pepe (email)" value={state.email} 
              onInput$={(e) => handleInputChange('email', (e.target as HTMLInputElement).value)} />
            {state.errors.email && <p class="text-red-500 text-sm">{state.errors.email}</p>}
            {state.valid.email && <p class="text-green-500 text-sm">✔ Sahihi</p>}
          </>
        )}

        {/* Jina la Mtumiaji */}
        <input class="w-full p-2 border rounded mb-2" type="text" placeholder="Jina la Mtumiaji" value={state.username} 
          onInput$={(e) => handleInputChange('username', (e.target as HTMLInputElement).value)} />
        {state.errors.username && <p class="text-red-500 text-sm">{state.errors.username}</p>}
        {state.valid.username && <p class="text-green-500 text-sm">✔ Sahihi</p>}

        {/* Nenosiri */}
        <div class="relative w-full">
          <input 
            class="w-full p-2 border rounded mb-2 pr-10" 
            type={state.showPassword ? "text" : "password"} 
            placeholder="Nenosiri" 
            value={state.password}
            onInput$={(e) => handleInputChange('password', (e.target as HTMLInputElement).value)}
          />
          <button 
            type="button"
            class="absolute right-3 top-3 text-lg focus:outline-none"
            aria-label={state.showPassword ? "Ficha Nenosiri" : "Onyesha Nenosiri"}
            onClick$={() => (state.showPassword = !state.showPassword)}
          >
            {state.showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {state.errors.password && <p class="text-red-500 text-sm">{state.errors.password}</p>}
        {state.valid.password && <p class="text-green-500 text-sm">✔ Sahihi</p>}

        {/* Phone Number Field */}
        {!state.isLogin && (
          <>
            <input class="w-full p-2 border rounded mb-2" type="text" placeholder="Nambari ya Simu" value={state.phoneNumber} 
              onInput$={(e) => handleInputChange('phoneNumber', (e.target as HTMLInputElement).value)} />
            {state.errors.phoneNumber && <p class="text-red-500 text-sm">{state.errors.phoneNumber}</p>}
            {state.valid.phoneNumber && <p class="text-green-500 text-sm">✔ Sahihi</p>}
          </>
        )}


        {state.isLogin && <a href="#" class="text-gray-900 text-sm block text-right mb-2">Umesahau nenosiri?</a>}

        <script
          dangerouslySetInnerHTML={`
            var onloadCallback = function() {
              grecaptcha.render('html_element', {
                'sitekey': '6LfiETQrAAAAAKO2-kg1mBvKls6462H1kWzpD2eF',
                'callback': function(response) {
                  document.getElementById('g-recaptcha-token').value = response;
                }
              });
            };
          `}
        />
        {!state.isLogin && <div id="html_element"></div>}
        <input type="hidden" id="g-recaptcha-token" name="g-recaptcha" />



        {/* Submit Button */}
        <button class={`w-full p-2 rounded mt-2 ${state.isLoading ? 'bg-gray-400' : state.isLogin ? 'bg-gray-900 text-white' : 'bg-gray-600 text-white'}`} onClick$={handleSubmit} disabled={state.isLoading}>
          {state.isLoading ?           
          
          // Custom Loader
          <div class="inline-flex">
            <div class="loaderCustom"></div>
          </div>
          
          : state.isLogin ? 'Ingia' : 'Jisajili'}
        </button>

        <div class="w-full flex items-center my-4">
          <hr class="flex-grow border-gray-400" />
          <span class="mx-2 text-gray-600 text-sm">au</span>
          <hr class="flex-grow border-gray-400" />
        </div>


        {/* Google OAuth Button */}
        <button
          onClick$={() => window.location.href = `${backendURL}/auth/google`}
          class={`w-full flex items-center justify-center gap-2 ${state.isLogin ? 'bg-green-200 hover:bg-green-300' : 'bg-yellow-100 hover:bg-yellow-200'} text-gray-900 p-2 transition rounded-4xl border-2 border-gray-600`}
        >
          <img src={svgGoogle} alt="Google Logo" class="w-5 h-5" />
          {state.isLogin ? "Ingia na Google" : "Jisajili na Google"}
        </button>


        {/* Toggle Between Login/Register */}
        <button
          class="w-full text-gray-700 mt-4 underline"
          onClick$={() => {
            state.isLogin = !state.isLogin;
            state.name = '';
            state.email = '';
            state.username = '';
            state.password = '';
            state.errors = {};
            state.valid = {};
            state.showPassword = false; // Reset password visibility
          }}
        >
          {state.isLogin ? 'Huna akaunti? Jisajili' : 'Tayari una akaunti? Ingia'}
        </button>
      </div>
      {!state.isLogin && <script src="https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit" async defer></script>}
    </div>
  );
});
