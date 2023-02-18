const mongoose = require('mongoose');
mongoose.set('strictQuery', true) //returns error on misconnection
const config = require('../config/config');
const app = require('./express');

app.listen(config.port, async (err) => {
    if (err) {
        console.log('err ===== ', err);
    } else {
        await mongoose
                .connect(config.mongoUri, { useNewUrlParser: true } )
                .catch(error => console.error(error))

        console.log('Server listening on port ===== ', config.port);
    }
    })

