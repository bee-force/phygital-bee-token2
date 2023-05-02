import axios, * as others from 'axios';

const key = 'ab09d0e7494f1c2e6936';
const secret = 'e427838f911f429406cd14004541ea9184db3a6302786154b8bfef985ad44186';


const pinataOptions = {
    pinataMetadata: {
      name: 'My NFT',
      keyvalues: {
        description: 'This is my NFT',
      },
    },
  };
  

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

export const pinJSONAndImageToIPFS = async (JSONBody, image) => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("pinataOptions", JSON.stringify(pinataOptions));
  
    // upload image file to Pinata
    const pinataFileResponse = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxContentLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          pinata_api_key: key,
          pinata_secret_api_key: secret,
        },
      }
    );
  
    if (!pinataFileResponse.data.IpfsHash) {
      return {
        success: false,
        status: "Something went wrong while uploading your image.",
      };
    }
  
    const imageURI = `https://gateway.pinata.cloud/ipfs/${pinataFileResponse.data.IpfsHash}`;
  
    // add image URI to JSONBody
    JSONBody.image = imageURI;
  
    // upload JSON metadata to Pinata
    const pinataResponse = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      JSONBody,
      {
        headers: {
          pinata_api_key: key,
          pinata_secret_api_key: secret,
        },
      }
    );
  
    if (!pinataResponse.data.IpfsHash) {
      return {
        success: false,
        status: "Something went wrong while uploading your tokenURI.",
      };
    }
  
    const tokenURI = `https://gateway.pinata.cloud/ipfs/${pinataResponse.data.IpfsHash}`;
  
    return {
      success: true,
      status: "lookin' good!",
      tokenURI: tokenURI,
    };
  };
  