import { NextFunction, Request, Response } from "express"
import { body, param, validationResult } from "express-validator"

const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
    }

    next()
}

const validateRegister = [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").trim().isStrongPassword({ minLength: 6, minUppercase: 0, minSymbols: 0 }).withMessage("Password must be at least 6 characters"),
    validate
]

const validateLogin = [
    body("email").isEmail().withMessage("Invalid email address"),
    body("password").trim().notEmpty().withMessage("Password is required")
]

const validateUpdateUserProfile = [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Email address is required"),
    body("password").isStrongPassword({ minLength: 6, minUppercase: 0, minSymbols: 0 }).withMessage("Password must be at least 6 characters").optional({ values: "falsy" }),
    body("country").trim().optional(),
    body("city").trim().optional(),
    body("address").trim().optional(),
]

const validateCreateUpdateRestaurant = [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("description").trim().notEmpty().withMessage("Description is required"),
    body("country").trim().notEmpty().withMessage("Country is required"),
    body("city").trim().notEmpty().withMessage("City is required"),
    body("cuisines").isArray({ min: 1 }).withMessage("Cuisines array must have at least 1 item"),
    body("menuItems").isArray({ min: 1 }).withMessage("MenuItems array must have at least 1 item"),
    body("menuItems.*.name").trim().notEmpty().withMessage("Menu Items name is required"),
    body("menuItems.*.price").isFloat({ min: 0 }).withMessage("Menu Items price is required"),
    body("deliveryFee").isFloat({ min: 0 }).withMessage("Delivery fee is required"),
    body("estimatedDeliveryTime").isInt({ min: 0 }).withMessage("Estimated delivery time is required"),
    validate
]

const validateGetRestaurant = [
    param("restaurantId").isString().notEmpty().withMessage("Restaurant id param is required"),
    validate
]

export { validateRegister, validateLogin, validateUpdateUserProfile, validateCreateUpdateRestaurant, validateGetRestaurant }