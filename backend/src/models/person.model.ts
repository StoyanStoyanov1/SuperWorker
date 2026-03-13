export interface Person {
    id: number;
    firstName: string;
    lastName: string;
    anotherName?: string;
    phone: string;
    dateOfBirth: Date;
    address_id: number;
}

export interface CreatePersonDto {
    firstName: string;
    lastName: string;
    anotherName?: string;
    phone: string;
    dateOfBirth: Date;
    address_id: number;
}