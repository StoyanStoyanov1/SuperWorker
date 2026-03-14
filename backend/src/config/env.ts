import { config } from 'dotenv';

config();

const requiredEnv = [
    "PORT",
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_PASSWORD",
    "JWT_SECRET",
    "JWT_EXPIRES_IN",
] as const;

for (const key of requiredEnv) {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
}

export const env = {
    port: Number(process.env.PORT ?? 3000),
    superAdminEmail: process.env.SUPER_ADMIN_EMAIL as string,
    superAdminPassword: process.env.SUPER_ADMIN_PASSWORD as string,
    jwtSecret: process.env.JWT_SECRET as string,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN as string,
};
