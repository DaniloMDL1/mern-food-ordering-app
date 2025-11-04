import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { Outlet } from "react-router"

const RootLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <div className="flex-1 container mx-auto p-4">
                <Outlet />
            </div>

            <Footer />
        </div>
    )
}
export default RootLayout