import { SearchIcon } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "./ui/input-group"
import { useEffect, useState, type FormEvent } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router"

const SearchInput = () => {
    const [searchTerm, setSearchTerm] = useState("")
    
    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
        setSearchTerm(searchParams.get("search") || "")
    }, [searchParams])

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(pathname === "/") {
            navigate(`/restaurants?city=${encodeURIComponent(searchTerm)}`)

        } else {
            const newParams = { ...Object.fromEntries(searchParams.entries()), search: searchTerm }
            setSearchParams(newParams)
        }
    }

    const getPlaceholder = () => {
        if(pathname === "/") {
            return "Search by city..."
        } else {
            return "Search by restaurant name, description or cuisine"
        }
    }

    return (
        <form onSubmit={handleSearch}>
            <InputGroup className="py-6 rounded-full">
                <InputGroupInput 
                    placeholder={getPlaceholder()} 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <InputGroupAddon>
                    <SearchIcon className="size-5 text-orange-500"/>
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                    <InputGroupButton type="submit" variant={"default"} className="bg-orange-500 hover:bg-orange-500/90 rounded-full py-4 cursor-pointer">
                        Search
                    </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
        </form>
    )
}
export default SearchInput