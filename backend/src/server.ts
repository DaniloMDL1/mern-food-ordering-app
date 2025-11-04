import "dotenv/config"
import express, { Request, Response } from "express"
import cookieParser from "cookie-parser"
import path from "path"
import { v2 as cloudinary } from "cloudinary"
import connectMongoDB from "./config/db"
import { errorHandler, notFound } from "./middleware/errorMiddleware"
import userRoutes from "./routes/userRoutes"
import restaurantRoutes from "./routes/restaurantRoutes"
import orderRoutes from "./routes/orderRoutes"

const app = express()

app.use("/api/orders/checkout/webhook", express.raw({ type: "*/*" }))

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))
app.use(cookieParser())

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// routes
app.use("/api/users", userRoutes)
app.use("/api/restaurants", restaurantRoutes)
app.use("/api/orders", orderRoutes)

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../../frontend/dist")))

    app.use("*", (req: Request, res: Response) => {
        res.sendFile(path.resolve(__dirname, "../../frontend", "dist", "index.html"))
    })
}

// middleware
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 6001
connectMongoDB()

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})