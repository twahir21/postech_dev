import { $, component$, useSignal, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";
import type { ContactTypes } from "./api/base/typeSafe";
import { contactApi } from "./api/base/api";
import { Typewriter } from "~/components/TypeWriter";
import { Toast } from "~/components/ui/Toast";
import { WhatsApp } from "~/components/WhatsApp";
import { Testimonials } from "~/components/Testimonials";
import { Faqs } from "~/components/Faqs";
import { Pains } from "~/components/Pains";
import { Steps } from "~/components/Steps";
import { Last } from "~/components/Last";
import { Partiners } from "~/components/Partiners";

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

    return <>
    <div class="bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <WhatsApp />

        {/* HEADER  */}
        <header class="fixed top-0 left-0 w-full bg-white dark:bg-gray-700 shadow-md z-50 transition-colors duration-300">
        <nav class="w-full max-w-6xl mx-auto flex justify-between items-center p-4 m-0">
          <a href="/" class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">myPosTech</a>

          <ul class="hidden md:flex space-x-6">
            <li><a href="#hero" class="hover:text-gray-700 dark:hover:text-gray-300 text-sm sm:text-base dark:text-gray-200">Nyumbani</a></li>
            <li><a href="#about" class="hover:text-gray-700 dark:hover:text-gray-300 text-sm sm:text-base dark:text-gray-200">Kuhusu</a></li>
            <li><a href="#features" class="hover:text-gray-700 dark:hover:text-gray-300 text-sm sm:text-base dark:text-gray-200">Unafanyaje kazi?</a></li>
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
          <a href="#features" class="block text-gray-800 dark:text-gray-200 hover:text-indigo-500">Unafanyaje kazi?</a>
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

        {/* HERO SECTION  */}
        <section id="hero" class="flex flex-col-reverse md:flex-row items-center min-h-screen px-6 max-w-6xl mx-auto pt-20 gap-12">
          {/* Left side - text */}
          <div class="w-full md:w-3/4">
            <h1 class="text-2xl sm:text-3xl md:text-3xl font-bold mb-4">
              Boresha biashara yako kwa QR Code
            </h1>
            <p class="text-sm sm:text-base md:text-base text-gray-600 mb-6 dark:text-gray-400">
              <Typewriter
                text="Mfumo wa kisasa ulio na uwezo wa kuboresha na kurahisisha shughuli za kila siku za biashara yako kwa ku scan QR Codes maalumu zitakazotengenezwa na mfumo, hivyo kufanya mahesabu yako na rekodi za mauzo kiotomatiki kwa simu yako tu!. Pia unaweza kupakua App yako, itakuja kama ujumbe ukiwa unatumia mfumo mara kwa mara"
                speed={50}
              />
            </p>
            <div class="flex flex-wrap gap-4">
              <Link
                href="/auth?reg=true"
                class="bg-gray-900 dark:bg-gray-700 text-white px-6 py-3 rounded-full shadow-md hover:bg-gray-800 transition text-sm sm:text-base md:text-base"
              >
                Jaribu Bure (siku 14)
              </Link>

              <Link
                href="#video"
                class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-700 to-green-900 text-white rounded-full shadow-2xl animate-pulse hover:animate-none transition text-sm sm:text-base"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.5 5.5v9l8-4.5-8-4.5z" />
                </svg>
                Tazama Video
              </Link>
            </div>
          </div>

    {/* Right side - image */}
    <div class="w-full md:w-1/2">
      {/* Small screens: hero.png */}
      <img
        src="/hero.png"
        alt="myPosTech mobile hero"
        class="w-ful max-w-sm mx-auto drop-shadow-xl rounded-xl block md:hidden"
        loading="lazy"
      />
      
      {/* Desktop: hero-big.png */}
      <img
        src="/hero-big.webp"
        alt="myPosTech desktop hero"
        class="w-full max-w-sm mx-auto drop-shadow-xl rounded-xl hidden md:block"
        loading="lazy"
      />
    </div>

        </section>

        {/* ABOUT US  */}
        <section id="about" class="flex items-center min-h-screen px-6 mx-auto bg-gray-200 dark:bg-gray-600">
          <div class="hidden md:block w-1/2">
            <img
              src="/gpt.png"
              alt="About myPosTech Visual"
              class="w-full max-w-sm mx-auto drop-shadow-xl rounded-full"
              loading="lazy"
            />
          </div>

          <div class="w-full md:w-1/2 ml-auto text-right">
              <h2 class="text-2xl sm:text-3xl md:text-3xl font-bold mb-4">Kuhusu myPosTech</h2>
              <p class="text-sm sm:text-base md:text-base text-gray-600 dark:text-gray-300">
                myPosTech umeundwa mahsusi kutatua changamoto halisi za wafanyabiashara wakubwa na wadogo.
                Wafanyabiashara wengi walikuwa wanapoteza faida kwa sababu ya kumbukumbu hafifu za bidhaa zao, hesabu zisizo sahihi, bidhaa kuisha bila kujua kupelekea kukosa wateja, na madeni lisilofuatiliwa vizuri.
                myPosTech imekuja kama suluhisho rahisi, salama na nafuu – kwa kila biashara, Kwa kutengeneza QR Code za bidhaa zako kiotomatiki, kuuza na kuscan QR Code ya bidhaa, kurekodi mauzo kiotomatiki, na kuona faida yako papo hapo.
                Mfumo hujifunza mwenendo wa biashara yako kupitia akili bandia (AI), na hukupa ushauri wa bidhaa gani kuagiza, lini, na kwa bei ipi.
                myPosTech - Biashara yako, Teknolojia yetu.
              </p>
          </div>        
        </section>

        {/* FAQS */}
        <Faqs />

        {/*OUR BIG CUSTOMERS*/}

        {/* PAINS  */}
        <Pains />

        {/* STEPS  */}
        <section id="features" class="bg-gray-50 py-10 px-4 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
          <Steps />
        </section>

        {/* LAST  */}
        <Last />

        {/* PARTINERS  */}
        <Partiners />

        {/* TESTIMONIALS  */}
        <Testimonials />

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
          <Toast
            isOpen={contactStore.modal.isOpen}
            type={contactStore.modal.isSuccess}
            message={contactStore.modal.message}
            onClose$={$(() => {
              contactStore.modal.isOpen = false;
            })}
          />
        )}

        {/* FOOTER  */}
        <footer class="bg-gray-900 dark:bg-gray-600 text-white text-center py-6">
            <p>© {new Date().getFullYear()} myPosTech. Haki Zote Zimehifadhiwa.</p>
        </footer>
    </div>
    </>
});


export const head: DocumentHead = {
    title: "myPosTech - Endesha biashara yoyote kidigitali, kwa simu yako tu.",
    meta: [
      // SEO Basic meta tags
      { name: "description", content: "Hakuna kukariri bei, kutunza kumbukumbu kwenye daftari, mahesabu, kufuatilia bidhaa zilizokwisha, na mengine mengi. Rahisisha mauzo, Angalia mwenendo wa faida kila siku, fuatilia madeni, na simamia bidhaa zako kwa ufanisi zaidi leo!" },
      { name: "keywords", 
        content: "POS, myPostech, mypostech store, postech store, myPosTech, sales management, inventory management, Qwik, e-commerce, point of sale system, POS ya kiswahili, Programu ya Biashara, Stoo, Madeni, Mfumo wa biashara, biashara kidigitali" 
      },
      { name: "author", content: "Twahir Sudy" },
      { name: "robots", content: "index, follow" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { httpEquiv: "Content-Security-Policy", content: "upgrade-insecure-requests" },
      { itemprop: "name", content: "myPosTech"},
      { name: "theme-color", content: "#ffffff", media:"(prefers-color-scheme: light)" },
      
      
      // Open Graph (OG) tags for social media
      { property: "og:title", content: "myPosTech - Mfumo wa Kisasa wa Biashara" },
      { property: "og:description", content: "Mfumo ya kisasa unayotumia QR Codes. fuatilia bidhaa, mauzo na madeni. myPosTech ~ Biashara yako, teknolojia yetu" },
      { property: "og:image", content: "https://www.mypostech.store/thumbnail2.webp" },
      { property: "og:url", content: "https://mypostech.store" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Postech - Mfumo wa kisasa wa biashara" },
  
  
      // Twitter Card meta tags
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "myPosTech - Mfumo bora kwa biashara zote" },
      { name: "twitter:description", content: "Mauzo ya haraka kwa kutumia QR, dashibodi ya Kiswahili, na muundo wa kisasa wa simu." },
      { name: "twitter:image", content: "https://mypostech.store/thumbnail2.webp" },
  
      // Structured Data (JSON-LD) for enhanced SEO
      {
        name: "application/ld+json",
        content: JSON.stringify(
            {
                "@context": "https://schema.org",
                "@graph": [
                  {
                    "@type": "Organization",
                    "name": "myPosTech",
                    "url": "https://mypostech.store",
                    "logo": "https://mypostech.store/newLogo.png"
                  },
                  {
                    "@type": "LocalBusiness",
                    "name": "myPosTech",
                    "image": "https://mypostech.store/thumbnail2.web[",
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
                    "name": "myPosTech QR POS System",
                    "image": "https://mypostech.store/thumbnail2.webp",
                    "description": "POS system with QR code support, real-time analytics, debt tracking, and Swahili dashboard.",
                    "brand": {
                      "@type": "Brand",
                      "name": "myPosTech"
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
                    "name": "myPosTech",
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
                        "name": "Je, myPosTech ni nini?",
                        "acceptedAnswer": {
                          "@type": "Answer",
                          "text": "myPosTech ni mfumo wa kisasa wa mauzo na stoo unaotumia QR codes kusaidia wafanyabiashara."
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
                        "name": "myPosTech inasaidia lugha gani?",
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