import { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import Restaurant, { MenuItemSchemaType } from "../models/restaurantModel"
import Stripe from "stripe"
import Order from "../models/orderModel"

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string)
const FRONTEND_URL = process.env.FRONTEND_URL as string
const STRIPE_ENDPOINT_SECRET= process.env.STRIPE_ENDPOINT_SECRET as string

type CreateCheckoutSessionRequestType = {
    restaurantId: string,
    cartItems: {
        menuItemId: string,
        name: string,
        quantity: string
    }[],
    userInformation: {
        name: string,
        email: string,
        country: string,
        city: string,
        address: string
    }
}

const stripeWebhookHandler = async (req: Request, res: Response) => {
    let event

    const signature = req.headers["stripe-signature"]

    try {
        event = STRIPE.webhooks.constructEvent(
            req.body,
            signature as string,
            STRIPE_ENDPOINT_SECRET
        )

    } catch(error: any) {
        console.log(error)
        return res.status(400).json({ message: "Stripe webhook error"})
    }

    if(event.type === "checkout.session.completed") {
        const session = event.data.object

        const order = await Order.findById(session.metadata?.orderId)
        if(!order) {
            return res.status(404).json({ message: "Order not found"})
        }

        order.status = "paid"
        order.totalAmount = session.amount_total

        await order.save()
    }

    res.status(200).json({ received: true })

}

const createCheckoutSession = asyncHandler(async (req: Request, res: Response) => {
    const createCheckoutSessionRequest: CreateCheckoutSessionRequestType = req.body

    const userId = req.user._id

    const restaurant = await Restaurant.findById(createCheckoutSessionRequest.restaurantId)
    if(!restaurant) {
        res.status(404)
        throw new Error("Restaurant not found")
    }

    const newOrder = new Order({
        restaurant: restaurant._id,
        user: userId,
        userInformation: createCheckoutSessionRequest.userInformation,
        cartItems: createCheckoutSessionRequest.cartItems,
        status: "placed"
    })

    const lineItems = createLineItems(createCheckoutSessionRequest, restaurant.menuItems)

    const session = await createSession(lineItems, newOrder._id.toString(), restaurant.deliveryFee, restaurant._id.toString())

    if(!session.url) {
        res.status(404)
        throw new Error("Session URL error")
    }

    await newOrder.save()

    res.status(200).json({ url: session.url })
})

const createLineItems = (createCheckoutSessionRequest: CreateCheckoutSessionRequestType, menuItems: MenuItemSchemaType[]) => {
    const lineItems = createCheckoutSessionRequest.cartItems.map((cartItem) => {
        const menuItem = menuItems.find((menuItem) => menuItem._id.toString() === cartItem.menuItemId)

        if(!menuItem) {
            throw new Error("Menu item not found")
        }

        const line_item: Stripe.Checkout.SessionCreateParams.LineItem = {
            price_data: {
                currency: "usd",
                unit_amount: menuItem.price,
                product_data: {
                    name: menuItem.name,
                }
            },
            quantity: Number(cartItem.quantity)
        }

        return line_item

    })

    return lineItems
}

const createSession = async (lineItems: Stripe.Checkout.SessionCreateParams.LineItem[], orderId: string, deliveryFee: number, restaurantId: string) => {
    const sessionData = await STRIPE.checkout.sessions.create({
        line_items: lineItems,
        mode: "payment",
        shipping_options: [
            {
                shipping_rate_data: {
                    display_name: "Delivery Fee",
                    fixed_amount: {
                        amount: deliveryFee,
                        currency: "usd"
                    },
                    type: "fixed_amount"
                }
            }
        ],
        metadata: {
            orderId,
            restaurantId
        },
        success_url: `${FRONTEND_URL}/my-orders`,
        cancel_url: `${FRONTEND_URL}/restaurants/${restaurantId}`
    })

    return sessionData
}

const getUserOrders = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user._id

    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).populate("restaurant").populate({ path: "user", select: "-password" })

    res.status(200).json(orders)
})

const getRestaurantOrders = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user._id

    const restaurant = await Restaurant.findOne({ owner: userId })
    if(!restaurant) {
        res.status(200).json([])
        return
    }

    const orders = await Order.find({ restaurant: restaurant._id }).sort({ createdAt: -1 }).populate("restaurant").populate({ path: "user", select: "-password" })

    res.status(200).json(orders)
})

const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.body
    const { orderId } = req.params

    const order = await Order.findById(orderId)
    if(!order) {
        res.status(404)
        throw new Error("Order not found")
    }

    order.status = status

    const updatedOrder = await order.save()

    res.status(200).json(updatedOrder)
})

export { createCheckoutSession, stripeWebhookHandler, getUserOrders, getRestaurantOrders, updateOrderStatus }