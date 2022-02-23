
import { useState } from 'react';
import { ethers } from "ethers";
import contractAddress from "./contracts/contract-address.json";
import RedGuyArtifact from "./contracts/RedGuy.json";

function App() {
  const [address, setAddress] = useState('');
  const [contract, setContract] = useState({});
  const [message, setMessage] = useState('please connect your wallet');

  const connectWallet = async () => {
    if(!_checkNetwork()) return;

    const [selectedAddress] = await window.ethereum.request({ method: 'eth_requestAccounts' });

    _initialize( selectedAddress );
  }

  // checks if Metamask selected network is Localhost:8545
  // augment to handle other networks
  const _checkNetwork = () => {
    const HARDHAT_NETWORK_ID = '31337';

    if (!window.ethereum) {
      setMessage('No wallet detected. Please install Metamask');
      return false;
    } else if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
      setMessage('Connected to Hardhat network');
      return true;
    } else {
      setMessage('Please connect Metamask to Localhost:8545');
      return false;
    }
  }

  const _initialize = (userAddress) => {
    setAddress(userAddress)
    _initializeEthers();
    // this._getTokenData();
  }

  const _initializeEthers = async () => {
    const _provider = new ethers.providers.Web3Provider(window.ethereum);
    // Then, we initialize the contract using that provider and the token's
    // artifact. You can do this same thing with your contracts.
    const contract = new ethers.Contract(
      contractAddress.RedGuy,
      RedGuyArtifact.abi,
      _provider.getSigner(0)
    );

    setContract(contract);
  }
  // ethers.utils.parseEther('0.05')
  const mint = async () => {
    await contract
          .safeMint(address)
          .send({ value: ethers.utils.parseEther('0.05')})
          .on("receipt", (r) => console.log(r));
  }

  return (
    <div className="App">
      <div>
        <button 
          type="button"
          onClick={ connectWallet }
        >
          connect wallet
        </button>
        <div>{ message }</div>
      </div>
      <div>Welcome to the Red Guy's world.</div>
      <div>
        <button 
          type="button"
          onClick={ mint }
        >
          Mint
        </button>
      </div>
    </div>
  );
}

export default App;
