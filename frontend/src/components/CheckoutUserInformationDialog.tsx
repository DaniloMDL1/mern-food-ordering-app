import type { CartItemType } from "@/pages/RestaurantDetailsPage"
import CheckoutUserInformationForm, { type CheckoutUserInformationFormDataType } from "./forms/checkout-user-information-form/CheckoutUserInformationForm"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { toast } from "react-toastify"

type Props = {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    cartItems: CartItemType[],
    restaurantId: string
}

type CreateCheckoutSessionPayloadType = {
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

const CheckoutUserInformationDialog = ({ isOpen, setIsOpen, cartItems, restaurantId }: Props) => {

    const { mutate: createCheckoutSession, isPending } = useMutation<{ url: string }, AxiosError<{ message: string }>, CreateCheckoutSessionPayloadType>({
        mutationFn: async (createCheckoutSessionFormData) => {
            const response = await axios.post("/api/orders/create-checkout-session", createCheckoutSessionFormData)
            return response.data
        },
        onSuccess: (data) => {
            window.location.href = data.url
        },
        onError: (error) => {
            toast.error(error.response?.data?.message)
        }
    })

    const onCreateCheckoutSession = (userInformationFormData: CheckoutUserInformationFormDataType) => {
        const formattedCartItems = cartItems.map((cartItem) => ({
            menuItemId: cartItem.menuItemId,
            name: cartItem.name,
            quantity: cartItem.quantity.toString()
        }))

        createCheckoutSession({
            restaurantId,
            cartItems: formattedCartItems,
            userInformation: userInformationFormData
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Checkout User Information</DialogTitle>
                    <DialogDescription>
                        Please enter your information to purchase your order.
                    </DialogDescription>
                </DialogHeader>

                <CheckoutUserInformationForm onCreateCheckoutSession={onCreateCheckoutSession} isPending={isPending}/>
            </DialogContent>
        </Dialog>
    )
}
export default CheckoutUserInformationDialog