import { component$, useStore, $, useTask$, useVisibleTask$, useSignal } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { HomeComponent } from "~/components/Home";
import { ProductComponent } from "~/components/Products";
import { CustomerComponent } from "~/components/Customer";
import { CrudPrdComponent } from "~/components/PrdComponent";
import { SalesComponent } from "~/components/Sales";
import { DebtComponent } from "~/components/Debts";
import { ExpensesComponent } from "~/components/Expenses";
import { SuppCrudComponent } from "~/components/Supp";
import { SettingsComponent } from "~/components/Settings";
import { MainGraph } from "~/components/reports/MainGraph";
// import { OthersComponent } from "~/components/Others";
import { CrudService } from "../api/base/oop";
import { useAuthLoader } from "../layout";
import { AskedProducts } from "~/components/Asked";
import { Speech } from "~/components/Speech";


export default component$(() => {
  const store = useStore({
    isSidebarOpen: false,
    currentPage: "Nyumbani",
    input: "",
    showCalculator: false,
    username: "",
    notification: 0
  });

  const showTooltip = useSignal(false);
  const showMic = useSignal(false); // only render <Speech /> after tooltip closed


  const closeTooltip = $(() => {
    showTooltip.value = false;
    showMic.value = true;
  });

  const toggleSidebar = $(() => {
    store.isSidebarOpen = !store.isSidebarOpen;
  });

  const handleButtonClick = $((value: string) => {
    if (value === "C") {
      store.input = "";
    } else if (value === "=") {
      try {
        store.input = store.input = Function('"use strict"; return (' + store.input + ')')();

      } catch {
        store.input = "Error";
      }
    } else {
      store.input += value;
    }
  });

  const navigate = $((page: string) => {
    store.currentPage = page;
    if (window.innerWidth < 768) store.isSidebarOpen = false; // Close on mobile
  });

  const fetchUsername = $(async () => {
    const getNameApi = new CrudService<{ id?: string; username: string}>("me");
    const getName = await getNameApi.get();
    if (!getName.success) return
  })

  const usernameData = useAuthLoader(); // data from SSR cookie (secured!)

  useTask$(() => {
      let username = usernameData.value.username;
      if (!username) {
        username = "Mgeni"
        fetchUsername(); // actual call 
      }

      // Utility function to capitalize the first letter of each word
    const capitalizeWords = (username: string) => {
      return username
        .trim() // Remove leading/trailing spaces
        .split(' ') // Split by space to handle multi-word names
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter of each word
        .join(' '); // Rejoin words with a space
    };
    store.username = capitalizeWords(username);
  });  
  
  // Logout function
  const navigateLogout = useNavigate();

  const logout = $(async () => {
    // Delete the authentication cookie do not do with plain JavaScript frontend
    const logoutApi = new CrudService("delete-cookie");

    const logoutRes = await logoutApi.get();
    if (!logoutRes.success) return;

    // Redirect to the login page or home page
    navigateLogout("/auth");  
  });

  useVisibleTask$(async () => {
    const notApi = new CrudService<{ id?: string; count: number }>("notifyCount");
    const result = await notApi.get();

    if(!result.success) return;
    
    store.notification = result.data[0].count;

  });

  // Show once when component is mounted
  useVisibleTask$(() => {
    const seenTip = localStorage.getItem('seenVoiceTip');
    if (!seenTip) {
      showTooltip.value = true;
      localStorage.setItem('seenVoiceTip', 'true');
    }
  });


  return (
    <div class="flex min-h-screen m-0">
      {/* Sidebar & Overlay */}
      <aside
        class={`bg-gray-800 text-white fixed inset-y-0 left-0 transform transition-all duration-300 md:relative md:translate-x-0 w-64 p-4 z-50 ${
          store.isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button class="md:hidden absolute top-4 right-4 text-white" onClick$={toggleSidebar}>
          ✖
        </button>
        <span class="inline-flex items-center pl-1">
          <img 
            src="/newLogo.webp" 
            alt="Profile" 
            class="w-10 h-10 rounded-full border-2 border-blue-600 ml-2" 
            width="70" 
            height="70" 
          />
          <p class="pl-2">myPosTech</p>
        </span>

        <nav class="mt-5">
          {[
            { name: "Nyumbani", emoji: "🏠" },
            { name: "Anza hapa", emoji: "🚀" },
            { name: "Mauzo", emoji: "💰" },
            // { name: "Mengineyo", emoji: "🧿" },
            { name: "Madeni", emoji: "💳" },
            { name: "Matumizi", emoji: "💸" },
            { name: "Ripoti", emoji: "📉" },
            { name: "Bidhaa", emoji: "📦" },
            { name: "Wateja", emoji: "👥" },
            { name: "Zinazoulizwa", emoji: "⭐" },
            { name: "Wasambazaji", emoji: "🔗" },
            { name: "Mipangilio", emoji: "⚙️" },
          ].map(({ name, emoji }) => (
            <button
              key={name}
              class="block w-full text-left py-2 px-4 hover:bg-gray-700"
              onClick$={() => navigate(name)}
            >
              <span class="mr-2">{emoji}</span>{name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {store.isSidebarOpen && (
        <div class="fixed inset-0 bg-opacity-50 md:hidden m-0" onClick$={toggleSidebar}></div>
      )}

      {/* Main Content */}
      <div class="w-full flex-1 flex flex-col m-0">
        {/* Top Navbar */}
        <header class="bg-white shadow-md p-4 flex justify-between items-center">
          <button class="md:hidden" onClick$={toggleSidebar}>☰</button>
          <h1>Dashboard</h1>
          <div class="flex gap-5">
            <div class="relative">
              <button
                title="Calculator"
                class="p-2 text-white rounded"
                onClick$={() => (store.showCalculator = true)}
              >
                📱
              </button>

              {store.showCalculator && (
                <div class="fixed inset-0 flex justify-end items-center bg-opacity-50">
                  <div class="bg-white p-6 rounded-lg shadow-lg w-80 relative border-2 border-b-blue-900">
                    <button
                      class="absolute top-2 right-2 text-gray-600 hover:text-red-600 pb-2"
                      onClick$={() => (store.showCalculator = false)}
                    >
                      ✖
                    </button>
                    <input
                      type="text"
                      class="w-full p-2 text-right text-xl border rounded mb-4 mr-4 mt-4"
                      value={store.input}
                      disabled
                    />
                    <div class="grid grid-cols-4 gap-2">
                      {["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", "C", "=", "+"].map(
                        (btn) => (
                          <button
                            key={btn}
                            class={`p-4 rounded text-xl ${
                              btn === "C" ? "bg-red-500 text-white" :
                              btn === "=" ? "bg-gray-900 text-white" :
                              "bg-gray-200"
                            }`}
                            onClick$={() => handleButtonClick(btn)}
                          >
                            {btn}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* tooltip  */}
            <div class="relative">
              <button
                class="pt-2"
                onClick$={() => (showTooltip.value = !showTooltip.value)}
                title="Maelezo"
              >
                ℹ️
              </button>

              {showTooltip.value && (
                <div class="absolute z-50 top-8 right-1 w-72 bg-white text-gray-700 p-4 rounded shadow border text-sm">
                  <h3 class="font-bold mb-2">🗣️ Jinsi ya kutumia sauti</h3>
                    <ul class="list-disc pl-4 space-y-1">
                      <li>Anza na mojawapo ya maneno: <strong>nimeuza</strong>, <strong>nimenunua</strong>, <strong>nimetumia</strong>, au <strong>nimemkopesha</strong></li>
                      <li>Endelea na <strong>jina la bidhaa</strong> — mfano: “sukari”, “maziwa”</li>
                      <li>Kisha taja <strong>kiasi</strong> — mfano: “tatu”, “moja”, “robo”, “kumi na mbili”</li>
                      <li>Kwa mkopo: taja <strong>jina la mteja</strong> baada ya neno la kwanza — mfano: “Nimemkopesha Ali...”</li>
                      <li>Kwa hiari: unaweza ongeza <strong>punguzo</strong> — mfano: “punguzo 200”</li>
                      <li>Kwa haraka: unaweza kusema <strong>sukari nusu</strong> - itakuwa inamaanisha nimeuza sukari nusu </li>
                      <li><strong>Mifano:</strong> Nimeuza chumvi 4. Nimemkopesha Ali sukari robo. Nimeuza daftari 7 punguzo 200. Nimenunua mchele kilo mia</li>
                    </ul>

                  <div class="text-right mt-2">
                    <button
                      class="text-red-500 text-sm"
                      onClick$={closeTooltip}
                    >
                      Funga
                    </button>
                  </div>
                </div>
              )}
            </div>


            {/* 🧠 Embed Speech component inline here */}
            <div class="relative">
              <Speech />
            </div>

            <button title="ujumbe">
              <div style="position: relative; display: inline-block;">
                🔔
              {store.notification > 0 && (
                <span style="
                  position: absolute;
                  top: -8px;
                  right: -8px;
                  background: red;
                  color: white;
                  border-radius: 50%;
                  padding: 2px 4px;
                  font-size: 11px;
                ">                 
                  {store.notification}
                </span>
              )}
              </div>
            </button>

            <button title="Funga" onClick$={logout}> 👋 </button>

          </div>
        </header>

        {/* Dynamic Page Content */}
        <main class="p-6">
          <h1 class="text-xl font-bold pb-2">Karibu, {store.username}</h1>

          {store.currentPage === "Nyumbani" && <HomeComponent />}
          {store.currentPage === "Anza hapa" &&  <ProductComponent />}
          {store.currentPage === "Mauzo" && <SalesComponent />}
          {/* {store.currentPage === "Mengineyo" && <OthersComponent />} */}
          {store.currentPage === "Madeni" && <DebtComponent />}
          {store.currentPage === "Matumizi" && <ExpensesComponent />}
          {store.currentPage === "Ripoti" && <MainGraph />}
          {store.currentPage === "Bidhaa" && <CrudPrdComponent /> }
          {store.currentPage === "Wateja" && <CustomerComponent />}
          {store.currentPage === "Zinazoulizwa" && <AskedProducts />}
          {store.currentPage === "Wasambazaji" && <SuppCrudComponent />} 
          {store.currentPage === "Mipangilio" && <SettingsComponent />}
        </main>
      </div>
    </div>
  );
});
