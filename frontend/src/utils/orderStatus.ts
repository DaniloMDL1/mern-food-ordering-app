import type { OrderStatusType } from "@/types/order"

type OrderStatusOptionType = {
    label: string,
    value: OrderStatusType,
    progressValue: number
}

export const ORDER_STATUS: OrderStatusOptionType[] = [
    { label: "Placed", value: "placed", progressValue: 0 },
    { label: "Paid", value: "paid", progressValue: 25 },
    { label: "Preparing", value: "preparing", progressValue: 50 },
    { label: "Out For Delivery", value: "outForDelivery", progressValue: 75 },
    { label: "Delivered", value: "delivered", progressValue: 100 },
]