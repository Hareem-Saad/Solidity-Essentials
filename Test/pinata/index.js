const dotenv = require('dotenv')
dotenv.config()
const pinataSDK = require('@pinata/sdk')
const pinata = pinataSDK(process.env.API_KEY, process.env.API_SECERET)

pinata.testAuthentication().then((result) => {
    console.log(result);
}).catch((error) => {
    console.log(error);
})