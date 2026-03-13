
export enum Role {
    USER = "USER",
    ADMIN = "ADMIN",
    SUPER_ADMIN = "SUPER_ADMIN"
}

export interface User {
    id: number;
    email: string;
    role: Role;
    person_id: number;
    isVerified: boolean;
    verifiedAt?: Date;
    passwordHash: string;
}

export interface CreateUserDto {
    email: string;
    password: string;
    person_id: number;
    role: Role;
}