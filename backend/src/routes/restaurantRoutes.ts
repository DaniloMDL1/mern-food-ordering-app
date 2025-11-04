import express from "express"
import { protect } from "../middleware/authMiddleware"
import { createRestaurant, getRestaurant, getRestaurants, getUserRestaurant, updateRestaurant } from "../controllers/restaurantController"
import { validateCreateUpdateRestaurant, validateGetRestaurant } from "../middleware/validationMiddleware"
import multer from "multer"

const storage = multer.memoryStorage()
const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
})

const router = express.Router()

router.get("/", getRestaurants)
router.get("/user", protect, getUserRestaurant)
router.get("/:restaurantId", validateGetRestaurant, getRestaurant)
router.post("/", protect, upload.single("imageFile"), validateCreateUpdateRestaurant, createRestaurant)
router.put("/", protect, upload.single("imageFile"), validateCreateUpdateRestaurant, updateRestaurant)

export default router