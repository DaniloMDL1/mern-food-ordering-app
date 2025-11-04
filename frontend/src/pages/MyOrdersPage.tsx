import LoadingSpinner from "@/components/LoadingSpinner"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import type { OrderType } from "@/types/order"
import { ORDER_STATUS } from "@/utils/orderStatus"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { format } from "date-fns"
import { AlertCircleIcon, MapPin } from "lucide-react"

const fetchMyOrders = async (): Promise<OrderType[]> => {
    const response = await axios.get("/api/orders/user")
    return response.data
}

const MyOrdersPage = () => {

    const { data: orders, isPending, isError } = useQuery({
        queryKey: ["myOrders"],
        queryFn: fetchMyOrders
    })

    const getExpectedDeliveryTime = (order: OrderType) => {
        const date = new Date(order.createdAt)

        date.setMinutes(date.getMinutes() + order.restaurant.estimatedDeliveryTime)

        return format(date, "p")
    }

    const getOrderStatusInfo = (order: OrderType) => {
        return ORDER_STATUS.find((orderStatus) => orderStatus.value === order.status) || ORDER_STATUS[0]
    }

    return (
        <div>
            {isPending && (
                <div className="flex justify-center mt-4">
                    <LoadingSpinner color="text-orange-500" size="size-8"/>
                </div>
            )}

            {isError && (
                <div className="flex justify-center mt-4">
                    <div>
                        <Alert variant={"destructive"}>
                            <AlertCircleIcon />
                            <AlertTitle>Error fetching user orders data</AlertTitle>
                        </Alert>
                    </div>
                </div>
            )}

            {!isPending && !isError && orders.length === 0 && (
                <div className="flex justify-center">
                    <p className="text-lg font-medium">No orders yet</p>
                </div>
            )}

            <div className="flex flex-col gap-4">
                {!isPending && !isError && orders.length > 0 && orders.map((order) => (
                    <div key={order._id} className="border p-4 rounded-lg">
                        {/* header */}
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg max-md:text-base font-medium">
                                Order Status: {getOrderStatusInfo(order).label}
                            </h2>
                            <h2 className="text-lg max-md:text-base font-medium">
                                Expected delivery by: {getExpectedDeliveryTime(order)}
                            </h2>
                        </div>
                        <Progress className={`${order.status === "delivered" ? "" : "animate-pulse"} *:bg-orange-500`} value={getOrderStatusInfo(order).progressValue}/>

                        <div className="mt-4 flex items-center gap-2">
                            <span className="text-lg font-semibold">{order.restaurant.name}</span>
                            <div className="flex items-center gap-1">
                                <MapPin />
                                <span className="">{order.restaurant.country}, {order.restaurant.city}</span>
                            </div>
                        </div>

                        <div className="mt-4 flex max-md:flex-col md:justify-between gap-4">
                            <div className="w-2/5 max-md:w-full rounded-lg overflow-hidden">
                                <img src={order.restaurant.image || "https://placehold.co/600x400"}/>
                            </div>

                            <div className="flex-1 flex flex-col gap-2">
                                <div>
                                    <h4 className="font-medium">Delivered to:</h4>
                                    <span>{order.user.name}</span>
                                </div>

                                <div>
                                    <h4 className="font-medium">Your order:</h4>
                                    <div>
                                        {order.cartItems.map((cartItem) => (
                                            <div key={cartItem.menuItemId}>
                                                <span>{cartItem.name} x {cartItem.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>


                                <div className="flex items-center gap-1 mt-auto">
                                    <span className="font-medium">Total:</span>
                                    <span className="font-semibold">${(order.totalAmount / 100).toFixed(2)}</span>
                                </div>


                            </div>
                        </div>


                    </div>
                ))}
            </div>
        </div>
    )
}
export default MyOrdersPage