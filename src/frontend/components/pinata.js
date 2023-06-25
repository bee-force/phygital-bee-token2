// IPFS component
// Importing the axios library
import axios from 'axios';

// API key and secret for Pinata
const pinataKey = process.env.REACT_APP_PINATA_KEY;
const pinataSecret = process.env.REACT_APP_PINATA_SECRET;

// Options for pinning metadata to Pinata
const pinataOptions = {
  pinataMetadata: {
    name: 'My NFT',
    keyvalues: {
      description: 'This is my NFT',
    },
  },
};

// Function to pin JSON data to IPFS using Pinata
export const pinJSONToIPFS = async (JSONBody) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

  // Making a POST request to Pinata using axios
  return axios
    .post(url, JSONBody, {
      headers: {
        pinata_api_key: key,
        pinata_secret_api_key: secret,
      },
    })
    .then(function (response) {
      console.log("I am returning the pinata URL");
      // Returning the success and pinata URL
      return {
        success: true,
        pinataUrl: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash,
        status: "lookin' good!",
      };
    })
    .catch(function (error) {
      console.log(error);
      // Returning the failure and error message
      return {
        success: false,
        message: error.message,
        status: "lookin' bad!",
      };
    });
};

// Function to pin JSON data and image to IPFS using Pinata
export const pinJSONAndImageToIPFS = async (JSONBody, image) => {
  const formData = new FormData();
  formData.append("file", image);
  formData.append("pinataOptions", JSON.stringify(pinataOptions));

  // Uploading the image file to Pinata
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
    // Returning the failure and error message if image upload fails
    return {
      success: false,
      status: "Something went wrong while uploading your image.",
    };
  }

  const imageURI = `https://gateway.pinata.cloud/ipfs/${pinataFileResponse.data.IpfsHash}`;

  // Adding the image URI to JSONBody
  JSONBody.image = imageURI;

  // Uploading the JSON metadata to Pinata
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
    // Returning the failure and error message if tokenURI upload fails
    return {
      success: false,
      status: "Something went wrong while uploading your tokenURI.",
    };
  }

  const tokenURI = `https://gateway.pinata.cloud/ipfs/${pinataResponse.data.IpfsHash}`;

  // Returning the success and tokenURI
  return {
    success: true,
    status: "lookin' good!",
    tokenURI: tokenURI,
  };
};
