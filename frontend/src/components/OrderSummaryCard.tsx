import type { CartItemType } from "@/pages/RestaurantDetailsPage"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"
import { Trash } from "lucide-react"
import { useAuthContext } from "@/context/AuthContext"
import { useState } from "react"
import CheckoutUserInformationDialog from "./CheckoutUserInformationDialog"
import { useLocation, useNavigate } from "react-router"

type Props = {
    cartItems: CartItemType[],
    handleRemoveCartItem: (menuItemId: string) => void,
    deliveryFee: number,
    restaurantId: string
}

const OrderSummaryCard = ({ cartItems, handleRemoveCartItem, deliveryFee, restaurantId }: Props) => {
    const [isOpen, setIsOpen] = useState(false)

    const { userInfo } = useAuthContext()

    const navigate = useNavigate()
    const location = useLocation()
    
    const getCartItemTotal = (cartItem: CartItemType) => {
        const itemTotalInCents = cartItem.price * cartItem.quantity

        return (itemTotalInCents / 100).toFixed(2)
    }

    const getSubtotal = () => {
        const subtotalInCents = cartItems.reduce((acc, cartItem) => acc + cartItem.price * cartItem.quantity, 0)

        return (subtotalInCents / 100).toFixed(2)
    }

    const getTotal = () => {
        const subtotalInCents = cartItems.reduce((acc, cartItem) => acc + cartItem.price * cartItem.quantity, 0)

        const totalInCents = subtotalInCents + deliveryFee

        return (totalInCents / 100).toFixed(2)
    }

    return (
        <Card className="md:max-w-md w-full">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">Your Order</CardTitle>
            </CardHeader>

            <CardContent>

                <div className="flex flex-col gap-2">
                    {cartItems.map((cartItem) => (
                        <div key={cartItem.menuItemId} className="flex justify-between items-center border p-4 rounded-lg">
                            <div>
                                <p className="font-medium">{cartItem.name}</p>
                                <p className="text-sm text-muted-foreground">Qty: {cartItem.quantity}</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="font-semibold">${getCartItemTotal(cartItem)}</span>
                                <Trash onClick={() => handleRemoveCartItem(cartItem.menuItemId)} className="size-5 text-red-600 hover:text-red-600/90 cursor-pointer"/>
                            </div>
                        </div>
                    ))}

                </div>
                
            </CardContent>

            <CardFooter>
                <div className="flex flex-col gap-2 w-full">
                    <div className="flex justify-between items-center">
                        <span className="font-medium text-muted-foreground">Subtotal</span>
                        <span>${getSubtotal()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                        <span className="font-medium text-muted-foreground">Delivery Fee</span>
                        <span>${(deliveryFee / 100).toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                        <span className="font-medium text-muted-foreground">Total</span>
                        <span>${getTotal()}</span>
                    </div>
                    <Separator />

                    <Button
                        onClick={() => {
                            if(userInfo) {
                                setIsOpen(true)
                            } else {
                                navigate("/login", { state: { from: location }})
                            }
                        }} 
                        className="w-full bg-orange-500 hover:bg-orange-500/90 cursor-pointer"
                    >
                        {userInfo ? "Proceed to checkout" : "Log In to Checkout"}
                    </Button>
                    <CheckoutUserInformationDialog 
                        isOpen={isOpen} 
                        setIsOpen={setIsOpen}
                        cartItems={cartItems}
                        restaurantId={restaurantId}
                    />
                </div>

            </CardFooter>

        </Card>
    )
}
export default OrderSummaryCard