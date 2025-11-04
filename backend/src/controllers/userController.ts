import { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import User from "../models/userModel"
import generateToken from "../utils/generateToken"

const register = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body

    const user = await User.findOne({ email })
    if(user) {
        res.status(400)
        throw new Error("Email address is already in use")
    }

    const newUser = await User.create({
        name,
        email,
        password
    })

    if(newUser) {
        generateToken(res, newUser._id.toString())

        const newUserObj = newUser.toObject()

        const { password: _, ...userInfo } = newUserObj

        res.status(201).json(userInfo)

    } else {
        res.status(400)
        throw new Error("Failed to create a user")
    }

})

const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if(user && (await user.matchPassword(password))) {
        generateToken(res, user._id.toString())

        const userObj = user.toObject()

        const { password: _, ...userInfo } = userObj

        res.status(200).json(userInfo)

    } else {
        res.status(400)
        throw new Error("Invalid email address or password")
    }
    
})

const logout = asyncHandler(async (req: Request, res: Response) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0)
    })

    res.status(200).json({ message: "Logged out successfully" })
})

const updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, country, city, address } = req.body
    const userId = req.user._id

    const user = await User.findById(userId)
    if(!user) {
        res.status(404)
        throw new Error("User not found")
    }

    if(email && email !== user.email) {
        const emailExists = await User.findOne({ email })
        if(emailExists) {
            res.status(400)
            throw new Error("Email address is already in use")
        }

        user.email = email
    }

    user.name = name || user.name
    user.password = password || user.password
    user.country = country || user.country
    user.city = city || user.city
    user.address = address || user.address

    const updatedUser = await user.save()

    const updatedUserObj = updatedUser.toObject()

    const { password: _, ...userInfo } = updatedUserObj

    res.status(200).json(userInfo)
})

export { register, login, logout, updateUserProfile }