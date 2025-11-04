import { Checkbox } from "@/components/ui/checkbox"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { CUISINES } from "@/utils/cuisines"
import { useFormContext } from "react-hook-form"

const CuisinesSection = () => {
    const { control } = useFormContext()

    return (
        <div>
            <div className="mb-4">
                <h1 className="text-xl font-medium">Cuisines</h1>
                <FormDescription>Select cuisines for your restaurant</FormDescription>
            </div>

            <div>
                <FormField 
                    control={control}
                    name="cuisines"
                    render={({ field }) => (
                        <FormItem>
                            <div className="grid grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 gap-2">
                                {CUISINES.map((cuisine, index) => (
                                    <FormItem key={index} className="flex flex-row items-center gap-2">
                                        <FormControl>
                                            <Checkbox 
                                                checked={field.value.includes(cuisine)}
                                                onCheckedChange={(checked) => {
                                                    return checked ? field.onChange([...field.value, cuisine]) : field.onChange(field.value.filter((c: string) => c !== cuisine))
                                                }}
                                                className="data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500"
                                            />
                                        </FormControl>
                                        <FormLabel className="text-sm font-normal">{cuisine}</FormLabel>
                                    </FormItem>
                                ))}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

            </div>
        </div>
    )
}
export default CuisinesSection