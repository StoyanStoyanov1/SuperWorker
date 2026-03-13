export interface Address {
    id: number;
    street: string;
    number: string;
    zipCode: string;
    city: string;
    county: string;
}

export interface CreateAddressDto {
    street: string;
    number: string;
    zipCode: string;
    city: string;
    county: string;
}