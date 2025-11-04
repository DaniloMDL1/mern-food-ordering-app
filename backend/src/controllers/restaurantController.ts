import { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import Restaurant from "../models/restaurantModel"
import { v2 as cloudinary } from "cloudinary"

const createRestaurant = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user._id

    const restaurant = await Restaurant.findOne({ owner: userId })
    if(restaurant) {
        res.status(400)
        throw new Error("User has already created restaurant")
    }

    let imageUrl: string | undefined
    if(req.file) {
        const image = req.file as Express.Multer.File
        const base64Image = Buffer.from(image.buffer).toString("base64")
        const dataUri = `data:${image.mimetype};base64,${base64Image}`

        const uploadedRestaurantImage = await cloudinary.uploader.upload(dataUri)

        imageUrl = uploadedRestaurantImage.secure_url
    }

    const newRestaurant = await Restaurant.create({
        owner: userId,
        name: req.body.name,
        description: req.body.description,
        country: req.body.country,
        city: req.body.city,
        cuisines: req.body.cuisines,
        menuItems: req.body.menuItems,
        image: imageUrl,
        deliveryFee: req.body.deliveryFee,
        estimatedDeliveryTime: req.body.estimatedDeliveryTime
    })

    if(newRestaurant) {
        res.status(201).json(newRestaurant)

    } else {
        res.status(400)
        throw new Error("Failed to create a restaurant")
    }
})

const getUserRestaurant = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user._id

    const restaurant = await Restaurant.findOne({ owner: userId })

    res.status(200).json(restaurant ?? undefined)
})

const updateRestaurant = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user._id

    const restaurant = await Restaurant.findOne({ owner: userId })
    if(!restaurant) {
        res.status(404)
        throw new Error("Restaurant not found")
    }

    if(req.file) {
        if(restaurant.image) {
            const publicId = restaurant.image.split("/").pop()?.split(".")[0]
            if(publicId) await cloudinary.uploader.destroy(publicId)
        }

        const image = req.file as Express.Multer.File
        const base64Image = Buffer.from(image.buffer).toString("base64")
        const dataUri = `data:${image.mimetype};base64,${base64Image}`

        const uploadedRestaurantImage = await cloudinary.uploader.upload(dataUri)

        restaurant.image = uploadedRestaurantImage.secure_url
    }

    restaurant.name = req.body.name || restaurant.name
    restaurant.description = req.body.description || restaurant.description
    restaurant.country = req.body.country || restaurant.country
    restaurant.city = req.body.city || restaurant.city
    restaurant.cuisines = req.body.cuisines || restaurant.cuisines
    restaurant.menuItems = req.body.menuItems || restaurant.menuItems
    restaurant.deliveryFee = req.body.deliveryFee || restaurant.deliveryFee
    restaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime || restaurant.estimatedDeliveryTime

    const updatedRestaurant = await restaurant.save()

    res.status(200).json(updatedRestaurant)
})

const getRestaurants = asyncHandler(async (req: Request, res: Response) => {
    const city = (req.query.city as string) || ""
    const search = (req.query.search as string) || ""
    const sortBy = (req.query.sortBy as string) || "newest"  
    const selectedCuisines = (req.query.selectedCuisines as string) || ""
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10

    let query: any = {}

    if(city) {
        query.city = new RegExp(city, "i")
    }

    if(search) {
        const searchRegex = new RegExp(search, "i")
        query.$or = [
            { name: searchRegex },
            { description: searchRegex },
            { cuisines: searchRegex }
        ]
    }

    if(selectedCuisines) {
        const selectedCuisinesArray = selectedCuisines.split(",")
        query.cuisines = { $all: selectedCuisinesArray }
    }

    let sort: any = {}

    if(sortBy) {
        switch(sortBy) {
            case "newest":
                sort = { updatedAt: -1 }
                break
            case "oldest":
                sort = { updatedAt: 1 }
                break
            case "deliveryFee":
                sort = { deliveryFee: 1 }
                break
            case "estimatedDeliveryTime":
                sort = { estimatedDeliveryTime: 1 }
                break   
        }
    }

    const totalRestaurants = await Restaurant.countDocuments(query)
    const restaurants = await Restaurant.find(query).skip((page - 1) * limit).limit(limit).sort(sort).lean()

    res.status(200).json({
        restaurants,
        pagination: {
            totalRestaurants,
            totalPages: Math.ceil(totalRestaurants / limit),
            page
        }
    })
})

const getRestaurant = asyncHandler(async (req: Request, res: Response) => {
    const { restaurantId } = req.params

    const restaurant = await Restaurant.findById(restaurantId)
    if(!restaurant) {
        res.status(404)
        throw new Error("Restaurant not found")
    }

    res.status(200).json(restaurant)
})

export { createRestaurant, getUserRestaurant, updateRestaurant, getRestaurants, getRestaurant }