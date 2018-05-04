import React, { Component } from "react";
import { HashLink as Link } from 'react-router-hash-link';

class Home extends Component {
  render() {
    return (
      <main role="main" class="container">
        <div class="scroll-pre"></div>

        <div class="row justify-content-md-center pb-3">
          <div class="col text-center containerBorderBottom">
            <h1 class="pb-3">Welcome to MyEtherID</h1>
            <h2 class="colorGrey">Connect your off-chain identity to your Ether Wallet</h2>

          </div>
        </div>
        <div class="row pt-5 pb-3 containerBorderBottom">
          <div class="col">
            <h3 class="text-center colorBlue pb-5">What is MyEtherID</h3>
            <div class="row">
              <div class="col">
                <p>
                  MyEtherID is a webapp that allows you to encrypt and store real life certified identities on a smart contract.
                  It is also a gateway to manage different certified identity types you might own and check the history of your ID transactions through BlockID protocol.
                </p>
                <p>
                  It allows you to associate your identity attributes to your Ethereum Wallet without having access to your data or to your wallet keys.
                  All data is encrypted and decrypted by your own keys and associations to your wallet are made through Metamask.
                  No decrypted data is ever accessed by anyone else but its owner nor stored on the Blockchain.
                </p>
                <p>MyEther ID is a free, open-source, client-side interface.
                  MyEtherID allows you to encrypt and store your certified identity data on the Ethereum blockchain,
                  check the corresponding smart contract addresses, and to confirm the transactions performed with those smart contracts.</p>
              </div>
              <div class="col">

                <p>MyEtherID allows you to interact directly with the Ethereum blockchain, using your public Ethereum Wallet address.
                  You are always in full control of your keys and identity certificates:</p>
                <ul class="meiTopics">
                  <li>You are the sole entitled responsible for the security of your actions.</li>
                  <li>The handling of your keys happens entirely on your computer, inside your browser.</li>
                  <li>MyEtherID shall never store your private key, recovery keywords, or any other account information.
                    All the input information will be solely used to interact directly with the Ethereum blockchain.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="row justify-content-md-center pb-5 pt-5">
          <div class="col-8">
            <h3 class="colorBlue pb-3">Your ID in your Ether Wallet</h3>
            <p>Encrypt and save your certified identity on the blockchain and associate it with your ether wallet.</p>
            <p>If you don’t have an Ethereum wallet, you can create it securely and for free on
              <a href="https://www.myetherwallet.com/" target="_blank rel=noopener"> MyEtherWallet.com</a>.</p>
              <Link to="/help#top">What is MyEtherWallet?</Link>

            </div>
            <div class="col-4 text-right">
              <img class="imgBlockChain" src={require('./img/blockchain.svg')} alt="Blockchain" />
            </div>
          </div>
          <div class="row text-center pb-5 containerBorderBottom">
            <div class="col">
              <Link to="/store#top" class="btn linkButtons btn-lg active" role="button" aria-pressed="true">Start Storing your ID</Link>
            </div>
          </div>

          <div class="row pt-3">
            <div class="col">
              <h4>Stay safe on the Blockchain</h4>
              <p>Your account has a public and a private key. Whenever requested by third-parties, always supply your public key, which can be used
                to retrieve your ciphered blockchain information, never your private key. Afterwards, that information shall only be readable by
                you or entities trusted by yourself, upon you deciphering it with matamask plugin.</p>
              <p>How to Protect Yourself From Loss:</p>
              <ul>
                <li>If you lose your private key or metamask recovery keywords they are gone forever. Don't lose them.</li>
                <li>Make a backup of your keys. Do NOT just store them on your computer. Print them out on a piece of paper or save them to a USB drive.</li>
                <li>Store this paper or USB drive in a different physical location. A backup is not useful if it is destroyed by a fire or flood along with your laptop.</li>
                <li>Do not store your keys inn Dropbox, Google Drive, or other cloud storage. If that account is compromised, your funds will be stolen.</li>
              </ul>
            </div>
          </div>
        </main>
      );
    }
  }

  export default Home;
