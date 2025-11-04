import { useAuthContext } from "@/context/AuthContext"
import { Navigate, Outlet } from "react-router"

const ProtectedRoute = () => {
    const { userInfo } = useAuthContext()

    return userInfo ? <Outlet /> : <Navigate to={"/login"} replace/>
}
export default ProtectedRoute