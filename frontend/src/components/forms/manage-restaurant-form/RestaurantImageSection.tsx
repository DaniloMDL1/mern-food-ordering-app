import { FormControl, FormDescription, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"

const RestaurantImageSection = () => {
    const { control, watch } = useFormContext()
    
    const imageFile = watch("imageFile")
    const image = watch("image")

    const [previewImage, setPreviewImage] = useState<string | null>(null)

    useEffect(() => {
        if(imageFile) {
            const newUrl = URL.createObjectURL(imageFile)

            setPreviewImage(newUrl)
        }
    }, [imageFile])


    return (
        <div>
            <div className="mb-4">
                <h1 className="text-xl font-medium">Restaurant Image</h1>
                <FormDescription>
                    Select an image for your restaurant
                </FormDescription>
            </div>

            <div className="space-y-2">
                {(previewImage || image) && (
                    <div className="w-2/4 rounded-lg overflow-hidden">
                        <img src={previewImage || image} className="w-full h-full object-cover"/>
                    </div>
                )}

                <FormField 
                    control={control}
                    name="imageFile"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input 
                                    type="file"
                                    accept=".jpg, .jpeg, .png"
                                    onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </div>

        </div>
    )
}
export default RestaurantImageSection