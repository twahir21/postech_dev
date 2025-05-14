import { CrudService } from "./oop";
import type { ContactTypes } from "./typeSafe";

export const contactApi = new CrudService<ContactTypes>("sendMail");
export const warmUpApi = new CrudService("");