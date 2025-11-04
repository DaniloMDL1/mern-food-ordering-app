import type { RestaurantType } from "@/types/restaurant"
import { Banknote, Clock } from "lucide-react"
import { Link } from "react-router"

type Props = {
    restaurant: RestaurantType
}

const RestaurantItem = ({ restaurant }: Props) => {
    return (
        <div className="flex">
            <div className="flex gap-2 flex-1 max-md:flex-col">
                <div className="w-3/5 max-md:w-full rounded-lg overflow-hidden shrink-0">
                    <img src={restaurant.image || "https://placehold.co/600x400"} className="w-full h-full object-cover"/>
                </div>

                <div className="flex max-md:items-center max-md:justify-between pb-2">
                    <div className="md:flex md:flex-col">
                        <h2 className="font-semibold text-lg">{restaurant.name}</h2>
                        <div className="">
                            {restaurant.cuisines.map((cuisine, index) => (
                                <span key={index} className="ml-1 wrap-break-word">• {cuisine}</span>
                            ))}
                        </div>

                        <Link className="text-orange-500 hover:text-orange-500/90 underline mt-auto" to={`/restaurants/${restaurant._id}`}>
                            View & Order
                        </Link>
                    </div>

                    <div className="flex-[0.2] md:hidden">
                        <div className="text-orange-500 flex items-center gap-1">
                            <Clock className="size-5"/>
                            <span>{restaurant.estimatedDeliveryTime}</span>
                        </div>
                        <div className="text-green-500 flex items-center gap-1">
                            <Banknote className="size-5"/>
                            <span>${(restaurant.deliveryFee / 100).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-[0.2] self-center max-md:hidden">
                <div className="text-orange-500 flex items-center gap-1">
                    <Clock className="size-5"/>
                    <span>{restaurant.estimatedDeliveryTime}</span>
                </div>
                <div className="text-green-500 flex items-center gap-1">
                    <Banknote className="size-5"/>
                    <span>${(restaurant.deliveryFee / 100).toFixed(2)}</span>
                </div>
            </div>
        </div>
    )
}
export default RestaurantItem