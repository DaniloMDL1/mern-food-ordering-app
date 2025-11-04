import LoadingSpinner from "@/components/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuthContext } from "@/context/AuthContext"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    country: z.string().min(1, "Country is required"),
    city: z.string().min(1, "City is required"),
    address: z.string().min(1, "Address is required")
})

export type CheckoutUserInformationFormDataType = z.infer<typeof formSchema>

type Props = {
    onCreateCheckoutSession: (formData: CheckoutUserInformationFormDataType) => void,
    isPending: boolean
}

const CheckoutUserInformationForm = ({ onCreateCheckoutSession, isPending }: Props) => {
    const { userInfo } = useAuthContext()

    const form = useForm<CheckoutUserInformationFormDataType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            country: "",
            city: "",
            address: ""
        }
    })

    useEffect(() => {
        if(userInfo) {
            form.reset({
                name: userInfo.name,
                email: userInfo.email,
                country: userInfo.country,
                city: userInfo.city,
                address: userInfo.address
            })
        }

    }, [userInfo])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onCreateCheckoutSession)} autoComplete="off" className="space-y-4">
                <div className="flex gap-4 max-md:flex-col">
                    <FormField 
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Name" {...field}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="Email Address" {...field}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex flex-col gap-4">
                    <FormField 
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Country</FormLabel>
                                <FormControl>
                                    <Input placeholder="Country" {...field}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                    <Input placeholder="City" {...field}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="Address" {...field}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" disabled={isPending} className="bg-orange-500 hover:bg-orange-500/90 cursor-pointer w-20">
                    {isPending ? <LoadingSpinner /> : "Checkout"}
                </Button>
            </form>
        </Form>
    )
}
export default CheckoutUserInformationForm