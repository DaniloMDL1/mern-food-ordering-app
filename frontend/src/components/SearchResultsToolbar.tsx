import { Link, useSearchParams } from "react-router"
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select"
import { SelectValue } from "@radix-ui/react-select"

type Props = {
    totalRestaurants: number,
    city: string,
    search: string
}

const SearchResultsToolbar = ({ totalRestaurants, city, search }: Props) => {
    const [searchParams, setSearchParams] = useSearchParams()

    const handleSortOptionChange = (value: string) => {
        const newParams = { ...Object.fromEntries(searchParams.entries()), sortBy: value }
        setSearchParams(newParams)
    }

    return (
        <div className="mt-4 px-2 flex max-md:flex-col md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                <span className="text-lg max-md:text-base font-semibold">{totalRestaurants} Restaurants found {search && `matching ${search}`} in {city}</span>
                <Link className="text-orange-500 underline hover:text-orange-500/90 max-md:text-sm" to={"/"}>Change Location</Link>
            </div>

            <Select value={searchParams.get("sortBy") || "newest"} onValueChange={(value) => handleSortOptionChange(value)}>
                <SelectTrigger className="max-md:w-full">
                    <SelectValue placeholder="Sort by"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="deliveryFee">Delivery Fee</SelectItem>
                    <SelectItem value="estimatedDeliveryTime">Delivery Time</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
export default SearchResultsToolbar