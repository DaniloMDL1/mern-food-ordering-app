import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useFormContext } from "react-hook-form"

const DetailsSection = () => {
    const { control } = useFormContext()

    return (
        <div>
            <div className="mb-4">
                <h1 className="text-xl font-medium">Details</h1>
                <FormDescription>Enter the details of your restaurant</FormDescription>
            </div>

            <div className="space-y-4">

                <div className="flex gap-4 max-md:flex-col">
                    <FormField 
                        control={control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Name" {...field}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input placeholder="Description" {...field}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                
                <div className="flex gap-4 max-md:flex-col">
                    <FormField 
                        control={control}
                        name="country"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Country</FormLabel>
                                <FormControl>
                                    <Input placeholder="Country" {...field}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={control}
                        name="city"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                    <Input placeholder="City" {...field}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                
                <div className="flex gap-4">
                    <FormField 
                        control={control}
                        name="deliveryFee"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Delivery Fee</FormLabel>
                                <FormControl>
                                    <Input placeholder="Delivery Fee" {...field}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={control}
                        name="estimatedDeliveryTime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Estimated Delivery Time</FormLabel>
                                <FormControl>
                                    <Input placeholder="Estimated Delivery Time" {...field}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                </div>
                
            </div>
        </div>
    )
}
export default DetailsSection