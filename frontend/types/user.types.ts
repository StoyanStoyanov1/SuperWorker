export interface UserRole {
    id: string;
    name: "ADMIN" | "CUSTOMER" | "SELLER" | "MODERATOR";
}

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    isAktiv: boolean;
}