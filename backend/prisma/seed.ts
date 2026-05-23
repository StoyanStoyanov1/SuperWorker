import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const existingAdmin = await prisma.user.findFirst({
        where: { role: { name: "ADMIN" } },
    });

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash("Admin1234!", 10);
        const admin = await prisma.user.create({
            data: {
                email: "admin@e-commerce.com",
                password: hashedPassword,
                isAktiv: true,
                profile: {
                    create: {
                        firstName: "Admin",
                        lastName: "User",
                        phoneNumber: "0888000000",
                        birthDate: new Date("1990-01-01"),
                    },
                },
                role: {
                    create: {
                        name: "ADMIN",
                    },
                },
            },
        });
        console.log("Admin created:", admin.email);
    }

    const existingBulgaria = await prisma.country.findFirst({
        where: { name: "Bulgaria" },
    });

    if (!existingBulgaria) {
        const bulgaria = await prisma.country.create({
            data: { name: "Bulgaria" },
        });

        await prisma.city.createMany({
            data: [
                { name: "Sofia", postCode: "1000", countryId: bulgaria.id },
                { name: "Plovdiv", postCode: "4000", countryId: bulgaria.id },
                { name: "Varna", postCode: "9000", countryId: bulgaria.id },
                { name: "Burgas", postCode: "8000", countryId: bulgaria.id },
                { name: "Ruse", postCode: "7000", countryId: bulgaria.id },
                { name: "Stara Zagora", postCode: "6000", countryId: bulgaria.id },
                { name: "Pleven", postCode: "5800", countryId: bulgaria.id },
                { name: "Sliven", postCode: "8800", countryId: bulgaria.id },
                { name: "Dobrich", postCode: "9300", countryId: bulgaria.id },
                { name: "Shumen", postCode: "9700", countryId: bulgaria.id },
                { name: "Pernik", postCode: "2300", countryId: bulgaria.id },
                { name: "Haskovo", postCode: "6300", countryId: bulgaria.id },
                { name: "Yambol", postCode: "8600", countryId: bulgaria.id },
                { name: "Pazardzhik", postCode: "4400", countryId: bulgaria.id },
                { name: "Blagoevgrad", postCode: "2700", countryId: bulgaria.id },
                { name: "Veliko Tarnovo", postCode: "5000", countryId: bulgaria.id },
                { name: "Vratsa", postCode: "3000", countryId: bulgaria.id },
                { name: "Gabrovo", postCode: "5300", countryId: bulgaria.id },
                { name: "Vidin", postCode: "3700", countryId: bulgaria.id },
                { name: "Montana", postCode: "3400", countryId: bulgaria.id },
                { name: "Kardzhali", postCode: "6600", countryId: bulgaria.id },
                { name: "Lovech", postCode: "5500", countryId: bulgaria.id },
                { name: "Targovishte", postCode: "7700", countryId: bulgaria.id },
                { name: "Razgrad", postCode: "7200", countryId: bulgaria.id },
                { name: "Silistra", postCode: "7500", countryId: bulgaria.id },
                { name: "Smolyan", postCode: "4700", countryId: bulgaria.id },
                { name: "Kyustendil", postCode: "2500", countryId: bulgaria.id },
                { name: "Sandanski", postCode: "2800", countryId: bulgaria.id },
                { name: "Petrich", postCode: "2850", countryId: bulgaria.id },
                { name: "Gotse Delchev", postCode: "2900", countryId: bulgaria.id },
            ],
        });
        console.log("Cities created!");
    }

}

const categories = [
    // Electronics
    { name: "Electronics", parentName: null },
    { name: "Smartphones", parentName: "Electronics" },
    { name: "Laptops", parentName: "Electronics" },
    { name: "Tablets", parentName: "Electronics" },
    { name: "TVs & Monitors", parentName: "Electronics" },
    { name: "Audio & Headphones", parentName: "Electronics" },
    { name: "Cameras", parentName: "Electronics" },
    { name: "Gaming", parentName: "Electronics" },

    // Clothing & Fashion
    { name: "Clothing & Fashion", parentName: null },
    { name: "Men's Clothing", parentName: "Clothing & Fashion" },
    { name: "Women's Clothing", parentName: "Clothing & Fashion" },
    { name: "Kids' Clothing", parentName: "Clothing & Fashion" },
    { name: "Shoes", parentName: "Clothing & Fashion" },
    { name: "Bags & Accessories", parentName: "Clothing & Fashion" },

    // Home & Garden
    { name: "Home & Garden", parentName: null },
    { name: "Furniture", parentName: "Home & Garden" },
    { name: "Kitchen & Dining", parentName: "Home & Garden" },
    { name: "Bedding & Bath", parentName: "Home & Garden" },
    { name: "Garden & Outdoor", parentName: "Home & Garden" },
    { name: "Home Decor", parentName: "Home & Garden" },

    // Sports & Outdoors
    { name: "Sports & Outdoors", parentName: null },
    { name: "Fitness Equipment", parentName: "Sports & Outdoors" },
    { name: "Cycling", parentName: "Sports & Outdoors" },
    { name: "Running", parentName: "Sports & Outdoors" },
    { name: "Team Sports", parentName: "Sports & Outdoors" },
    { name: "Outdoor & Camping", parentName: "Sports & Outdoors" },

    // Books & Media
    { name: "Books & Media", parentName: null },
    { name: "Books", parentName: "Books & Media" },
    { name: "Music", parentName: "Books & Media" },
    { name: "Movies & TV", parentName: "Books & Media" },
    { name: "Video Games", parentName: "Books & Media" },

    // Health & Beauty
    { name: "Health & Beauty", parentName: null },
    { name: "Skincare", parentName: "Health & Beauty" },
    { name: "Haircare", parentName: "Health & Beauty" },
    { name: "Vitamins & Supplements", parentName: "Health & Beauty" },
    { name: "Makeup", parentName: "Health & Beauty" },
    { name: "Personal Care", parentName: "Health & Beauty" },

    // Toys & Games
    { name: "Toys & Games", parentName: null },
    { name: "Action Figures", parentName: "Toys & Games" },
    { name: "Board Games", parentName: "Toys & Games" },
    { name: "Puzzles", parentName: "Toys & Games" },
    { name: "Baby & Toddler", parentName: "Toys & Games" },

    // Food & Beverages
    { name: "Food & Beverages", parentName: null },
    { name: "Coffee & Tea", parentName: "Food & Beverages" },
    { name: "Snacks", parentName: "Food & Beverages" },
    { name: "Organic & Natural", parentName: "Food & Beverages" },

    // Automotive
    { name: "Automotive", parentName: null },
    { name: "Car Accessories", parentName: "Automotive" },
    { name: "Car Electronics", parentName: "Automotive" },
    { name: "Tools & Equipment", parentName: "Automotive" },

    // Jewelry & Accessories
    { name: "Jewelry & Accessories", parentName: null },
    { name: "Necklaces", parentName: "Jewelry & Accessories" },
    { name: "Rings", parentName: "Jewelry & Accessories" },
    { name: "Bracelets", parentName: "Jewelry & Accessories" },
    { name: "Watches", parentName: "Jewelry & Accessories" },
];

const existingCategories = await prisma.category.count();

if (existingCategories === 0) {
    const parentCategories = categories.filter(c => c.parentName === null);
    for (const cat of parentCategories) {
        await prisma.category.create({ data: { name: cat.name } });
    }

    const subCategories = categories.filter(c => c.parentName !== null);
    for (const cat of subCategories) {
        const parent = await prisma.category.findFirst({
            where: { name: cat.parentName! },
        });
        if (parent) {
            await prisma.category.create({
                data: { name: cat.name, parentId: parent.id },
            });
        }
    }
    console.log("Categories created!");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());