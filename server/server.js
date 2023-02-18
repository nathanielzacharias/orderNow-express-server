const config = require('./../config/config')
const app =  require('./express')

app.listen(config.port, (err) => {
    if (err) {
        console.log('err ===== ', err); 
    } else {    
        console.log('Server listening on port ===== ', config.port);
    }
}
)