import axios, * as others from 'axios';

const key = 'ab09d0e7494f1c2e6936';
const secret = 'e427838f911f429406cd14004541ea9184db3a6302786154b8bfef985ad44186';

export const testAuthentication = () => {
    const url = `https://api.pinata.cloud/data/testAuthentication`;
    return axios
        .get(url, JSONBody, {
            headers: {
                'pinata_api_key': key,
                'pinata_secret_api_key': secret,
            }
        })
        .then(function (response) {
            console.log("I got the pinata URL")
            return {
                pinataUrl: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash,
            }
        })
        .catch(function (error) {
            //handle error here
        });
};