import { Link } from "react-router"
import { useAuthContext } from "@/context/AuthContext"
import { CircleUser } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { toast } from "react-toastify"

const Header = () => {

    const { userInfo, logout } = useAuthContext()

    const { mutate: logoutUser, isPending: isLogoutUserPending } = useMutation<{ message: string }, AxiosError<{ message: string }>, void>({
        mutationFn: async () => {
            const response = await axios.post("/api/users/logout")
            return response.data
        },
        onSuccess: (data) => {
            logout()
            toast.success(data.message)
        },
        onError: (error) => {
            toast.error(error.response?.data?.message)
        }
    })

    return (
        <div className="sticky top-0 z-50 w-full bg-background border-b-2 border-b-orange-500">
            <div className="max-w-6xl mx-auto px-3 py-2 flex justify-between gap-4 h-21">
                <Link className="flex items-center cursor-pointer" to={"/"}>
                    <img src="/logo.png" className="h-14"/>
                    <span className="text-orange-500 font-bold text-xl max-md:text-lg -ml-4">FDel App</span>
                </Link>

                <div className="flex items-center gap-4">
                    {userInfo ? (
                        <>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild className="cursor-pointer">
                                    <span className="flex items-center gap-1">
                                        <CircleUser className="text-orange-500 size-6"/>
                                        <span>{userInfo.name}</span>
                                    </span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Link to={"/update-profile"}>
                                            Update Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Link to={"/manage-restaurant"}>
                                            Manage Restaurant
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Link to={"/my-orders"}>
                                            My Orders
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Button
                                            onClick={() => logoutUser()} 
                                            disabled={isLogoutUserPending}
                                            className="bg-orange-500 hover:bg-orange-500/90 w-full cursor-pointer"
                                        >
                                            Log Out
                                        </Button>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <>
                            <Link className="hover:text-orange-500 hover:underline transition-colors" to={"/register"}>
                                Register
                            </Link>
                            <Link className="hover:text-orange-500 hover:underline transition-colors" to={"/login"}>
                                Log In
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
export default Header