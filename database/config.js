const mongoose = require('mongoose')

const dbConnection = async() => {
    
    try {

        await mongoose.connect( process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: false,
        })
        console.log('DB Online')

    } catch (error) {
        console.log(error)
        throw new Error('Error en la DB')
    }
}  


module.exports = {
    dbConnection
}