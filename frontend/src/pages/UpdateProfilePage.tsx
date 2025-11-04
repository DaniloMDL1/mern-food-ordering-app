import LoadingSpinner from "@/components/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuthContext } from "@/context/AuthContext"
import type { SafeUserType } from "@/types/user"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { z } from "zod"

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email({ error: "Invalid email address" }),
    password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
    country: z.string().optional(),
    city: z.string().optional(),
    address: z.string().optional()
})

type UpdateProfileFormDataType = z.infer<typeof formSchema>

const UpdateProfilePage = () => {
    const { userInfo, setCredentials } = useAuthContext()

    const form = useForm<UpdateProfileFormDataType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
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
                password: "",
                country: userInfo.country,
                city: userInfo.city,
                address: userInfo.address
            })
        }

    }, [userInfo])


    const { mutate: updateUserProfile, isPending } = useMutation<SafeUserType, AxiosError<{ message: string }>, UpdateProfileFormDataType>({
        mutationFn: async (updateProfileFormData) => {
            const response = await axios.put("/api/users/profile", updateProfileFormData)
            return response.data
        },
        onSuccess: (data) => {
            setCredentials(data)
            toast.success("Profile updated successfully")
        },
        onError: (error) => {
            toast.error(error.response?.data?.message)
        }
    })

    const onUpdateUserProfile = (updateProfileFormData: UpdateProfileFormDataType) => {
        updateUserProfile(updateProfileFormData)
    }

    return (
        <div className="bg-gray-50 rounded-lg">
            <div className="p-4">
                <h1 className="text-lg font-semibold">Update Profile</h1>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onUpdateUserProfile)} autoComplete="off" className="space-y-4 mt-4">
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

                        <FormField 
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="md:max-w-[225px]">
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Password" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-4 max-md:flex-col">
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

                        <Button type="submit" disabled={isPending} className="w-[120px] bg-orange-500 hover:bg-orange-500/90 cursor-pointer">
                            {isPending ? <LoadingSpinner /> : "Update Profile"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}
export default UpdateProfilePage