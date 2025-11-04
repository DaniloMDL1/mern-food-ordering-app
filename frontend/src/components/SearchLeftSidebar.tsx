import { CUISINES } from "@/utils/cuisines"
import { ArrowDown, ArrowUp } from "lucide-react"
import { useState } from "react"
import { useSearchParams } from "react-router"

const SearchLeftSidebar = () => {
    const [showMore, setShowMore] = useState(false)

    const visibleCuisines = showMore ? CUISINES : CUISINES.slice(0, 10)

    const [searchParams, setSearchParams] = useSearchParams()

    const selectedCuisines = searchParams.get("selectedCuisines")?.split(",").filter(Boolean) || []

    const handleCuisineClick = (cuisine: string) => {
        let updatedSelectedCuisines 

        if(selectedCuisines.includes(cuisine)) {
            updatedSelectedCuisines = selectedCuisines.filter((c) => c !== cuisine)
        } else {
            updatedSelectedCuisines = [...selectedCuisines, cuisine]
        }

        const newParams = {
            ...Object.fromEntries(searchParams.entries()),
            selectedCuisines: updatedSelectedCuisines.join(","),
            page: "1"
        }

        setSearchParams(newParams)
    }

    const handleClearFilters = () => {
        const newParams = { ...Object.fromEntries(searchParams.entries()) }

        delete newParams.search
        delete newParams.sortBy
        delete newParams.selectedCuisines

        setSearchParams(newParams)
    }

    return (
        <div>
            <span onClick={handleClearFilters} className="text-orange-500 underline hover:text-orange-500/90 cursor-pointer">
                Clear Filters
            </span>

            <div className="mt-2">
                <h2 className="font-semibold">Filter by cuisines</h2>

                <div className="flex flex-col gap-2 mt-2">
                    {visibleCuisines.map((cuisine, index) => {
                        const isSelected = selectedCuisines.includes(cuisine)

                        return (
                            <button onClick={() => handleCuisineClick(cuisine)} key={index} className={`py-2 rounded-full border cursor-pointer ${isSelected ? "border-orange-500" : "border-slate-200"}`}>
                                {cuisine}
                            </button>
                        )
                    })}
                    <span onClick={() => setShowMore(!showMore)} className="flex items-center justify-center cursor-pointer text-orange-500">
                        {showMore ? (
                            <>
                                Show Less
                                <ArrowUp />
                            </>
                        ) : (
                            <>
                                Show More
                                <ArrowDown />
                            </>
                        )}
                        
                    </span>
                </div>
            </div>
        </div>
    )
}
export default SearchLeftSidebar