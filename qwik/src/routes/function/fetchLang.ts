// Function to make API requests with the selected language in headers
export const fetchWithLang = async (url: string, options: RequestInit = {}) => {
  const selectedLanguage = localStorage.getItem("selectedLanguage") || "en";
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "Accept-Language": selectedLanguage,
    },
  });
};