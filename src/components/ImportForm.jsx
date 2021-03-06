import React from "react";
import Web3 from 'web3'
import WallidContract from '../wallid/wallid.js';
import { Link } from 'react-router-dom';
import { withSwalInstance } from 'sweetalert2-react';
import swal from 'sweetalert2';
import Switch from "react-switch";
import * as WallidConst from '../wallid/const.js';

const SweetAlert = withSwalInstance(swal);

var CryptoJS = require("crypto-js");
var Spinner = require('react-spinkit');

const state = {
  STATE_TRANSACTION_FAIL: '0',
  STATE_TRANSACTION_PROCESSING: '1',
  STATE_TRANSACTION_CONFIRMED: '2'
};

window.addEventListener('reload', function () {
  if(typeof web3 !== 'undefined'){
    console.log("Using web3 detected from external source like MetaMask")
    window.web3 = new Web3(window.web3.currentProvider)
  }else{
    console.log("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to MetaMask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
  }
});

class ImportForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      popupLogout: false,
      popupError: false,
      popupCancel: false,
      timeoutID: '',
      walletAddress: '',
      password: WallidConst.DEFAULT_PASSWORD,
      passwordCheck: WallidConst.DEFAULT_PASSWORD,
      data: '',
      ContractAddress : WallidConst.CONTRACT_ADDRESS,
      ContractInstance : null,
      isManualPassword : true,
      chiperPassword  : WallidConst.DEFAULT_PASSWORD,
      userWaMetamask: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUsePassword = this.handleUsePassword.bind(this);


    if(window.web3){
      const MyContract = window.web3.eth.contract(WallidContract.abi)
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
        console.log("userWaMetamask = " + accounts[0]);
        self.state.userWaMetamask = accounts[0];
      }
      self.forceUpdate()
    });
  }

  timer(txID) {
    var self = this
    window.web3.eth.getTransaction(txID, (err, transaction) => {
      console.log("Transaction: " + transaction);
      console.log(transaction);
      if (transaction.blockNumber == null)
      {
        console.log('Not yet! ...');
      }
      else
      {
        console.log('Last Transaction was confirmed!');
        clearInterval(self.state.timeoutID);
        self.state.addinfoSuccess = state['STATE_TRANSACTION_CONFIRMED'];
        self.forceUpdate()
      }
    }
  );
}

hex2a(hexx) {
  var hex = hexx.toString();//force conversion
  var str = '';
  for (var i = 2; i < hex.length; i += 2)
  str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

handleUsePassword(event){
  console.log('LOG ', this.state.isManualPassword);
  this.setState({ isManualPassword : event });
}

handleChange(event) {
  this.setState({
    [event.target.name]: event.target.value
  });
}

handleErrors(response) {
  console.log("handleErrors");
  if (!response.ok) {
    console.log("response",response);
    alert("ID Data format error. Please copy all data from ImportID")
    throw Error(response.statusText);
  }
  return response;
}
handleSucess(response) {
  console.log("handleSucess ", this.state.isManualPassword );
  //console.log('Password : ' + this.state.password);
  //console.log('Password Check : ' + this.state.passwordCheck);
  //console.log('Data :' + this.state.data);

  var obj = {};
  try {
    obj = JSON.parse(this.state.data);
    var storeIdProviderWa = JSON.stringify(obj.dataID.storeIDProvider.wa);
    var storeIdProviderName = obj.dataID.storeIDProvider.name;
    var storeIdProviderUrl = obj.dataID.storeIDProvider.url;

    var idt = obj.dataID.data.idt;
    var idtName = obj.dataID.data.idtName;

    console.log('storeId Provider WA :' + storeIdProviderWa);
    console.log('idt :' + idt);

    var password = this.state.isManualPassword ? this.state.chiperPassword : this.state.password;
    console.log('password for encrpt (1) ', password);
    var identityId = CryptoJS.AES.encrypt(JSON.stringify( obj.dataID.data.identityID), password).toString();

    console.log('Encrypt identity ID ', identityId  );

    var opid = "123456789";

    var sdkey = JSON.stringify("0x123456789abcdef")

    var self = this
    this.state.ContractInstance.addInfo( identityId, idt, idtName, storeIdProviderWa, storeIdProviderName, storeIdProviderUrl, opid, sdkey,(err, data) => {
      console.log('add info result is ', data);
      if(data){
        self.state.addinfoSuccess = state['STATE_TRANSACTION_PROCESSING'];
        self.state.timeoutID = setInterval(self.timer.bind(self), WallidConst.INTERVAL_TIME, data);
        self.forceUpdate()
      }else{
        self.state.addinfoSuccess = state['STATE_TRANSACTION_FAIL'];
        self.state.popupCancel = true
        self.forceUpdate()
      }
    });
  }
  catch(err) {
    this.setState({ popupError: true })
    this.forceUpdate()
  }

  return;
}

handleSubmit(event) {
  console.log("handleSubmit isManualPassword",this.state.isManualPassword);
  var obj = JSON.parse(this.state.data);

  var password = this.state.isManualPassword ? this.state.chiperPassword : this.state.password;
  console.log('password for encrpt (2) ', password);
  var verifyId = CryptoJS.AES.encrypt(JSON.stringify( obj.dataID.data.verifyID), password).toString();

  console.log('Encrypt verify ID ', verifyId  );

  obj.dataID.data.verifyID = verifyId;

  delete obj.dataID.data.identityID;

  var userWa = obj.dataID.data.wa;
  var userWaMetamask = this.state.userWaMetamask;
  var userWaTest = WallidConst.USER_WA_TEST;
  console.log("userWa = " + userWa.toLowerCase())
  console.log("userWaMetamask = " + userWaMetamask.toLowerCase())

  var storeIdProviderUrl = obj.dataID.storeIDProvider.url;

  if(userWa.toLowerCase() === userWaMetamask.toLowerCase()
      // Do not validade if using https://wallid.io/identityfortesting.html
      || userWa.toLowerCase() === userWaTest.toLowerCase())
  {
    console.log("call storeIdProvider: " + storeIdProviderUrl);
     //this.handleSucess()
      fetch(storeIdProviderUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
      })
      .then(this.handleErrors)
      .then(response => this.handleSucess(response) )
      .catch(error => {
        console.log(error)
        alert("Store Wallid Fail")
      }
    );
  }else{
    alert("Error: The wallet address used to import data and wallet address logged in metamask is not the same")
  }

  event.preventDefault();
}

/* run after component render */
componentDidMount(){
}

/* run before component render */
componentWillMount(){
}

render() {
  if(window.web3){
    if(this.state.isUserLogged){
      if(this.state.addinfoSuccess === state['STATE_TRANSACTION_CONFIRMED']){
        return (
          <form class="text-center successfullyStored" onSubmit={this.handleSubmit} >
            <p>
              <p className="strong">
                ID succesfully encrypted and stored on the blockchain. You can check it
                <Link to="/view" className="inlineLink"> here</Link>.
              </p>
            </p>
          </form>
        );
      }else if(this.state.addinfoSuccess === state['STATE_TRANSACTION_PROCESSING']){
        return (
          <div align="center" className="storing">
            <p>
              Storing on the Blockchain. Please wait....
            </p>
            <Spinner name="ball-beat" color="#3a5199"/>
          </div>
        );
      }else{
        return (
          <div class="text-center">
            <SweetAlert
              show={this.state.popupError}
              title="ID Data Error"
              text="Please copy all data from ImportID"
              confirmButtonColor = "#f89722"
              onConfirm={() => this.setState({ popupError: false })}
              />
            <SweetAlert
              show={this.state.popupCancel}
              title="Error"
              text="Operation canceled. Please try again!"
              confirmButtonColor = "#f89722"
              onConfirm={() => this.setState({ popupCancel: false })}
              />
            <form onSubmit={this.handleSubmit} >
              <div className="form-group pb-2">
                <label className="mt-3 pb-2 strong">
                  ID Data
                </label>
                <textarea
                  id="importData"
                  name="data"
                  onChange={this.handleChange}
                  className="form-control"
                  rows="5"
                  placeholder="Paste your ID data provided by WalliD’s ImportiD app"
                  required>
                </textarea>
              </div>

              <p className="mt-4 strong">
                Disclaimer
              </p>
              <p>
                Current Metamask build doesn’t support the features do encrypt data with users’ private key.
                It will be available as soon, you can encrypt your ID data with a pasword of your choice (recommended action).
                Otherwise you can choos to alow MyEtheriD to encrypt your ID data with a default password (We do not recommended this action).
              </p>
                <label htmlFor="material-switch">
                <Switch
                  onChange={this.handleUsePassword}
                  checked={this.state.isManualPassword}
                  onColor="red"
                  onTintColor="#00ff00"
                  onHandleColor="#f89722"
                  handleDiameter={34}
                  uncheckedIcon={false}
                  checkedIcon={false}
                  boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                  activeBoxShadow="0px 3px 7px 0 rgba(9, 46, 51, 0.35)"
                  height={34}
                  width={60}
                  onHandleColor="#3a5199"
                    onColor="#d8d8d8"
                    offColor="#d8d8d8"
                  className="react-switch"
                  id="material-switch"
                />
              </label>

              <div className="form-group pb-2">
                <label className="mt-3 pb-2 strong">
                  Password
                </label>

                <input
                  hidden={ !this.state.isManualPassword ?  true : false }
                  id="chiperPassword"
                  name="chiperPassword"
                  onChange={this.handleChange}
                  className="form-control inputClass"
                  type="password"
                  placeholder="Insert password to encrypt your data"
                  required={this.state.isManualPassword ?  true : false }
                  >
                </input>
              </div>
              <p>
                To submit connect with MetaMask
              </p>
              <div className="form-group">
                <input
                  type="submit"
                  value="Connect with MetaMask"
                  className="btn btn-lg btnStyle" />
              </div>
            </form>
          </div>
        );
      }
    }else{
      return (
        <div class="text-center">
          <SweetAlert
            show={this.state.popupLogout}
            title="User logged out?"
            text="Please login your account at MetaMask and try again!"
            confirmButtonColor = "#17a4b1"
            />
            <p>
              Login to your MetaMask to associate your Ethereum Wallet and refresh the page.
            </p>
            <p>
              <a href="https://metamask.io/">
                <button type="button" class="btn btn-block btn-lg btnStyle">Download MetaMask</button>
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
  }else {
    return (
      <div class="text-center">
        <form onSubmit={this.handleSubmit} >
          <div className="pb-2  medium-title ">
            Don’t have MetaMask plug in installed?
          </div>

          <p>
            <a href="https://metamask.io/">
              <button type="button" class="btn btn-block btn-lg btnStyle">Download MetaMask</button>
            </a>
          </p>
          <p>
            <a href="https://metamask.io/"  >
              <div className="text-blue medium-title">
              What is MetaMask?
              </div>
            </a>
          </p>
        </form>
      </div>
     );
    }
   }
}

export default ImportForm;
