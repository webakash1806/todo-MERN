import { Router } from "express"
import { isLoggedIn, loginAuth } from "../middleware/auth.middleware.js"
import { addTask, deleteTask, getTasks, updateTask } from "../controller/task.controller.js"

const router = Router()

router.post('/add', isLoggedIn, addTask)

router.get('/', isLoggedIn, getTasks)

router.put('/:id', isLoggedIn, updateTask)

router.delete('/:id', isLoggedIn, deleteTask)

export default router
