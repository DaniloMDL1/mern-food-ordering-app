import mongoose from "mongoose"

const orderSchema = new mongoose.Schema(
    {
        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        userInformation: {
            name: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            country: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            address: {
                type: String,
                required: true
            }
        },
        cartItems: [
            {
                menuItemId: {
                    type: String,
                    required: true
                },
                name: {
                    type: String,
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ],
        totalAmount: {
            type: Number,
        },
        status: {
            type: String,
            enum: ["placed", "paid", "preparing", "outForDelivery", "delivered"]
        }
    },
    {
        timestamps: true
    }
)

const Order = mongoose.model("Order", orderSchema)

export default Order