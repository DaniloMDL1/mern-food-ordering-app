import express from "express"
import { validateLogin, validateRegister, validateUpdateUserProfile } from "../middleware/validationMiddleware"
import { login, logout, register, updateUserProfile } from "../controllers/userController"
import { protect } from "../middleware/authMiddleware"

const router = express.Router()

router.post("/register", validateRegister, register)
router.post("/login", validateLogin, login)
router.post("/logout", logout)
router.put("/profile", protect, validateUpdateUserProfile, updateUserProfile)

export default router