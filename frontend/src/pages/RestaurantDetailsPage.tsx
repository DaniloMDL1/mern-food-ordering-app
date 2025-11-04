import LoadingSpinner from "@/components/LoadingSpinner"
import OrderSummaryCard from "@/components/OrderSummaryCard"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import type { MenuItemType, RestaurantType } from "@/types/restaurant"
import { skipToken, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { AlertCircleIcon, MapPin, PlusCircle } from "lucide-react"
import { useState } from "react"
import { useParams } from "react-router"

const fetchRestaurant = async (restaurantId: string): Promise<RestaurantType> => {
    const response = await axios.get(`/api/restaurants/${restaurantId}`)
    return response.data
}

export type CartItemType = {
    menuItemId: string,
    name: string,
    price: number,
    quantity: number
}

const RestaurantDetailsPage = () => {
    const { restaurantId } = useParams()
    
    const [cartItems, setCartItems] = useState<CartItemType[]>(() => {
        const storedCartItems = sessionStorage.getItem(`cartItems-${restaurantId}`)

        return storedCartItems ? JSON.parse(storedCartItems) : []
    })

    const { data: restaurant, isPending, isError } = useQuery({
        queryKey: ["restaurant", restaurantId],
        queryFn: restaurantId ? () => fetchRestaurant(restaurantId) : skipToken
    })

    const handleAddToCart = (menuItem: MenuItemType) => {
        setCartItems((prevCartItems) => {
            const existingCartItem = prevCartItems.find((cartItem) => cartItem.menuItemId === menuItem._id)

            let updatedCartItems

            if(existingCartItem) {
                updatedCartItems = prevCartItems.map((cartItem) => cartItem.menuItemId === menuItem._id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem)
            } else {
                updatedCartItems = [...prevCartItems, { menuItemId: menuItem._id, name: menuItem.name, price: menuItem.price, quantity: 1 }]
            }

            sessionStorage.setItem(`cartItems-${restaurantId}`, JSON.stringify(updatedCartItems))

            return updatedCartItems
        })
    }

    const handleRemoveCartItem = (menuItemId: string) => {
        setCartItems((prevCartItems) => {
            const updatedCartItems = prevCartItems.filter((cartItem) => cartItem.menuItemId !== menuItemId)

            sessionStorage.setItem(`cartItems-${restaurantId}`, JSON.stringify(updatedCartItems))
            return updatedCartItems
        })
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
                            <AlertTitle>Error fetching restaurant data</AlertTitle>
                        </Alert>
                    </div>
                </div>
            )}

            {!isPending && !isError && restaurant && (
                <div>
                    <div className="w-full aspect-video rounded-lg overflow-hidden">
                        <img 
                            src={restaurant.image || "https://placehold.co/600x400"}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="p-2 flex gap-4 max-md:flex-col">
                        <div className="flex-1 space-y-4">
                            <h1 className="text-2xl font-semibold">{restaurant.name}</h1>

                            <div className="flex flex-wrap gap-2">
                                {restaurant.cuisines.map((cuisine, index) => (
                                    <Badge key={index} className="bg-orange-500 p-2">
                                        {cuisine}
                                    </Badge>
                                ))}
                            </div>

                            <p className="text-muted-foreground">{restaurant.description}</p>

                            <div className=" flex items-center gap-2 text-muted-foreground">
                                <MapPin className="size-5"/>
                                <span>{restaurant.country}, {restaurant.city}</span>
                            </div>
                            
                            <div className="">
                                <h2 className="text-lg font-semibold">Favorite Menu</h2>

                                <div className="flex flex-col gap-4 mt-2">
                                    {restaurant.menuItems.map((menuItem) => (
                                        <div key={menuItem._id} className="w-full border border-gray-200 p-6 rounded-lg flex justify-between items-center gap-2">
                                            <h3 className="font-medium">{menuItem.name}</h3>

                                            <div className="flex items-center gap-2">
                                                <span className="text-green-500">
                                                    ${(menuItem.price / 100).toFixed(2)}
                                                </span>

                                                <PlusCircle onClick={() => handleAddToCart(menuItem)} className="size-6 text-orange-500 cursor-pointer"/>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        <div className="flex-1 md:flex md:flex-col md:items-end">
                            <OrderSummaryCard cartItems={cartItems} handleRemoveCartItem={handleRemoveCartItem} deliveryFee={restaurant.deliveryFee} restaurantId={restaurant._id}/>
                        </div>
                    </div>

                </div>
            )}

        </div>
    )
}
export default RestaurantDetailsPage