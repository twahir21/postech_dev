import type { CrudItem, CrudResponse } from "./typeSafe";
import { env } from "./config";

const backendURL = env.mode === 'development' ? env.backendURL_DEV : env.backendURL;

class CrudService<T extends CrudItem> {
  private readonly baseUrl: string;

  constructor(basePath: string) {
    this.baseUrl = `${backendURL}/${basePath}`;
  }

  async postEarly(data: Partial<T>): Promise<CrudResponse<T>> {
    try {
      const res = await fetch(this.baseUrl, {
        method: 'POST',
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


  async get(): Promise<CrudResponse<T[]>> {
    try {
      const res = await fetch(this.baseUrl, 
        { 
          method: 'GET', 
          credentials: 'include',

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
      const res = await fetch(`${this.baseUrl}/${id}`, {
        method: 'GET',
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
      const res = await fetch(this.baseUrl, {
        method: 'POST',
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

  async update(data: Partial<T>): Promise<CrudResponse<T>> {
    try {
      const res = await fetch(`${this.baseUrl}`, {
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


  async deleteAll(): Promise<CrudResponse<void>> {
    try {
      const res = await fetch(`${this.baseUrl}`, {
        method: 'DELETE',
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
