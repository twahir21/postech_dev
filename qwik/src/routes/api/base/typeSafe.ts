export interface CrudItem {
    id?: string ;
  }
  
  export type CrudResponse<T> = 
  | { success: true; data: T; message?: string }
  | { success: false; message?: string };


  export interface ContactTypes extends CrudItem{
    name: string,
    email: string,
    message: string
  }

  export interface Supplier {
    id: string;
    company: string;
    contact: string
    createdAt: string;
  }

  export interface categoriesPost {
    id: string,
    generalName: string
  }

  export interface supplierData {
    id: string,
    company: string,
    contact: string
  }