export const mintNFT = async(name, description, image) => {
    //error handling
    if ((name.trim() === "" || description.trim() === "" || !image)) {
      return {
       success: false,
       status: "❗Please make sure all fields are completed before minting.",
      }
     }

     //make metadata
  console.log("I am about to create a Javascript object")   
  const metadata = {};
  metadata.name = name;
  metadata.description = description;

  //make pinata call for image
  const imagePinataResponse = await pinFileToIPFS(image);
  if (!imagePinataResponse.success) {
      return {
          success: false,
          status: "Something went wrong while uploading your image.",
      }
  } 
  else {
      const imageUrl = imagePinataResponse.pinataUrl;
      metadata.image = imageUrl;
  }

  //make pinata call for metadata
  const metadataPinataResponse = await pinJSONToIPFS(metadata);
  if (!metadataPinataResponse.success) {
      return {
          success: false,
          status: "Something went wrong while uploading your tokenURI.",
      }
  } 
  else {
      const tokenURI = metadataPinataResponse.pinataUrl;
      handleMint(tokenURI);

      return {
        success: true,
        status: "lookin' good!",
        tokenURI: tokenURI,
        imageUrl: imageUrl
      }
  }
}

const pinFileToIPFS = async(file) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const data = new FormData();
    data.append('file', file);

    return axios
        .post(url, data, {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                pinata_api_key: key,
                pinata_secret_api_key: secret,
            }
        })
        .then(function (response) {
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
