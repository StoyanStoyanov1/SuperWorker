"use client";

import { useForm, Path } from "react-hook-form";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { cityService } from "@/services/city.service";
import FormWrapper from "@/components/common/FormWrapper";
import FormField from "@/components/common/FormField";

const addressSchema = z.object({
    street: z.string().min(2, "Min 2 characters").max(255, "Max 255 characters"),
    cityId: z.string().uuid("Please select a city"),
});

type AddressForm = z.infer<typeof addressSchema>;

interface AddressFormProps {
    onSubmit: (data: AddressForm) => void;
    isSubmitting: boolean;
}

export default function AddressForm({ onSubmit, isSubmitting }: AddressFormProps) {
    const { data: cities } = useQuery({
        queryKey: ["cities"],
        queryFn: () => cityService.getCities(),
    });

    const customResolver = async (values: unknown) => {
        const result = addressSchema.safeParse(values);
        if (result.success) {
            return { values: result.data, errors: {} };
        }
        const fieldErrors = result.error.flatten().fieldErrors as Record<string, string[] | undefined>;
        const errors: Record<string, { type: string; message: string }> = {};
        Object.keys(fieldErrors).forEach((key) => {
            const msg = fieldErrors[key]?.[0];
            if (msg) {
                errors[key] = { type: "validation", message: msg };
            }
        });
        return { values: {}, errors };
    };

    const form = useForm<AddressForm>({
        resolver: customResolver,
        defaultValues: {
            street: "",
            cityId: "",
        },
    });

    const { setFocus, handleSubmit } = form;

    const handleInvalid = (errs: unknown) => {
        if (errs && typeof errs === "object") {
            const keys = Object.keys(errs as Record<string, unknown>);
            const first = keys[0];
            if (first) {
                try { setFocus(first as unknown as Path<AddressForm>); } catch {}
            }
        }
    };

    return (
        <FormWrapper
            onSubmit={handleSubmit(onSubmit, handleInvalid)}
            buttonLabel="Use this address"
            isSubmitting={isSubmitting}
            className="space-y-4"
        >
            <FormField
                name="street"
                label="Street"
                placeholder="10 Vitosha blvd."
                control={form.control}
            />

            <div className="space-y-2">
                <label className="text-sm font-medium">City</label>
                <select
                    {...form.register("cityId")}
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                >
                    <option value="">Select a city</option>
                    {cities?.map((city) => (
                        <option key={city.id} value={city.id}>
                            {city.name} — {city.country.name}
                        </option>
                    ))}
                </select>
                {form.formState.errors.cityId && (
                    <p className="text-sm text-red-500">{form.formState.errors.cityId.message}</p>
                )}
            </div>
        </FormWrapper>
    );
}