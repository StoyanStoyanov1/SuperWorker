"use client";

import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const CURRENCIES = [
    { value: "EUR", symbol: "€" },
    { value: "USD", symbol: "$" },
];

interface PriceFieldProps<T extends FieldValues> {
    name: Path<T>;
    currencyName: Path<T>;
    label: string;
    control: Control<T>;
}

export default function PriceField<T extends FieldValues>({
    name,
    currencyName,
    label,
    control,
}: PriceFieldProps<T>) {
    return (
        <div className="space-y-2">
            <Controller
                name={name}
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>{label}</FieldLabel>
                        <div className="flex gap-2">
                            <Controller
                                name={currencyName}
                                control={control}
                                render={({ field: currencyField }) => (
                                    <select
                                        {...currencyField}
                                        className="border rounded-lg px-2 text-sm bg-white cursor-pointer"
                                    >
                                        {CURRENCIES.map((c) => (
                                            <option key={c.value} value={c.value}>
                                                {c.symbol} {c.value}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            />
                            <Input
                                className="flex-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                {...field}
                                type="number"
                                min="0"
                                placeholder="0.00"
                                onKeyDown={(e) => {
                                if (
                                    e.key === "ArrowUp" ||
                                    e.key === "ArrowDown" ||
                                    (e.key.length === 1 && !/[\d.]/.test(e.key) && !e.ctrlKey && !e.metaKey)
                                ) {
                                    e.preventDefault();
                                }
                            }}
                                onWheel={(e) => e.currentTarget.blur()}
                                onBlur={(e) => {
                                    const value = parseFloat(e.target.value);
                                    const formatted = isNaN(value) ? "0.00" : value.toFixed(2);
                                    field.onChange(parseFloat(formatted));
                                    e.target.value = formatted;
                                }}
                            />
                        </div>
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />
        </div>
    );
}