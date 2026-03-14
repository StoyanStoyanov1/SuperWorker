import { createApp } from "./app"
import { env } from "./config/env"
import { ensureAdminUser } from "./services/bootstrap.service"

const start = async (): Promise<void> => {
    try {
        await ensureAdminUser()
        const app = createApp()
        app.listen(env.port, () => {
            console.log(`Server running on port: ${env.port}`)
        })
    } catch (error) {
        console.error("Failed to start server:", error)
        process.exit(1)
    }
}

start()