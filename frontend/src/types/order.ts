import type { RestaurantType } from "./restaurant"
import type { SafeUserType } from "./user"

export type OrderStatusType = "placed" | "paid" | "preparing" | "outForDelivery" | "delivered"

export type OrderType = {
    _id: string,
    restaurant: RestaurantType,
    user: SafeUserType,
    userInformation: {
        name: string,
        email: string,
        country: string,
        city: string,
        address: string
    },
    cartItems: {
        menuItemId: string,
        name: string,
        quantity: number
    }[],
    totalAmount: number,
    status: OrderStatusType,
    createdAt: Date,
    updatedAt: Date
}