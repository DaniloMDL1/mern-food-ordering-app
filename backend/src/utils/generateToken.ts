import { Response } from "express"
import jwt from "jsonwebtoken"

const generateToken = (res: Response, userId: string) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
        expiresIn: "6d"
    })

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 6 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV !== "development"
    })
}

export default generateToken