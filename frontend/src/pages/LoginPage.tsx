import LoadingSpinner from "@/components/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuthContext } from "@/context/AuthContext"
import type { SafeUserType } from "@/types/user"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import axios from "axios"
import { useForm } from "react-hook-form"
import { Link, useLocation, useNavigate } from "react-router"
import { toast } from "react-toastify"
import { z } from "zod"

const formSchema = z.object({
    email: z.email({ error: "Invalid email address" }),
    password: z.string().min(1, "Password is required")
})

type FormDataType = z.infer<typeof formSchema>

const LoginPage = () => {

    const form = useForm<FormDataType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const navigate = useNavigate()
    const location = useLocation()

    const { setCredentials } = useAuthContext()

    const { mutate: loginUser, isPending } = useMutation<SafeUserType, AxiosError<{ message: string }>, FormDataType>({
        mutationFn: async (formData) => {
            const response = await axios.post("/api/users/login", formData)
            return response.data
        },
        onSuccess: (data) => {
            setCredentials(data)

            const redirectTo = location.state?.from?.pathname || "/"
            navigate(redirectTo, { replace: true })
        },
        onError: (error) => {
            toast.error(error.response?.data?.message)
        }
    })

    const onLoginUser = (formData: FormDataType) => {
        loginUser(formData)
    }

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-160px)]">
            <div className="bg-white max-w-lg shadow-lg w-full p-4 space-y-4 rounded-lg">
                <h1 className="font-bold text-orange-500 text-lg">Log In</h1>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onLoginUser)} autoComplete="off" className="space-y-4 mb-2">
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
                            {isPending ? <LoadingSpinner /> : "Log In"}
                        </Button>
                    </form>
                </Form>

                <Link className="hover:text-orange-500 hover:underline transition-colors" to={"/register"}>
                    Don't have an account? Register
                </Link>
            </div>
        </div>
    )
}
export default LoginPage