import { createBrowserRouter, createRoutesFromElements, Route } from "react-router"
import { RouterProvider } from "react-router/dom"
import HomePage from "./pages/HomePage"
import RegisterPage from "./pages/RegisterPage"
import LoginPage from "./pages/LoginPage"
import RootLayout from "./layouts/RootLayout"
import { ToastContainer } from "react-toastify"
import UpdateProfilePage from "./pages/UpdateProfilePage"
import ProtectedRoute from "./components/ProtectedRoute"
import ManageRestaurantPage from "./pages/ManageRestaurantPage"
import SearchRestaurantsPage from "./pages/SearchRestaurantsPage"
import RestaurantDetailsPage from "./pages/RestaurantDetailsPage"
import MyOrdersPage from "./pages/MyOrdersPage"

const App = () => {

    const router = createBrowserRouter(
        createRoutesFromElements(
            <>
                <Route element={<RootLayout />}>
                    <Route path="/" element={<HomePage />}/>
                    <Route path="/restaurants" element={<SearchRestaurantsPage />}/>
                    <Route path="/restaurants/:restaurantId" element={<RestaurantDetailsPage />}/>
                    <Route path="/register" element={<RegisterPage />}/>
                    <Route path="/login" element={<LoginPage />}/>
                    <Route element={<ProtectedRoute />}>
                        <Route path="/update-profile" element={<UpdateProfilePage />}/>
                        <Route path="/manage-restaurant" element={<ManageRestaurantPage />}/>
                        <Route path="/my-orders" element={<MyOrdersPage />}/>
                    </Route>
                </Route>
            </>
        )
    )

    return (
        <>
            <RouterProvider router={router}/>
            <ToastContainer autoClose={3000}/>
        </>
    )
}
export default App