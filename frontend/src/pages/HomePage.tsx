import SearchInput from "@/components/SearchInput"
import heroImage from "../assets/hero.png"
import landingImage from "../assets/landing.png"
import appDownloadImage from "../assets/appDownload.png"

const HomePage = () => {
    return (
        <div className="space-y-12">

            <div className="w-full md:h-[520px] rounded-lg overflow-hidden">
                <img src={heroImage} className="w-full  h-full object-cover"/>
            </div>

            <div className="bg-white shadow-lg rounded-lg max-w-3xl w-full mx-auto -mt-18 relative z-10 p-4 text-center space-y-6">
                <div className="">
                    <h2 className="text-orange-500 text-2xl font-bold max-md:text-lg">Find your new restaurant</h2>
                    <p className="text-muted-foreground max-md:text-xs">
                        Explore thousands of restaurants near you and discover delicious meals with ease.
                    </p>
                </div>

                <SearchInput />
            </div>

            <div className="flex gap-4 items-center max-w-4xl mx-auto max-md:flex-col">
                <div className="w-1/2 h-full rounded-lg overflow-hidden">
                    <img src={landingImage} className="w-full h-full object-cover"/>
                </div>

                <div className="text-center flex flex-col items-center">
                    <h2 className="text-xl font-bold max-md:text-lg">
                        Enjoy the Best Food, Delivered to Your Door
                    </h2>
                    <p className="mb-4 max-md:text-sm">
                        Browse menus, read reviews, and order from top restaurants around you — all in one app.
                    </p>

                    <div className="w-1/4">
                        <img src={appDownloadImage} className="w-full h-full object-cover"/>
                    </div>
                </div>
            </div>

        </div>
    )
}
export default HomePage