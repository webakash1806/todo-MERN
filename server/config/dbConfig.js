import mongoose from 'mongoose'

mongoose.set('strictQuery', false)

const connectToDB = async () => {
    try {

        const { connection } = await mongoose.connect(process.env.MONGO_URL)

        if (connection) {
            console.log(`Database is connection to ${connection.host}`)
        }

    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}

export default connectToDB