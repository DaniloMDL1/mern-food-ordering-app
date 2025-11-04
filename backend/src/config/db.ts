import mongoose from "mongoose"

const connectMongoDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI as string)

        console.log(`MongoDB connected: ${conn.connection.host}`)

    } catch(error) {
        console.log(`Error: ${error}`)
        process.exit(1)
    }
}

export default connectMongoDB