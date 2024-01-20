
export default async function (app) {
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept")
        next()
    })

    app.use('/api/auth', (await import("./auth.routes.js")).default)
    app.use('/api/user', (await import("./user.routes.js")).default)
    app.use('/api/track', (await import("./track.routes.js")).default)
}