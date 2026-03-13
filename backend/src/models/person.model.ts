export interface Person {
    id: number;
    firstName: string;
    lastName: string;
    otherName?: string;
    phoneNumber: string;
    dateOfBirth: Date;
    address_id: number;
}

export interface CreatePersonDto {
    firstName: string;
    lastName: string;
    otherName?: string;
    phoneNumber: string;
    dateOfBirth: Date;
    address_id: number;
}