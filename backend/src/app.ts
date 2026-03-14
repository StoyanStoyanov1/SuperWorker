import express, { Express } from "express"
import { prisma } from "./lib/prisma"

export const createApp = (): Express => {
    const app = express()

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    app.get("/health", async (_, res) => {
        try {
            await prisma.$queryRaw`SELECT 1`
            res.json({
                status: "ok",
                database: "connected",
                timestamp: new Date().toISOString()
            })
        } catch {
            res.status(503).json({
                status: "error",
                database: "disconnected"
            })
        }
    })

    return app
}