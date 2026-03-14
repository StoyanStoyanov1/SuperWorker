import { hash} from "bcryptjs";
import { prisma} from "../lib/prisma";
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
            person_id: crypto.randomUUID(),
            isVerified: true,
            verifiedAt: new Date(),
        },
    });

    console.log("Super admin user created");
}