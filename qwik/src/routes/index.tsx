import { $, component$, useSignal, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";
import type { ContactTypes } from "./api/base/typeSafe";
import { contactApi, warmUpApi } from "./api/base/api";
import { Typewriter } from "~/components/TypeWriter";

export default component$(() => {

    const mobileMenuSig = useSignal<HTMLDivElement>();
    const iconPathSig = useSignal<SVGPathElement>();
    const iconPathMobileSig = useSignal<SVGPathElement>();
    const theme = useSignal<'light' | 'dark'>('light');

    // store 
    const contactStore = useStore({
        name: '' as string,
        email: '' as string,
        message: '' as string,
        errors: {} as Record<string, string>,
        valid: {} as Record<string, boolean>,
        isLoading: false as boolean,
        isReady: false as boolean,
        modal: {
            isOpen: false as boolean,
            isSuccess: false as boolean,
            message: '' as string
        }
    });

      // Real-time validation
      const validateField = $((field: string, value: string) => {
        let error = '';
        let isValid = false;
    
        switch (field) {
          case 'name':
            isValid = value.trim().length >= 3;
            error = isValid ? '' : 'Jina lako linatakiwa kuwa na herufi 3 au zaidi';
            break;
          case 'email':
            isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            error = isValid ? '' : 'Barua pepe sahihi inahitajika';
            break;
          case 'message':
            isValid = value.trim().length >= 5;
            error = isValid ? '' : 'Nenosiri lazima liwe na herufi 6 au zaidi';
            break;
        }
    
        contactStore.errors[field] = error;
        contactStore.valid[field] = isValid;
      });

      type contactForm = keyof Pick<typeof contactStore, "name" | "email" | "message">;

        const handleInputChange = $((field: contactForm, value: string) => {
            let sanitizedValue = value.trim();
        
            if (field === 'name' || field === 'message') {
            sanitizedValue = sanitizedValue.toLowerCase();
            }
        
            contactStore[field] = sanitizedValue; // Now type-safe
            validateField(field, sanitizedValue);
        });

        const handleSubmitContact = $(async () => {
            if (contactStore.isLoading) return;
            // if u are getting spam email use im not robot or honeypot input or fingerprint for protection
            if (Object.values(contactStore.valid).every((valid) => valid)){
                try {  
                    contactStore.isLoading = true;
                    const payload: Partial<ContactTypes> = {
                        name: contactStore.name,
                        email: contactStore.email,
                        message: contactStore.message
                    }
                    if (payload.name?.length === 0 || payload.email?.length === 0 || payload.message?.length===0) return;
                    const result = await contactApi.create(payload);
                    if (!result.success) {
                      contactStore.modal.isOpen = true;
                      contactStore.modal.isSuccess = false;
                      contactStore.modal.message = result.message || "Hitilafu imetokea wakati wa kutuma";
                      return;
                    }
                    contactStore.modal.isOpen = true;
                    contactStore.modal.isSuccess = true;
                    contactStore.modal.message = result.message || "Umefanikiwa kutuma";
                    
                } catch (error) {
                    const err = error instanceof Error ? error.message : "Tatizo la mtandao, jaribu tena baadae!"
                    contactStore.modal.isOpen = true;
                    contactStore.modal.message = err;
                    contactStore.modal.isSuccess = false;

                } finally{
                    contactStore.isLoading = false;
                }
            }
        })
  
    // Load saved theme on client
    useVisibleTask$(() => {
      const stored = localStorage.getItem('theme');
      if (stored === 'dark') {
        theme.value = 'dark';
        document.documentElement.classList.add('dark');
      }
    });
  
      // Update SVG path based on theme
      const updateIconPaths = $((mode: string) => {
          const moonPath = "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z";
          const sunPath = "M12 3v1m0 16v1m8.66-8.66l-.71.71M4.34 4.34l-.71.71M21 12h-1M4 12H3m16.66 4.66l-.71-.71M4.34 19.66l-.71-.71M12 5a7 7 0 100 14 7 7 0 000-14z";
      
          if (iconPathSig.value) {
            iconPathSig.value.setAttribute('d', mode === 'dark' ? moonPath : sunPath);
          }
      
          if (iconPathMobileSig.value) {
            iconPathMobileSig.value.setAttribute('d', mode === 'dark' ? moonPath : sunPath);
          }
        });
  
    // Toggle theme class on <html> and update icon
    const toggleTheme = $(() => {
      const html = document.documentElement;
      const isDark = theme.value === 'dark';
      theme.value = isDark ? 'light' : 'dark';
      localStorage.setItem('theme', theme.value);
  
      html.classList.toggle('dark', !isDark);
      updateIconPaths(theme.value);
    });
  
  
  
    // Toggle mobile menu
    const toggleMobileMenu = $(() => {
      if (mobileMenuSig.value) {
        mobileMenuSig.value.classList.toggle('hidden');
      }
    });
  
    // Close mobile menu when clicking outside
    useVisibleTask$(() => {
      const handler = (e: MouseEvent) => {
        const target = e.target as Node;
        const menu = mobileMenuSig.value;
        const btn = document.querySelector('[data-menu-toggle]');
        if (menu && !menu.contains(target) && !btn?.contains(target)) {
          menu.classList.add('hidden');
        }
      };
      document.addEventListener('click', handler);
      return () => document.removeEventListener('click', handler);
    });

    useVisibleTask$(() => {
        const beeModal = document.getElementById("bee-model");
        if (!beeModal) return;
    
        const sections = Array.from(document.querySelectorAll("section"));
        const sectionOffsets = sections.map((section) => section.offsetTop);
    
        const shiftPositions = [30, -30, 0, 64];
        const cameraOrbits = [
          [45, 45],
          [-45, 45],
          [-180, 0],
          [45, 180],
        ];
    
        const lastSectionIndex = sections.length - 1;
    
        const interpolate = (start: number, end: number, progress: number) =>
          start + (end - start) * progress;
    
        const getScrollProgress = (scrollY: number) => {
          for (let i = 0; i < lastSectionIndex; i++) {
            if (scrollY >= sectionOffsets[i] && scrollY < sectionOffsets[i + 1]) {
              return (
                i +
                (scrollY - sectionOffsets[i]) /
                  (sectionOffsets[i + 1] - sectionOffsets[i])
              );
            }
          }
          return lastSectionIndex;
        };
    
        const onScroll = () => {
          const scrollProgress = getScrollProgress(window.scrollY);
          const sectionIndex = Math.floor(scrollProgress);
          const sectionProgress = scrollProgress - sectionIndex;
    
          const currentShift = interpolate(
            shiftPositions[sectionIndex],
            shiftPositions[sectionIndex + 1] ?? shiftPositions[sectionIndex],
            sectionProgress
          );
    
          const currentOrbit = cameraOrbits[sectionIndex].map((val, i) =>
            interpolate(
              val,
              cameraOrbits[sectionIndex + 1]?.[i] ?? val,
              sectionProgress
            )
          );
    
          beeModal.style.transform = `translateX(${currentShift}%)`;
          beeModal.setAttribute(
            "camera-orbit",
            `${currentOrbit[0]}deg ${currentOrbit[1]}deg`
          );
        };
    
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
      });

      // WARM UP THE SERVER TO REMOVE COLD START
      useVisibleTask$(async () => {
        const result = await warmUpApi.get();
        if (!result.success){
          console.log("Failed to warm: ", result)
          return;
        }
        console.log("Warm up: ", result)
        return;
      });

    return <>
    <div class="bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">

        {/* HEADER  */}
        <header class="fixed top-0 left-0 w-full bg-white dark:bg-gray-700 shadow-md z-50 transition-colors duration-300">
        <nav class="max-w-6xl mx-auto flex justify-between items-center p-4">
          <a href="/" class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">PosTech</a>

          <ul class="hidden md:flex space-x-6">
            <li><a href="#hero" class="hover:text-gray-700 dark:hover:text-gray-300 text-sm sm:text-base dark:text-gray-200">Nyumbani</a></li>
            <li><a href="#about" class="hover:text-gray-700 dark:hover:text-gray-300 text-sm sm:text-base dark:text-gray-200">Kuhusu</a></li>
            <li><a href="#features" class="hover:text-gray-700 dark:hover:text-gray-300 text-sm sm:text-base dark:text-gray-200">Kwa Nini Sisi?</a></li>
            <li><a href="#contact" class="hover:text-gray-700 dark:hover:text-gray-300 text-sm sm:text-base dark:text-gray-200">Wasiliana</a></li>
          </ul>

          <button onClick$={toggleTheme}
            class="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg hover:brightness-110 active:scale-95 transition duration-300">
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path ref={iconPathSig} stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 3v1m0 16v1m8.66-8.66l-.71.71M4.34 4.34l-.71.71M21 12h-1M4 12H3m16.66 4.66l-.71-.71M4.34 19.66l-.71-.71M12 5a7 7 0 100 14 7 7 0 000-14z" />
            </svg>
            <span>Badili</span>
          </button>

          <button data-menu-toggle onClick$={toggleMobileMenu} class="md:hidden text-gray-900 dark:text-white focus:outline-none">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 8h16M4 16h16" />
            </svg>
          </button>
        </nav>

        <div ref={mobileMenuSig} id="mobileMenu" class="hidden md:hidden bg-white dark:bg-gray-800 p-4 space-y-3 transition-colors duration-300">
          <a href="#hero" class="block text-gray-800 dark:text-gray-200 hover:text-indigo-500">Nyumbani</a>
          <a href="#about" class="block text-gray-800 dark:text-gray-200 hover:text-indigo-500">Kuhusu</a>
          <a href="#features" class="block text-gray-800 dark:text-gray-200 hover:text-indigo-500">Kwa Nini Sisi?</a>
          <a href="#contact" class="block text-gray-800 dark:text-gray-200 hover:text-indigo-500">Wasiliana</a>
          <div class="flex gap-3 mt-3">
            <Link href='/auth?reg=false ' class="w-full border border-gray-900 text-center px-4 py-2 rounded-md hover:bg-gray-900 hover:text-white transition">Ingia</Link>
            <Link href='/auth?reg=true ' class="w-full bg-gray-900 text-white text-center px-4 py-2 rounded-md hover:bg-gray-800 transition">Anza</Link>
          </div>
          <button onClick$={toggleTheme}
            class="w-full mt-2 flex justify-center items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg hover:brightness-110 active:scale-95 transition duration-300">
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path ref={iconPathMobileSig} stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 3v1m0 16v1m8.66-8.66l-.71.71M4.34 4.34l-.71.71M21 12h-1M4 12H3m16.66 4.66l-.71-.71M4.34 19.66l-.71-.71M12 5a7 7 0 100 14 7 7 0 000-14z" />
            </svg>
            <span>Badili</span>
          </button>
        </div>
        </header>

        {/* MODEL VIEWER 3D RENDERING  */}
        <model-viewer src="/money.glb" id="bee-model" camera-orbit="45deg 45deg" class="getLeft w-full h-[400px]" auto-rotate autoplay ar camera-controls exposure="1"></model-viewer>

        {/* HERO SECTION  */}
        <section id="hero" class="flex items-center min-h-screen px-6 max-w-6xl mx-auto pt-20">
            <div class="w-full md:w-1/2">
                <h1 class="text-2xl sm:text-3xl md:text-3xl font-bold mb-4">   
                  Boresha biashara yako na PosTech
                </h1>
              <p class="text-sm sm:text-base md:text-base text-gray-600 mb-6 dark:text-gray-400">
                  <Typewriter text="Mfumo wa kisasa wa POS ulio na uwezo wa kuboresha na kurahisisha mauzo kwa ku scan special QR Codes hivyo kufanya mahesabu ya biashara kiotomatiki." speed={50} />
                </p>
                <div class="flex space-x-4">
                <Link href= '/auth?reg=true' class="bg-gray-900 dark:bg-gray-700 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-800 transition text-sm sm:text-base md:text-base">Anza Kutumia</Link>
                <Link href= '/auth?reg=false' class="border border-gray-900 dark:border-gray-100 px-6 py-3 rounded-lg shadow-md hover:bg-gray-900 hover:text-white transition text-sm sm:text-base md:text-base">Ingia</Link>
                </div>
            </div>
        </section>

        {/* ABOUT US  */}
        <section id="about" class="flex items-center min-h-screen px-6 mx-auto bg-gray-300 dark:bg-gray-600">
          <div class="w-full md:w-1/2 ml-auto text-right">
              <h2 class="text-2xl sm:text-3xl md:text-3xl font-bold mb-4">Kuhusu PosTech</h2>
              <p class="text-sm sm:text-base md:text-base text-gray-600 dark:text-gray-300">
                  PosTech ni mfumo wa kisasa wa Point-of-Sale uliotengenezwa ili kurahisisha shughuli za biashara hasa mauzo na utunzaji wa taarifa za kibiashara kwa kufanya
                  uchanganuzi wa faida, usimamizi wa mauzo na manunuzi, na shughuli zisizo na mashaka, tunawasaidia wajasiriamali kufanikiwa.
              </p>
          </div>        
        </section>

        {/* WHY CHOOSE US  */}
        <section id="features" class="min-h-screen bg-white flex flex-col items-center justify-center py-20 px-6 dark:bg-gray-800">
            <h2 class="text-2xl sm:text-3xl md:text-3xl font-bold text-center mb-12">Kwa Nini PosTech?</h2>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {/* <!-- Left Column --> */}
            <div class="flex flex-col space-y-6">
                <div class="p-6 bg-gray-50 dark:bg-gray-600 rounded-lg shadow-md">
                <h3 class="text-lg sm:text-xl md:text-xl font-semibold mb-2">📊 Uchambuzi Imara</h3>
                <p class="text-gray-600 dark:text-gray-300">Pata uchanganuzi wa wakati halisi kuhusu mauzo na orodha zako.</p>
                </div>
                <div class="p-6 bg-gray-50 dark:bg-gray-600 rounded-lg shadow-md">
                <h3 class="text-lg sm:text-xl md:text-xl font-semibold mb-2">💰 Usimamizi wa Mauzo na Gharama</h3>
                <p class="text-gray-600 dark:text-gray-300">Fuata kila shughuli kwa urahisi.</p>
                </div>
            </div>

            {/* <!-- Empty Middle Column --> */}
            <div></div>

            {/* <!-- Right Column --> */}
            <div class="flex flex-col space-y-6">
                <div class="p-6 bg-gray-50 dark:bg-gray-600 rounded-lg shadow-md">
                <h3 class="text-lg sm:text-xl md:text-xl font-semibold mb-2">📦 Usimamizi wa Orodha</h3>
                <p class="text-gray-600 dark:text-gray-300">Hatutakosa bidhaa tena.</p>
                </div>
                <div class="p-6 bg-gray-50 dark:bg-gray-600 rounded-lg shadow-md">
                <h3 class="text-lg sm:text-xl md:text-xl font-semibold mb-2">⚡ Haraka na Salama</h3>
                <p class="text-gray-600 dark:text-gray-300">Imebuniwa kwa utendaji bora na usalama.</p>
                </div>
            </div>
            </div>
        </section>

        {/* CONTACT-SECTION  */}
        <section id="contact" class="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 py-20 px-6">
        <h2 class="text-2xl sm:text-3xl font-bold mb-4">Wasiliana Nasi</h2>
  
        <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-2">
            Una swali au changamoto? Tupo tayari kukusaidia. Unaweza pia kupiga simu: 
            <span class="font-medium text-gray-800 dark:text-gray-200"> 0621 031 195</span>
        </p>

        <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-2">
            Unaweza pia kututumia barua pepe: 
            <a href="mailto:huduma@mypostech.store" class="text-amber-700 dark:text-amber-400 font-semibold underline hover:text-amber-800 transition-colors pl-1">
                huduma@mypostech.store
            </a>
        </p>

        <p class="text-base font-medium text-gray-700 dark:text-gray-100 mt-2 mb-6">
            Au jaza fomu ifuatayo hapa chini:
        </p>


        <form preventdefault:submit onSubmit$={handleSubmitContact} class="w-full max-w-lg bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
            <div class="mb-4">
                <label class="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Jina</label>
                <input type="text" class="w-full p-3 border rounded-md dark:bg-gray-500" placeholder="Jina Lako" name={contactStore.name} 
                    onInput$={(e) => handleInputChange('name', (e.target as HTMLInputElement).value)} 
                />
                {contactStore.errors.name && <p class="text-red-500 text-sm">{contactStore.errors.name}</p>}
                {contactStore.valid.name && <p class="text-green-500 text-sm">✔ Sahihi</p>}

            </div>

            <div class="mb-4">
                <label class="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Barua Pepe</label>
                <input type="email" class="w-full p-3 border rounded-md dark:bg-gray-500" placeholder="Barua Pepe Yako (email)" name={contactStore.email} 
                    onInput$={(e) => handleInputChange('email', (e.target as HTMLInputElement).value)} 
                />
                {contactStore.errors.email && <p class="text-red-500 text-sm">{contactStore.errors.email}</p>}
                {contactStore.valid.email && <p class="text-green-500 text-sm">✔ Sahihi</p>}            
            </div>

            <div class="mb-4">
                <label class="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Ujumbe</label>
                <textarea class="w-full p-3 border rounded-md dark:bg-gray-500" rows={4} placeholder="Ujumbe Wako" value={contactStore.message}
                    onInput$={(e) => handleInputChange('message', (e.target as HTMLInputElement).value)}
                ></textarea>
                {contactStore.errors.message && <p class="text-red-500 text-sm">{contactStore.errors.message}</p>}
                {contactStore.valid.message && <p class="text-green-500 text-sm">✔ Sahihi</p>}            
            </div>

            <button
                type="submit"
                class="bg-gray-900 text-white px-6 py-3 rounded-md w-full transition 
                        hover:bg-gray-800 
                        disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
                disabled={contactStore.isLoading || !Object.values(contactStore.valid).every((v) => v)}
                >
                {!contactStore.isLoading ? "Tuma Ujumbe" : "Inashughulikiwa..."}
            </button>

        </form>
        </section>

        {/* Modal Popup */}
        {contactStore.modal.isOpen && (
        <div class="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-neutral-500 z-50">
        <div class="bg-white p-6 rounded shadow-lg text-center">
            <p class={contactStore.modal.isSuccess ? 'text-green-600' : 'text-red-600'}>{contactStore.modal.message}</p>
            <button class="mt-4 bg-blue-500 text-white px-4 py-2 rounded" onClick$={() => (contactStore.modal.isOpen = false)}>
            Ok
            </button>
        </div>
        </div>
        )}

        {/* FOOTER  */}
        <footer class="bg-gray-900 dark:bg-gray-600 text-white text-center py-6">
            <p>© {new Date().getFullYear()} PosTech. Haki Zote Zimehifadhiwa.</p>
        </footer>
        <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"></script>
    </div>
    </>
});


export const head: DocumentHead = {
    title: "PosTech - Endesha biashara yoyote kidigitali, kwa simu yako tu.",
    meta: [
      // SEO Basic meta tags
      { name: "description", content: "Hakuna kukariri bei, kutunza kumbukumbu kwenye daftari, mahesabu, kufuatilia bidhaa zilizokwisha, na mengine mengi. Rahisisha mauzo, Angalia mwenendo wa faida kila siku, fuatilia madeni, na simamia bidhaa zako kwa ufanisi zaidi leo!" },
      { name: "keywords", 
        content: "POS, myPostech, mypostech store, postech store, PosTech, sales management, inventory management, Qwik, e-commerce, point of sale system, POS ya kiswahili, Programu ya Biashara, Stoo, Madeni, Mfumo wa biashara, biashara kidigitali" 
      },
      { name: "author", content: "Twahir Sudy" },
      { name: "robots", content: "index, follow" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { httpEquiv: "Content-Security-Policy", content: "upgrade-insecure-requests" },
      { itemprop: "name", content: "PosTech"},
      { name: "theme-color", content: "#ffffff", media:"(prefers-color-scheme: light)" },
      
      
      // Open Graph (OG) tags for social media
      { property: "og:title", content: "PosTech - Mfumo wa Kisasa wa Biashara" },
      { property: "og:description", content: "Mfumo ya kisasa unayotumia QR Codes. fuatilia bidhaa, mauzo na madeni. PosTech ~ Biashara yako, teknolojia yetu" },
      { property: "og:image", content: "https://www.mypostech.store/thumbnail2.png" },
      { property: "og:url", content: "https://mypostech.store" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Postech - Mfumo wa kisasa wa biashara" },
  
  
      // Twitter Card meta tags
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "PosTech - Mfumo bora kwa biashara zote" },
      { name: "twitter:description", content: "Mauzo ya haraka kwa kutumia QR, dashibodi ya Kiswahili, na muundo wa kisasa wa simu." },
      { name: "twitter:image", content: "https://mypostech.store/thumbnail2.png" },
  
      // Structured Data (JSON-LD) for enhanced SEO
      {
        name: "application/ld+json",
        content: JSON.stringify(
            {
                "@context": "https://schema.org",
                "@graph": [
                  {
                    "@type": "Organization",
                    "name": "PosTech",
                    "url": "https://mypostech.store",
                    "logo": "https://mypostech.store/newLogo.png"
                  },
                  {
                    "@type": "LocalBusiness",
                    "name": "PosTech",
                    "image": "https://mypostech.store/thumbnail2.png",
                    "url": "https://mypostech.store",
                    "telephone": "+255621031195",
                    "address": {
                      "@type": "PostalAddress",
                      "streetAddress": "Kurasini",
                      "addressLocality": "Temeke",
                      "addressRegion": "Coast",
                      "addressCountry": "TZ"
                    },
                    "openingHours": "Mo-Su 06:00-22:00"
                  },
                  {
                    "@type": "Product",
                    "name": "PosTech QR POS System",
                    "image": "https://mypostech.store/thumbnail2.png",
                    "description": "POS system with QR code support, real-time analytics, debt tracking, and Swahili dashboard.",
                    "brand": {
                      "@type": "Brand",
                      "name": "PosTech"
                    },
                    "offers": {
                      "@type": "Offer",
                      "url": "https://mypostech.store",
                      "priceCurrency": "TZS",
                      "price": "0.00",
                      "availability": "https://schema.org/InStock"
                    }
                  },
                  {
                    "@type": "SoftwareApplication",
                    "name": "PosTech",
                    "operatingSystem": "Web",
                    "applicationCategory": "BusinessApplication",
                    "offers": {
                      "@type": "Offer",
                      "price": "0.00",
                      "priceCurrency": "TZS"
                    },
                    "aggregateRating": {
                      "@type": "AggregateRating",
                      "ratingValue": "4.8",
                      "reviewCount": "143"
                    }
                  },
                  {
                    "@type": "FAQPage",
                    "mainEntity": [
                      {
                        "@type": "Question",
                        "name": "Je, PosTech ni nini?",
                        "acceptedAnswer": {
                          "@type": "Answer",
                          "text": "PosTech ni mfumo wa kisasa wa mauzo na stoo unaotumia QR codes kusaidia wafanyabiashara."
                        }
                      },
                      {
                        "@type": "Question",
                        "name": "Je, ninatumia nini kuscan qrcode?",
                        "acceptedAnswer": {
                          "@type": "Answer",
                          "text": "Tumia app yoyote kwenye simu yako isiyokuwa na matangazo, lakini napendekeza Google Lens"
                        }
                      },
                      {
                        "@type": "Question",
                        "name": "PosTech inasaidia lugha gani?",
                        "acceptedAnswer": {
                          "@type": "Answer",
                          "text": "Inasaidia Kiswahili, Kiingereza, Kifaransa, na Kiarabu."
                        }
                      }
                    ]
                  }
                ]
              }       
        )
      }
    ],
    links: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico'
        }, 
        // {
        //     rel: "manifest",
        //     href: "https://www.mypostech.store/manifest.json",
        // },
      ]
  };