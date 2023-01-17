import { Router } from "express"
import { login, getMe } from "../controllers/auth.js"
import { checkAuth } from "../utils/chechAuth.js"

//создаём endpointы и при выполнении на них запроса вызываем нужный котроллер или midlware
const router = new Router()

//http://localhost:8080/api/login

//Login
router.post('/login', login)

//Get me
router.post('/me', checkAuth, getMe)

export default router