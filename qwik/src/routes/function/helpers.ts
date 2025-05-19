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
