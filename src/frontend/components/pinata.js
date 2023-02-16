import axios, * as others from 'axios';

const key = 'ab09d0e7494f1c2e6936';
const secret = 'e427838f911f429406cd14004541ea9184db3a6302786154b8bfef985ad44186';

export const pinJSONToIPFS = async(JSONBody) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    //making axios POST request to Pinata ⬇️
    return axios
        .post(url, JSONBody, {
            headers: {
                pinata_api_key: key,
                pinata_secret_api_key: secret,
            }
        })
        .then(function (response) {
            console.log("I am returning the pinata URL")
           return {
               success: true,
               pinataUrl: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash,
               status: "lookin' good!"
           };
        })
        .catch(function (error) {
            console.log(error)
            return {
                success: false,
                message: error.message,
                status: "lookin' bad!"
            }

    });
};