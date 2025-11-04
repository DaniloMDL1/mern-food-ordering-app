import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router"
import { useMutation } from "@tanstack/react-query"
import type { SafeUserType } from "@/types/user"
import axios, { AxiosError } from "axios"
import { useAuthContext } from "@/context/AuthContext"
import { toast } from "react-toastify"
import LoadingSpinner from "@/components/LoadingSpinner"

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email({ error: "Invalid email address" }),
    password: z.string().min(6, "Password must be at least 6 characters")
})

type FormDataType = z.infer<typeof formSchema>

const RegisterPage = () => {

    const form = useForm<FormDataType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: ""
        }
    })

    const navigate = useNavigate()

    const { setCredentials } = useAuthContext()

    const { mutate: registerUser, isPending } = useMutation<SafeUserType, AxiosError<{ message: string }>, FormDataType>({
        mutationFn: async (formData) => {
            const response = await axios.post("/api/users/register", formData)
            return response.data
        },
        onSuccess: (data) => {
            setCredentials(data)
            navigate("/")
        },
        onError: (error) => {
            toast.error(error.response?.data?.message)
        }
    })

    const onRegisterUser = (formData: FormDataType) => {
        registerUser(formData)
    }

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-160px)]">
            <div className="bg-white max-w-lg shadow-lg w-full p-4 space-y-4 rounded-lg">
                <h1 className="font-bold text-orange-500 text-lg">Register</h1>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onRegisterUser)} autoComplete="off" className="space-y-4 mb-2">
                        <FormField 
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
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
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email Address" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Password" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={isPending} className="bg-orange-500 w-full hover:bg-orange-500/90 cursor-pointer">
                            {isPending ? <LoadingSpinner /> : "Register"}
                        </Button>
                    </form>
                </Form>

                <Link className="hover:text-orange-500 hover:underline transition-colors" to={"/login"}>
                    Already have an account? Log In
                </Link>
            </div>
        </div>
    )
}
export default RegisterPage