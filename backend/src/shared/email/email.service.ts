import * as nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    auth: {
        user: "ab97e09e1cbd7b",
        pass: process.env.MAILTRAP_PASSWORD,
    },
});

export const sendVerificationEmail = async (email: string, token: string) => {
    if (process.env.NODE_ENV === "test") return;

    const verificationUrl = `http://localhost:3000/auth/verify-email?token=${token}`;

    await transporter.sendMail({
        from: "E-Commerce <noreply@e-commerce.com>",
        to: email,
        subject: "Verification email",
        html: `
    <h2>Welcome in E-commerce!</h2>
    <a href="${verificationUrl}">Confirm</a>
`,
    })
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
    if (process.env.NODE_ENV === "test") return;

    const resetUrl = `http://localhost:3000/auth/reset-password?token=${token}`;

    await transporter.sendMail({
        from: '"SuperWorker" <noreply@superworker.com>',
        to: email,
        subject: "Password Reset",
        html: `
            <h2>Password Reset Request</h2>
            <p>Click the link below to reset your password:</p>
            <a href="${resetUrl}">Reset Password</a>
            <p>This link is valid for 1 hour.</p>
            <p>If you did not request a password reset, please ignore this email.</p>
        `,
    });
};