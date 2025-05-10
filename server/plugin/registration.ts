import Elysia from "elysia";
import { regPost } from "../functions/regFunc";
import { registerData } from "../functions/security/validators/data";

const regPlugin = new Elysia()
    .post("/register", regPost, { body: registerData })

export default regPlugin