import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import Web3Modal from "web3modal";
import { useEffect, useRef, useState } from "react";
import { providers } from "ethers";

export default function Home() {
  const web3ModalRef = useRef();
  const [ens, setEns] = useState("");
  const [address, setAddress] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);

  const setENSOrAddress = async (
    address: string,
    web3Provider: providers.Web3Provider
  ) => {
    let _ens = await web3Provider.lookupAddress(address);

    if (_ens) {
      setEns(_ens);
    } else {
      setAddress(address);
    }
  };

  const getProviderOrSigner = async () => {
    // @ts-ignore
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("Change network to Goerli");
      throw new Error("Change network to Goerli");
    }
    const signer = web3Provider.getSigner();
    const address = await signer.getAddress();

    await setENSOrAddress(address, web3Provider);
    return signer;
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  const renderButton = () => {
    if (walletConnected) {
      <div>Wallet Connected</div>;
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your Wallet
        </button>
      );
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      // @ts-ignore
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);

  return (
    <div>
      <Head>
        <title>ENS Dapp</title>
        <meta name="description" content="ENS Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div>
          <h1 className={styles.title}>
            Welcome to Simon ENS Dapp {ens ? ens : address}!
          </h1>
          <div className={styles.description}>
            It is an NFT collection for Simon Punks.
          </div>
          {renderButton()}
        </div>
        <div>
          <Image
            className={styles.image}
            width="500"
            height="400"
            src="/learnweb3punks.png"
            alt="Simon Punks"
          />
        </div>
      </main>

      <footer className={styles.footer}>
        Made with &#10084; by Simon Samuel
      </footer>
    </div>
  );
}
