import express from "express"
import { protect } from "../middleware/authMiddleware"
import { createCheckoutSession, getRestaurantOrders, getUserOrders, stripeWebhookHandler, updateOrderStatus } from "../controllers/orderController"

const router = express.Router()

router.get("/user", protect, getUserOrders)
router.get("/restaurant", protect, getRestaurantOrders)
router.post("/create-checkout-session", protect, createCheckoutSession)
router.post("/checkout/webhook", stripeWebhookHandler)
router.patch("/status/:orderId", protect, updateOrderStatus)

export default router