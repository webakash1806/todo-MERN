import app from "./app.js"
import connectToDB from "./config/dbConfig.js"



const PORT = 5000 || process.env.PORT

app.listen(PORT, async () => {
    await connectToDB()
    console.log("App is running at port " + PORT)
})