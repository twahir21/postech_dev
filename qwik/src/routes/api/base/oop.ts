import { fetchWithLang } from "~/routes/function/fetchLang";
import type { CrudItem, CrudResponse } from "./typeSafe";
import { env } from "./config";

const backendURL = env.mode === 'development' ? env.backendURL_DEV : env.backendURL;

class CrudService<T extends CrudItem> {
  private readonly baseUrl: string;

  constructor(basePath: string) {
    this.baseUrl = `${backendURL}/${basePath}`;
  }

  async get(): Promise<CrudResponse<T[]>> {
    try {
      const res = await fetchWithLang(this.baseUrl, 
        { 
          method: 'GET', 
          credentials: 'include',
          mode: "cors", // allow cors if server permit (prevent cors errors)

        });
      return await res.json();
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : "Imeshindwa kupata taarifa kutoka kwenye seva"
      };
    }
  }

  async getById(id: string): Promise<CrudResponse<T>> {
    try {
      const res = await fetchWithLang(`${this.baseUrl}/${id}`, {
        method: 'GET',
        mode: "cors", // allow cors if server permit (prevent cors errors)
        credentials: 'include'
      });

      return await res.json();
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : "Imeshindwa kuchukua taarifa moja inayotakiwa"
      };
    }
  }

  async create(data: Partial<T>): Promise<CrudResponse<T>> {
    try {
      const res = await fetchWithLang(this.baseUrl, {
        method: 'POST',
        mode: "cors", // allow cors if server permit (prevent cors errors)
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });

      return await res.json()
      
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : "Imeshindwa kuhifadhi taarifa"
      };
    }
  }

  async update(id: string, data: Partial<T>): Promise<CrudResponse<T>> {
    try {
      const res = await fetchWithLang(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });

      return await res.json();
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : "Imeshindwa ku-update taarifa"
      };
    }
  }

  async delete(id: string): Promise<CrudResponse<void>> {
    try {
      const res = await fetchWithLang(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
        // mode: "cors", // allow cors if server permit (prevent cors errors) is set by default 
        credentials: 'include'
      });

      return await res.json();
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : "Imeshindwa kufuta taarifa"
      };
    }
  }
}

export { CrudService };
