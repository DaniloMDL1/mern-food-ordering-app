import mongoose, { InferSchemaType } from "mongoose"

const menuItemsSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            default: () => new mongoose.Types.ObjectId()
        },
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }
)

export type MenuItemSchemaType = InferSchemaType<typeof menuItemsSchema>

const restaurantSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        name: {
            type: String,
            required: true
        },
        description: {
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
        cuisines: {
            type: [String]
        },
        menuItems: [menuItemsSchema],
        image: {
            type: String
        },
        deliveryFee: {
            type: Number,
            required: true
        },
        estimatedDeliveryTime: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const Restaurant = mongoose.model("Restaurant", restaurantSchema)

export default Restaurant