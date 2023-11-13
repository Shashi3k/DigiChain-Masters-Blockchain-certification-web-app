import React, { useEffect, useState } from 'react';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import getWeb3 from '../../utils/getWeb3';
import Authenticity from '../../contracts/Authenticity.json';
import { Button, AppBar, Toolbar, Typography} from '@mui/material';
import QrReader from 'react-qr-scanner'; // Import QR code scanner library
import QRCode from 'qrcode.react'; // Import QR code library

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
  const [qrData, setQrData] = useState(null); // For storing scanned QR code data
  const [hashCode, setHashCode] = useState(''); // For storing the hash code
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
      // Handle the error here, e.g., show an error message.
    }
  }

  const certifyFile = async () => {
    await contract.methods.certifyFile(125, "fileHash", recep).send({ from: accounts[0] });
    window.alert("File sent to address" + recep);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const form = event.target;
    const files = form[0].files;

    if (!files || files.length === 0) {
      alert("No files selected");
      return;
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

    // Set the hash code in the state
    setHashCode(result.path);

    form.reset();
  };

  // Apply custom styles to buttons with 3D effect
  const buttonStyles = {
    backgroundColor: 'red',
    color: 'white',
    borderRadius: '20px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)', // Add box-shadow
    fontSize: '0.9rem',
    padding: '8px 16px',
  };

  // Apply custom styles to the input box for recipient wallet address
  const inputStyles = {
    borderRadius: '20px',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
    padding: '10px',
    width: '20%',
  };

  // Container styles for input box
  const inputContainerStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '150px',
  };

  // Styles for the send button
  const sendButtonStyles = {
    marginLeft: '16px',
    marginTop: '8px', // Adjust the margin-top to move the button up
  };

  // Styles for the header with Poppins font
  const headerStyles = {
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
  };

  // Styles for the background image
  const backgroundImageStyles = {
    backgroundImage: 'url("C:\\Users\\adith\\Downloads")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
  };

  // Handle QR code scanning
  const handleScan = (data) => {
    if (data) {
      setQrData(data);

      // Generate the link based on the scanned data
      const qrCodeLink = `http://certificate3k.infura-ipfs.io/ipfs/${data}`;
      setHashCode(data);
      setQrLink(qrCodeLink);
    }
  };

  // Handle QR code scanning error
  const handleError = (error) => {
    console.error(error);
  };

  // State for storing the QR code link
  const [qrLink, setQrLink] = useState(null);

  return (
    <div className="App" style={backgroundImageStyles}>
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
        {/* Navigation Bar */}
        <AppBar position="static">
          <Toolbar style={{ justifyContent: 'center' }}>
            <Typography variant="h6" style={headerStyles}>
              File Authentication checking page.
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Add the highlighted text below the navbar */}
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Typography variant="h5" style={{ backgroundColor: 'orange', padding: '10px', fontFamily: 'Poppins, sans-serif', borderRadius: '10px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)', fontWeight: 'bold', color: 'white' }}>
            Online Blockchain based certificate generation and validation system for government organization.
          </Typography>
        </div>

        {ipfs && (
          <>
            <h3 style={headerStyles}>Upload file to IPFS</h3>
            <form onSubmit={onSubmitHandler}>
              <input type="file" name="file" />
              <Button type="submit" style={buttonStyles}>
                Upload file
              </Button>
            </form>
          </>
        )}

        {/* Display the uploaded image */}
        {images.length > 0 && (
          <div>
            <h3 style={headerStyles}>Uploaded Image</h3>
            {images.map((image, index) => (
              <div key={image.cid.toString() + index}>
                <img
                  alt={`Uploaded #${index + 1}`}
                  src={"https://certificate3k.infura-ipfs.io/ipfs/" + image.path}
                  style={{ maxWidth: "400px", margin: "15px" }}
                />
                <div>
                  <Typography variant="body1" color="success">
                    The hash code generated was {hashCode}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Display QR Code for the hash code */}
        {hashCode && (
          <div>
            <h3 style={headerStyles}>QR Code for Hash Code</h3>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <QRCode value={`http://certificate3k.infura-ipfs.io/ipfs/${hashCode}`} />
            </div>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Button
                style={buttonStyles}
                onClick={() => {
                  // Open the image in a new tab
                  window.open(`http://certificate3k.infura-ipfs.io/ipfs/${hashCode}`, '_blank');
                }}
              >
                Click Here
              </Button>
            </div>
          </div>
        )}

        {/* QR Code Scanner */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <QrReader
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%' }}
          />
          {qrData && (
            <div>
              <p>Scanned QR Code Data:</p>
              <p>
                {/* Generate a link based on the scanned data */}
                <a href={`http://certificate3k.infura-ipfs.io/ipfs/${qrData}`} target="_blank" rel="noopener noreferrer">
                  View Certificate
                </a>
              </p>
            </div>
          )}
        </div>

        {/* ... (previous code) ... */}
      </div>
    </div>
  );
}

export default FileCertifyPage;
