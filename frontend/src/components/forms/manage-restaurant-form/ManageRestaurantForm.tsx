import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "../../ui/form"
import DetailsSection from "./DetailsSection"
import { Separator } from "@/components/ui/separator"
import CuisinesSection from "./CuisinesSection"
import MenuItemsSection from "./MenuItemsSection"
import RestaurantImageSection from "./RestaurantImageSection"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import type { RestaurantType } from "@/types/restaurant"
import type { AxiosError } from "axios"
import axios from "axios"
import { toast } from "react-toastify"
import LoadingSpinner from "@/components/LoadingSpinner"
import { useEffect } from "react"

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    country: z.string().min(1, "Country is required"),
    city: z.string().min(1, "City is required"),
    cuisines: z.array(z.string()).min(1, "You must select at least one cuisine"),
    menuItems: z.array(z.object({
        name: z.string().min(1, "Name is required"),
        price: z.coerce.number<number>({ error: "Price must be a number"}).gte(0, "Price must be a positive number")
    })).min(1, "You must include at least one menu item"),
    deliveryFee: z.coerce.number<number>({ error: "Delivery fee must be a number"}).gte(0, "Delivery fee must be a positive number"),
    estimatedDeliveryTime: z.coerce.number<number>({ error: "Estimated delivery time must be a number"}).gte(0, "Estimated delivery time must be a positive number"),
    imageFile: z.instanceof(File, { error: "Image file must be a valid file"}).optional(),
    image: z.string().optional()
})

type ManageRestaurantFormData = z.infer<typeof formSchema>

type Props = {
    restaurant?: RestaurantType
}

const ManageRestaurantForm = ({ restaurant }: Props) => {

    const form = useForm<ManageRestaurantFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            country: "",
            city: "",
            cuisines: [],
            menuItems: [{ name: "", price: 0 }],
            deliveryFee: 0,
            estimatedDeliveryTime: 0
        }
    })

    useEffect(() => {
        if(!restaurant) return

        const formattedMenuItems = restaurant.menuItems.map((menuItem) => ({
            ...menuItem,
            price: menuItem.price / 100
        }))

        const formattedDeliveryFee = restaurant.deliveryFee / 100

        form.reset({
            name: restaurant.name,
            description: restaurant.description,
            country: restaurant.country,
            city: restaurant.city,
            cuisines: restaurant.cuisines,
            menuItems: formattedMenuItems,
            deliveryFee: formattedDeliveryFee,
            estimatedDeliveryTime: restaurant.estimatedDeliveryTime,
            image: restaurant.image
        })

    }, [restaurant])

    const { mutate: createRestaurant, isPending: isCreateRestaurantPending } = useMutation<RestaurantType, AxiosError<{ message: string }>, FormData>({
        mutationFn: async (manageRestaurantFormData) => {
            const response = await axios.post("/api/restaurants/", manageRestaurantFormData)
            return response.data
        },
        onSuccess: () => {
            toast.success("Restaurant created successfully")
        },
        onError: (error) => {
            toast.error(error.response?.data?.message)
        }
    })

     const { mutate: updateRestaurant, isPending: isUpdateRestaurantPending } = useMutation<RestaurantType, AxiosError<{ message: string }>, FormData>({
        mutationFn: async (manageRestaurantFormData) => {
            const response = await axios.put("/api/restaurants/", manageRestaurantFormData)
            return response.data
        },
        onSuccess: () => {
            toast.success("Restaurant updated successfully")
        },
        onError: (error) => {
            toast.error(error.response?.data?.message)
        }
    })

    const onManageRestaurant = (manageRestaurantFormData: ManageRestaurantFormData) => {
        const formData = new FormData()

        formData.append("name", manageRestaurantFormData.name)
        formData.append("description", manageRestaurantFormData.description)
        formData.append("country", manageRestaurantFormData.country)
        formData.append("city", manageRestaurantFormData.city)

        manageRestaurantFormData.cuisines.forEach((cuisine, index) => {
            formData.append(`cuisines[${index}]`, cuisine)
        })

        manageRestaurantFormData.menuItems.forEach((menuItem, index) => {
            formData.append(`menuItems[${index}][name]`, menuItem.name)
            formData.append(`menuItems[${index}][price]`, (menuItem.price * 100).toString())
        })

        if(manageRestaurantFormData.imageFile) {
            formData.append("imageFile", manageRestaurantFormData.imageFile)
        }

        formData.append("deliveryFee", (manageRestaurantFormData.deliveryFee * 100).toString())
        formData.append("estimatedDeliveryTime", manageRestaurantFormData.estimatedDeliveryTime.toString())

        if(restaurant) {
            updateRestaurant(formData)
        } else {
            createRestaurant(formData)
        }
    }

    return (
        <div className="bg-gray-50 rounded-lg p-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onManageRestaurant)} autoComplete="off" className="space-y-8">
                    <DetailsSection />
                    <Separator />
                    <CuisinesSection />
                    <Separator />
                    <MenuItemsSection />
                    <Separator />
                    <RestaurantImageSection />
                    <Separator />

                    <Button type="submit" disabled={isCreateRestaurantPending || isUpdateRestaurantPending} className="bg-orange-500 hover:bg-orange-500/90 cursor-pointer">
                        {(isCreateRestaurantPending || isUpdateRestaurantPending) ? <LoadingSpinner /> : "Save"}
                    </Button>
                </form>
            </Form>
        </div>
    )
}
export default ManageRestaurantForm