import React, { Component } from "react";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Web3 from 'web3'
import BlockIdContract from './blockid/BlockId.js';
import { withSwalInstance } from 'sweetalert2-react';
import swal from 'sweetalert2';
var CryptoJS = require("crypto-js");

const SweetAlert = withSwalInstance(swal);

window.addEventListener('reload', function () {

  if(typeof web3 !== 'undefined'){
    console.log("Using web3 detected from external source like MetaMask")
    window.web3 = new Web3(window.web3.currentProvider)
  }else{
    console.log("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to MetaMask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
    alert('No web3? You should consider trying MetaMask!')
  }

});

var products = [
{
  Entity: "Portuguese Republic",
  IDCertificate: "x509",
  Card: "Cartão de Cidadão",
  Attributes: "Identity, Address",
  SCaddress: "9h8gj79x9h8gj79x",
  SCDate: "12 Jan 18"
}
];

class View extends Component {

  isExpandableRow(row) {
    return true;
  }

  expandComponent(row) {
    return (
      <BSTable data={ row.expand } />
    );
  }

  render() {
    return (
      <main role="main" className="container">
        <div className="scroll-pre"></div>
        <div className="row justify-content-md-center pb-3 containerBorderBottom">
          <div className="col text-center">
                <h1 className="pb-3">View your identities</h1>
                  <h2 className="colorGrey">
                    Check Your ID documents within WalliD’s smart contract
                  </h2>
            </div>
        </div>
        <div className="row pt-3 pb-3 containerBorderBottom">
          <div className="col text-center">
            <p>Make sure you are logged in MetaMask to ensure your safety accessing your ether wallet.
             <br />
             Remember decryption is only possible your with your wallet private key through MetaMask association and we don’t have any access to your data</p>
          </div>
        </div>
        <br />
        <BootstrapTable
          data={products}
          hover
          condensed
          pagination
          expandableRow={ this.isExpandableRow }
          expandComponent={ this.expandComponent }
          >
          <TableHeaderColumn dataField="Entity" width='20%' isKey={true}>Entity</TableHeaderColumn>
          <TableHeaderColumn dataField="IDCertificate" width='10%'>ID Certificate</TableHeaderColumn>
          <TableHeaderColumn dataField="Card" width='10%'>Card</TableHeaderColumn>
          <TableHeaderColumn dataField="Attributes" width='20%'>Attributes</TableHeaderColumn>
          <TableHeaderColumn dataField="SCaddress" width='20%'>SC Address</TableHeaderColumn>
          <TableHeaderColumn dataField="SCDate" width='20%'>SC Date</TableHeaderColumn>
        </BootstrapTable>
      </main>
    );
  }
}

export default View;

class BSTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      popupLogout: false,
      popupError: false,
      data: '',
      ContractAddress : '0x787e5fc4773cad0c45f287bf00daca402845b1b7',
      ContractInstance : null,
      password: '20THIS_WILL_USE_METAMASK_SECURITY18'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    if(window.web3){
      const MyContract = window.web3.eth.contract(BlockIdContract.abi)
      this.state.ContractInstance = MyContract.at(this.state.ContractAddress)

      // this.state.ContractInstance.countItemList( (err, data) => {
      //   console.log('Count items :  ', data);
      //   console.log('total items #', data.c[0] );
      // });
      this.checkMetamaskUser()
    }
  }

  checkMetamaskUser() {
   var self = this

   window.web3.eth.getAccounts(function(err, accounts){

     if (err != null) {
       console.error("An error occurred: "+err);
       self.state.isUserLogged = 0;
     }
     else if (accounts.length === 0) {
       console.log("User is not logged in to MetaMask");
       self.state.isUserLogged = 0;
       self.state.popupLogout = true;
     }
     else {
       console.log("User is logged in to MetaMask");
       self.state.isUserLogged = 1;
     }
     self.forceUpdate()
   });
 }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit(event) {
    this.getInfo()
    event.preventDefault();
  }

  hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 2; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
  }

  getInfo()
  {
    var opid = "123456789";
    this.state.ContractInstance.getIdtData( "CC_PT", opid,(err, data) => {
      console.log('get Info Result ', data);
      var loadData = [];
      var identifyId = {}

      try {
        var bytes =  CryptoJS.AES.decrypt(this.hex2a(data[0]) ,this.state.password);
        var ret_1 = bytes.toString(CryptoJS.enc.Utf8);
        identifyId = JSON.parse(ret_1);

        //console.log('Identify ', identifyId);
        //console.log(Object.keys(dataAttribute));

        for(var i in identifyId.identityAttributes){
          //console.log(i);
          //console.log(dataAttribute[i]);
          loadData.push({ 'item' : i, 'value' : identifyId.identityAttributes[i]})
        }

        for( i in identifyId.addressAttributes){
          //console.log(i);
          //console.log(dataAttribute[i]);
          loadData.push({ 'item' : i, 'value' : identifyId.addressAttributes[i]})
        }

        this.setState({ data: loadData })
        this.forceUpdate()

      }
      catch(err) {
          console.log("error",err);
          this.setState({ popupError: true })
          this.forceUpdate()
      }

    });
  }

  render() {
    if (this.state.data) {
      return (
        <BootstrapTable
          data={this.state.data}
          hover
          condensed
          >
          <TableHeaderColumn dataField="item" width='20%' isKey={true}>Item</TableHeaderColumn>
          <TableHeaderColumn dataField="value" width='10%'>Value</TableHeaderColumn>
        </BootstrapTable>
      );
      } else {
        if(this.state.isUserLogged){
          return (
              <div>
                <SweetAlert
                  show={this.state.popupError}
                  title="Decrypt fail!"
                  text="Decrypt fail! Please try Again!"
                  confirmButtonColor = "#0FA3B1"
                  onConfirm={() => this.setState({ popupError: false })}
                  />
                <form onSubmit={this.handleSubmit} >
                  {/*<div className="form-group">
                    <label>
                      WalliD Encryption Password
                    </label>
                    <p>
                      <a href="/">
                        What is WalliD Encrytion Password?
                      </a>
                    </p>
                    {/*<div className="row ">
                      <div className="col-md-6">
                        <input
                          type="password"
                          name="password"
                          onChange={this.handleChange}
                          className="form-control"
                          placeholder="Enter the password to decrypt your certified ID attributes"
                          required />
                      </div>
                    </div>
                  </div>*/}
                  <input type="submit" value="View ID" />
                  </form>
              </div>
        );
        }else{
          return (
              <div>
                <SweetAlert
                  show={this.state.popupLogout}
                  title="User logged out?"
                  text="Please login your account at MetaMask and try again!"
                  confirmButtonColor = "#0FA3B1"
                  />
                <p>User logged out? Please login your account at MetaMask and try again!</p>
                  <p>
                    <a href="https://metamask.io/">
                    Download MetaMask here
                    </a>
                  </p>
                  <p>
                    <a href="https://metamask.io/">
                      What is MetaMask?
                    </a>
                  </p>
              </div>
        );
        }

      }
    }
  }
