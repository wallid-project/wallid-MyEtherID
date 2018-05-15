import React, { Component } from "react";
import { HashLink as Link } from 'react-router-hash-link';
import ImportForm from './components/ImportForm';

class Store extends Component {
  render() {
    return (
      <main role="main" className="container">
        <div className="scroll-pre"></div>
        <div className="row justify-content-md-center pb-3 containerBorderBottom">
            <div className="col text-center">
                <h1 className="pb-3">Store your Identity on the Blockchain</h1>
                <h2 className="colorGrey">
                    Encrypt and store your ID attributes associated with your Ethereum wallet onto a smart contract
                </h2>
            </div>
        </div>

        <div className="row pt-3 pb-3 containerBorderBottom">
          <div className="col">
        <ImportForm />
        </div>
        </div>
          <div className="row text-center pt-3 justify-content-md-center">
              <div className="col-md-10">
                  <h5 className="pb-3">You need to extract your attributes from your Identity Document and locally generate your ID data from
                    BlockID’s ImportID desktop app. Once you generate it on the app, copy it to respective ID Data section above.</h5>
              </div>
          </div>
          <div className="row text-center containerBorderBottom pb-5">
                      <div className="col-md-4">
                        <Link to="/help#top" className="biggerLink">What is BlockID?</Link>
                      </div>
                      <div className="col-md-4">
                        <Link to="/help#top" className="biggerLink">What is ImportID</Link>
                      </div>
                      <div className="col-md-4">
                        <Link to="/help#top" className="biggerLink">What is my ID Data?</Link>
                      </div>
          </div>
          <div className="row pt-5 pb-5 containerBorderBottom">
              <div className="col text-center">
                  <h5 className="pb-3">If you haven’t installed Import ID on your computer, you can download it for free.</h5>
                  <a href="/" className="btn linkButtons btn-lg active" role="button" aria-pressed="true">Download here</a>
              </div>
          </div>
          <div className="row pt-3">
              <div className="col">
                  <h4>How to Protect Yourself From Loss</h4>
                  <p>If you lose your private key or MetaMask recovery keywords they are gone forever. Don't lose them.</p>
                  <ul>
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

export default Store;
