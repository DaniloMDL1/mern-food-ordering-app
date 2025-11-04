import LoadingSpinner from "@/components/LoadingSpinner"
import RestaurantItem from "@/components/RestaurantItem"
import SearchInput from "@/components/SearchInput"
import SearchLeftSidebar from "@/components/SearchLeftSidebar"
import SearchResultsToolbar from "@/components/SearchResultsToolbar"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import type { GetRestaurantsType } from "@/types/restaurant"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { AlertCircleIcon } from "lucide-react"
import { useSearchParams } from "react-router"

const fetchRestaurants = async (params: any = {}): Promise<GetRestaurantsType> => {
    const queryString = new URLSearchParams(params).toString()

    const response = await axios.get(`/api/restaurants?${queryString}`)
    return response.data
}

const SearchRestaurantsPage = () => {

    const [searchParams, setSearchParams] = useSearchParams()

    const city = searchParams.get("city") || ""
    const page = Number(searchParams.get("page")) || 1
    const search = searchParams.get("search") || ""
    const sortBy = searchParams.get("sortBy") || "newest"
    const selectedCuisines = searchParams.get("selectedCuisines") || ""

    const { data, isPending, isError } = useQuery({
        queryKey: ["restaurants", city, page, search, sortBy, selectedCuisines],
        queryFn: () => fetchRestaurants({ city, page, search, sortBy, selectedCuisines })
    })

    const handlePageChange = (page: number) => {
        const newParams = { ...Object.fromEntries(searchParams.entries()), page: page.toString() }
        setSearchParams(newParams)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    return (
        <div>
            <div className="flex gap-4 max-md:flex-col">
                <div className="flex-[0.2]">
                    <SearchLeftSidebar />
                </div>

                <div className="flex-1">
                    <SearchInput />

                    <SearchResultsToolbar 
                        totalRestaurants={data?.pagination.totalRestaurants || 0} 
                        city={city}
                        search={search}
                    />

                    {isPending && (
                        <div className="flex justify-center mt-4">
                            <LoadingSpinner color="text-orange-500" size="size-8"/>
                        </div>
                    )}

                    {isError && (
                        <div className="flex justify-center mt-4">
                            <div>
                                <Alert variant={"destructive"}>
                                    <AlertCircleIcon />
                                    <AlertTitle>Error fetching restaurants data</AlertTitle>
                                </Alert>
                            </div>
                        </div>
                    )}

                    {!isPending && !isError && (
                        <div>

                            {data.restaurants && data.restaurants.length > 0 && (
                                <>
                                    <div className="mt-2">

                                        <div className="flex flex-col gap-4 mb-4">
                                            {data.restaurants.map((restaurant) => (
                                                <RestaurantItem key={restaurant._id} restaurant={restaurant}/>
                                            ))}
                                        </div>

                                        {data.pagination.totalPages > 1 && (
                                            <Pagination>
                                                <PaginationContent>
                                                    <PaginationItem>
                                                        <PaginationPrevious 
                                                            className="cursor-pointer"
                                                            onClick={() => page > 1 && handlePageChange(page - 1)}
                                                            isActive={page > 1}
                                                        />
                                                    </PaginationItem>

                                                    {Array.from({ length: data.pagination.totalPages }).map((_, index) => (
                                                        <PaginationItem key={index}>
                                                            <PaginationLink
                                                                className="cursor-pointer" 
                                                                onClick={() => handlePageChange(index + 1)}
                                                                isActive={page === index + 1}
                                                            >
                                                                {index + 1}
                                                            </PaginationLink>
                                                        </PaginationItem>
                                                    ))}

                                                    <PaginationItem>
                                                        <PaginationNext 
                                                            className="cursor-pointer"
                                                            onClick={() => page < data.pagination.totalPages && handlePageChange(page + 1)}
                                                            isActive={page < data.pagination.totalPages}
                                                        />
                                                    </PaginationItem>
                                                </PaginationContent>
                                            </Pagination>
                                        )}
                                        
                                    </div>
                                </>
                            )}

                        </div>
                    )}




                </div>
            </div>
        </div>
    )
}
export default SearchRestaurantsPage