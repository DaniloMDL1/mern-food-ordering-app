import mongoose, { Document } from "mongoose"
import bcrypt from "bcrypt"

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId,
    name: string,
    email: string,
    password: string,
    country?: string,
    city?: string,
    address?: string,
    createdAt: Date,
    updatedAt: Date,
    matchPassword: (enteredPassword: string) => Promise<boolean>
}

const userSchema = new mongoose.Schema<IUser>(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        country: {
            type: String
        },
        city: {
            type: String
        },
        address: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

userSchema.pre<IUser>("save", async function (next) {
    if(!this.isModified("password")) {
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model("User", userSchema)

export default User