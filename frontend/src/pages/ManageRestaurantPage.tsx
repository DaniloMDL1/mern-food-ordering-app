import ManageRestaurantForm from "@/components/forms/manage-restaurant-form/ManageRestaurantForm"
import LoadingSpinner from "@/components/LoadingSpinner"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { OrderType } from "@/types/order"
import type { RestaurantType } from "@/types/restaurant"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { AlertCircleIcon, MapPin } from "lucide-react"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ORDER_STATUS } from "@/utils/orderStatus"
import { toast } from "react-toastify"

const fetchUserRestaurant = async (): Promise<RestaurantType> => {
    const response = await axios.get("/api/restaurants/user")
    return response.data
}

const fetchRestaurantOrders = async (): Promise<OrderType[]> => {
    const response = await axios.get("/api/orders/restaurant")
    return response.data
}

const ManageRestaurantPage = () => {

    const { data: restaurant } = useQuery({
        queryKey: ["userRestaurant"],
        queryFn: fetchUserRestaurant
    })

    const { data: restaurantOrders, isPending, isError } = useQuery({
        queryKey: ["restaurantOrders"],
        queryFn: fetchRestaurantOrders
    })

    const queryClient = useQueryClient()

    const { mutate: updateOrderStatus, isPending: isUpdateOrderStatusPending } = useMutation<OrderType, AxiosError<{ message: string }>, { orderId: string, status: string }>({
        mutationFn: async ({ orderId, status}) => {
            const response = await axios.patch(`/api/orders/status/${orderId}`, { status })
            return response.data
        },
        onSuccess: (updatedOrder) => {
            
            queryClient.setQueryData<OrderType[]>(["restaurantOrders"], (oldOrders) => {
                return oldOrders?.map((order) => order._id === updatedOrder._id ? { ...order, status: updatedOrder.status } : order)
            })

            toast.success("Order status updated successfully")
        },
        onError: (error) => {
            toast.error(error.response?.data?.message)
        }
    })

    return (
        <div className="">
            <Tabs defaultValue="orders">
                <TabsList>
                    <TabsTrigger value="orders">Orders</TabsTrigger>
                    <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
                </TabsList>
                <TabsContent value="orders">
                    <div className="flex flex-col gap-4 bg-gray-50 rounded-lg p-4">
                        {isPending && (
                            <div className="flex justify-center">
                                <LoadingSpinner color="text-orange-500" size="size-8"/>
                            </div>
                        )}

                        {isError && (
                            <div className="flex justify-center mt-4">
                                <div>
                                    <Alert variant={"destructive"}>
                                        <AlertCircleIcon />
                                        <AlertTitle>Error fetching restaurant orders data</AlertTitle>
                                    </Alert>
                                </div>
                            </div>
                        )}

                        {!isPending && !isError && restaurantOrders.length === 0 && (
                            <div className="flex justify-center">
                                <p className="text-lg font-medium">No orders yet</p>
                            </div>
                        )}

                        {!isPending && !isError && restaurantOrders.length > 0 && restaurantOrders.map((order) => (
                            <div key={order._id} className="bg-white p-4 border rounded-lg">
                                <div className="flex justify-between md:items-center max-md:flex-col gap-4">
                                    <div className="flex items-center gap-1 text-sm">
                                        <span className="font-medium">Customer name: </span>
                                        <span>{order.userInformation.name}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm">
                                        <span className="font-medium">Customer email: </span>
                                        <span>{order.userInformation.email}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm">
                                        <MapPin className="text-muted-foreground"/>
                                        <span>
                                            {order.userInformation.address}, {format(new Date(order.createdAt), "p")}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex justify-between mb-4">
                                    <div className="text-sm">
                                        <h4 className="font-medium">Customer's order:</h4>
                                        <div>
                                            {order.cartItems.map((cartItem) => (
                                                <div key={cartItem.menuItemId}>
                                                    <span>{cartItem.name} x {cartItem.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-1">
                                        <h4 className="font-medium">Total:</h4>
                                        <span className="text-muted-foreground">${(order.totalAmount / 100).toFixed(2)}</span>
                                    </div>
                                </div>

                                <Select 
                                    defaultValue={order.status} 
                                    onValueChange={(value) => {
                                        updateOrderStatus({ orderId: order._id, status: value })
                                    }}
                                    disabled={isUpdateOrderStatusPending}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Order Status"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ORDER_STATUS.map((orderStatus) => (
                                            <SelectItem key={orderStatus.value} value={orderStatus.value}>
                                                {orderStatus.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        ))}

                    </div>
                </TabsContent>
                <TabsContent value="restaurant">
                    <ManageRestaurantForm restaurant={restaurant}/>
                </TabsContent>
            </Tabs>
        </div>
    )
}
export default ManageRestaurantPage