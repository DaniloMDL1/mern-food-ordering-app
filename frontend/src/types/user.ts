export type UserType = {
    _id: string,
    name: string,
    email: string,
    password: string,
    country?: string,
    city?: string,
    address?: string,
    createdAt: Date,
    updatedAt: Date
}

export type SafeUserType = Omit<UserType, "password">