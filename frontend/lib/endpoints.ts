export const ENDPOINTS = {
    auth: {
        register: "/auth/register",
        login: "/auth/login",
        logout: "/auth/logout",
        refresh: "/auth/refresh",
    },
    users: {
        me: "/users/me",
        addresses: "/users/me/addresses",
    },
    products: "/products",
    categories: {
        all: "/categories/all",
        base: "/categories",
    },
    cart: {
        base: "/cart",
        items: "/cart/items",
    },
    orders: "/orders",
    cities: "/cities",
    countries: "/cities/countries/all",
};