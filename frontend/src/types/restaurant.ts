export type MenuItemType = {
    _id: string,
    name: string,
    price: number
}

export type RestaurantType = {
    _id: string,
    owner: string,
    name: string,
    description: string,
    country: string,
    city: string,
    cuisines: string[],
    menuItems: MenuItemType[],
    image?: string,
    deliveryFee: number,
    estimatedDeliveryTime: number,
    createdAt: Date,
    updatedAt: Date
}

export type GetRestaurantsType = {
    restaurants: RestaurantType[],
    pagination: {
        totalRestaurants: number,
        totalPages: number,
        page: number
    }
}