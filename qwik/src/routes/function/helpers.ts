import { env } from "../api/base/config";


interface suppTypesafe  {
  id: string,
  company: string
}

export const globalStore = {
    supplierData: [] as suppTypesafe[],
}

export const fetchSuppliers = async () => {
    try {
      const backendURL = env.mode === 'development'
                          ? env.backendURL_DEV
                          : env.backendURL;

      const res = await fetch(`${backendURL}/suppliersAll`, {
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


export function formatDateTime(input: string): string {
  const date = new Date(input);

  // Validate the date
  if (isNaN(date.getTime())) {
    return 'Hakuna';
  }

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // UTC month (0–11)
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

export function formatDateOnly(input: string): string {
  const date = new Date(input);

  // Validate the date
  if (isNaN(date.getTime())) {
    return 'Hakuna';
  }

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // UTC month (0–11)
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
}