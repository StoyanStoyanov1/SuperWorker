import { hash } from "bcryptjs";
import { prisma } from "../lib/prisma";
import { env } from "../config/env";

export const ensureAdminUser = async (): Promise<void> => {
    const superAdmin = await prisma.user.findUnique({
        where: {
            email: env.superAdminEmail
        }
    });

    if (superAdmin) return;

    const hashedPassword = await hash(env.superAdminPassword, 10);

    await prisma.user.create({
        data: {
            email: env.superAdminEmail,
            password: hashedPassword,
            role: "SUPER_ADMIN",
            isVerified: true,
            verifiedAt: new Date(),
            person: {
                create: {
                    firstName: "Super",
                    lastName: "Admin",
                    dateOfBirth: new Date("1990-01-01"),
                }
            }
        },
    });

    console.log("Super admin user created");
}