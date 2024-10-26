import { Router } from "express"
import { login, logout, profile, register } from "../controller/auth.controller.js"
import { isLoggedIn, loginAuth } from "../middleware/auth.middleware.js"

const router = Router()

router.post('/register', register)

router.post('/login', loginAuth, login)

router.get('/logout', logout)

router.get('/me', isLoggedIn, profile)

export default router
