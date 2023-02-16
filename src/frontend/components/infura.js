const ipfsClient = require('ipfs-http-client');
const projectId = '2LTSVvQAYQc7Hd16uvGco7VgROt';
const projectSecret = '69af64cda025fa2afe32054a152a31a3';
const auth =
    'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
const client = ipfsClient.create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});
client.add('Hello World').then((res) => {
    console.log(res);
});