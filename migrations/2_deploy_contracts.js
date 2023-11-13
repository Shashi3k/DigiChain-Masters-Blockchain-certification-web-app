import React, { useEffect, useState } from 'react';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import getWeb3 from '../../utils/getWeb3';
import Authenticity from '../../contracts/Authenticity.json';
import { Button, AppBar, Toolbar, Typography } from '@mui/material';

const projectId = "2VG2HRw74lI6t0i4pq0O6RHnofv";
const projectSecretKey = "0a8b203144747ebec74d1f2fb19f79e5";
const authorization = "Basic " + btoa(projectId + ":" + projectSecretKey);

function FileCertifyPage() {
  const [images, setImages] = useState([]);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [currAdd, setCurrAdd] = useState(null);
  const [recep, setRecep] = useState('');
  const ipfs = ipfsHttpClient({
    url: "https://ipfs.infura.io:5001/api/v0",
    headers: {
      authorization
    }
  });

  useEffect(() => {
    componentDidMount();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(recep);
  };

  async function componentDidMount() {
    try {
      console.log("fgdh");
      const web3 = await getWeb3();
      console.log("sgdg");

      const accounts = await web3.eth.getAccounts();
      console.log("verify page", accounts[0]);
      setCurrAdd(accounts[0]);

      const netId = await web3.eth.net.getId();
      const deployedNetwork = Authenticity.networks[netId];
      const instance = new web3.eth.Contract(
        Authenticity.abi,
        deployedNetwork && deployedNetwork.address
      );

      setContract(instance);
      console.log(instance);
      setWeb3(web3);
      setAccounts(accounts);
    } catch (error) {
      console.error("Web3 error", error);
      setWeb3(null);
      return <h1>Connection error</h1>;
    }
  }

  const certifyFile = async () => {
    await contract.methods.certifyFile(125, "fileHash", recep).send({ from: accounts[0] });
    window.alert("File sent to address" + recep);
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const form = event.target;
    const files = form[0].files;

    if (!files || files.length === 0) {
      return alert("No files selected");
    }

    const file = files[0];
    // upload files
    const result = await ipfs.add(file);
    const url = "https://certificate3k.infura-ipfs.io/ipfs/" + result.path;
    console.log(url);

    setImages([
      ...images,
      {
        cid: result.cid,
        path: result.path,
      },
    ]);
    console.log(images);

    form.reset();
  };

  // Apply custom styles to buttons with rounded edges and slightly reduced size
  const buttonStyles = {
    backgroundColor: 'red',
    color: 'white',
    borderRadius: '20px',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
    fontSize: '1rem', // Slightly reduce font size
    padding: '10px 20px', // Slightly reduce padding
    marginRight: '10px', // Add margin for spacing
  };

  return (
    <div className="App">
      {/* Navigation Bar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">File Authentication checking page.</Typography>
        </Toolbar>
      </AppBar>

      {ipfs && (
        <>
          <h3>Upload file to IPFS</h3>
          <form onSubmit={onSubmitHandler}>
            <input type="file" name="file" />
            <Button type="submit" style={buttonStyles}>
              Upload file
            </Button>
          </form>
        </>
      )}
      <div>
        {images.map((image, index) => (
          <div key={image.cid.toString() + index}>
            <img
              alt={`Uploaded #${index + 1}`}
              src={"https://certificate3k.infura-ipfs.io/ipfs/" + image.path}
              style={{ maxWidth: "400px", margin: "15px" }}
            />
            <div>
              the hash code generated was {image.path}
            </div>
            <div>
              <p>
                <form onSubmit={handleSubmit}>
                  <label>
                    Enter the recipient Wallet address:
                    <input type='text' value={recep} onChange={(e) => setRecep(e.target.value)} />
                  </label>
                  <Button type='submit' style={buttonStyles}>Send</Button>
                </form>
              </p>
            </div>
            <div>
              <Button color='success' onClick={certifyFile} disabled={recep === ""} style={buttonStyles}>
                Certify File
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FileCertifyPage;
