import { env } from "../api/base/config";

interface categTypesafe  {
    id: string,
    generalName: string
}

interface suppTypesafe  {
  id: string,
  company: string
}

export const globalStore = {
    supplierData: [] as suppTypesafe[],
    categoriesData: [] as categTypesafe[],
}

export const fetchSuppliers = async () => {
    try {
      const backendURL = env.mode === 'development'
                          ? env.backendURL_DEV
                          : env.backendURL;

      const res = await fetch(`${backendURL}/suppliers`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();

      // Map data to extract only 'id' and 'company' fields
      globalStore.supplierData = data.success
      ? data.data.map((supplier: { id: string; company: string }) => ({
          id: supplier.id,
          company: supplier.company,
      }))
      : [];  // 
    } catch (error) {
      return [];
    }
};

export const fetchCategories = async () => {
    try {
      const backendURL = env.mode === 'development'
                      ? env.backendURL_DEV
                      : env.backendURL;
                      
      const res = await fetch(`${backendURL}/categories`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();

    // Map data to extract only 'id' and 'general name' fields
    globalStore.categoriesData = data.success
    ? data.data.map((category: { id: string; generalName: string }) => ({
        id: category.id,
        generalName: category.generalName,
    }))
    : [];  // 
    } catch (error) {
      return [];
    }
};

export const formatMoney = (amount: number | undefined): string =>
      typeof amount === 'number' ? new Intl.NumberFormat().format(amount) : '0';


export const toSwahiliFraction = (value: number): string => {
  const whole = Math.floor(value);
  const fraction = +(value - whole).toFixed(2); // normalize to 2 decimals

  let suffix = "";
  if (fraction === 0.25) suffix = " na robo";
  else if (fraction === 0.5) suffix = " na nusu";
  else if (fraction === 0.75) suffix = " na robo tatu";

  return suffix ? `${whole} ${suffix}` : `${whole}`;
};
