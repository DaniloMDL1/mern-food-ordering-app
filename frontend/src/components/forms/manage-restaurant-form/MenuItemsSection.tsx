import { Button } from "@/components/ui/button"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { useFieldArray, useFormContext } from "react-hook-form"

const MenuItemsSection = () => {
    const { control } = useFormContext()

    const { fields, append, remove } = useFieldArray({
        control,
        name: "menuItems"
    })

    return (
        <div>
            <div className="mb-4">
                <h1 className="text-xl font-medium">Menu Items</h1>
                <FormDescription>
                    Enter the dishes your restaurant offers. Each item should have a name and a price
                </FormDescription>
            </div>

            <div>
                <FormField 
                    control={control}
                    name="menuItems"
                    render={({ }) => (
                        <FormItem className="flex flex-col gap-4">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex gap-4 items-end">
                                    <FormField 
                                        control={control}
                                        name={`menuItems.${index}.name`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name <FormMessage /></FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Name" {...field}/>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField 
                                        control={control}
                                        name={`menuItems.${index}.price`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Price <FormMessage /></FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Price" {...field}/>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="button" onClick={() => remove(index)} className="bg-red-700 hover:bg-red-700/90 cursor-pointer">
                                        Remove
                                    </Button>
                                </div>
                            ))}
                            <FormMessage />
                            <Button type="button" onClick={() => append({ name: "", price: 0 })} className="self-start cursor-pointer bg-gray-600 hover:bg-gray-600/90">
                                Add <Plus />
                            </Button>
                        </FormItem>
                    )}
                />

            </div>
        </div>
    )
}
export default MenuItemsSection