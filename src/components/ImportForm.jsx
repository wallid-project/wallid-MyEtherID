import React from "react";
import Web3 from 'web3'
import BlockIdContract from '../blockid/BlockId.js';
var CryptoJS = require("crypto-js");

window.addEventListener('reload', function () {
  if(typeof web3 !== 'undefined'){
    console.log("Using web3 detected from external source like Metamask")
    window.web3 = new Web3(window.web3.currentProvider)
  }else{
    console.log("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
  }
});

class ImportForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      walletAddress: '',
      password: '20THIS_WILL_USE_METAMASK_SECURITY18',
      passwordCheck: '20THIS_WILL_USE_METAMASK_SECURITY18',
      data: '',
      ContractAddress : '0x82209352470b2f22f5a6874790114d5651a75285',
      ContractInstance : null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    if(window.web3){
      const MyContract = window.web3.eth.contract(BlockIdContract.abi)
      this.state.ContractInstance = MyContract.at(this.state.ContractAddress)

      this.state.ContractInstance.countItemList( (err, data) => {
        console.log('Count items :  ', data);
        console.log('total items #', data.c[0] );
      });
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
       alert('User logged out? Please login your account at metamask and try again!')
     }
     else {
       console.log("User is logged in to MetaMask");
       self.state.isUserLogged = 1;
     }
     self.forceUpdate()
   });
 }

  hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 2; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
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
    console.log("handleSucess");
    console.log('WalletAddress :' + this.state.walletAddress);
    //console.log('Password : ' + this.state.password);
    //console.log('Password Check : ' + this.state.passwordCheck);
    console.log('Data :' + this.state.data);

    var obj = {};
    try {
      obj = JSON.parse(this.state.data);
      var idAttr = CryptoJS.AES.encrypt(JSON.stringify( obj.id_attributes), this.state.password).toString();
      var address =  CryptoJS.AES.encrypt( JSON.stringify( obj.address_attributes), this.state.password).toString();

      console.log('Encrypt idAttr ', idAttr  );
      console.log('Encrypt address ', address );

      this.state.ContractInstance.addInfo( idAttr ,  address , (err, data) => {
        console.log('add info result is ', data);
      });

    }
    catch(err) {
      alert("ID Data format error. Please copy all data from ImportID")
    }

    return;
  }

  handleSubmit(event) {
    console.log("handleSubmit");
    if(this.state.password === this.state.passwordCheck){
      this.handleSucess()
    //   fetch('https://blockid.caixamagica.pt/api/store', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: this.state.data
    //   })
    //   .then(this.handleErrors)
    //   .then(response => this.handleSucess(response) )
    //   .catch(error => {
    //     console.log(error)
    //     alert("Store BlockID Fail. Please check the internet connection.")
    //
    //   }
    // );
  }else{
    alert("Password and comfirm password is not the same")
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
      return (
        <form onSubmit={this.handleSubmit} >
          <div class="form-group">
            <label>
              Identity document:
            </label>
            <select class="form-control" required>
              <option value="grapefruit">
                Cartão do Cidadão - República Portuguesa
              </option>
            </select>
          </div>
          {/*<div class="form-group">
            <label>
              BlockID Encryption Password
            </label>
            <p>
              <a href="/">
                What is BlockID Encrytion Password?
              </a>
            </p>
            <div class="row ">
              <div class="col-md-6">
                <input
                  type="password"
                  name="password"
                  onChange={this.handleChange}
                  class="form-control"
                  placeholder="Create the password to encrypt and later decrypt your certified ID attributes"
                  required />
              </div>
              <div class="col-md-6">
                <input
                  type="password"
                  name="passwordCheck"
                  onChange={this.handleChange}
                  class="form-control"
                  placeholder="Confirm the password to encrypt and later decrypt your certified ID attributes"
                  required />
              </div>
            </div>
          </div>*/}
          <div class="form-group">
            <label>
              ID Data:
            </label>
            <textarea
              id="importData"
              name="data"
              onChange={this.handleChange}
              class="form-control"
              rows="5"
              placeholder="Paste your ID Data provided by BlockID’s Import ID App"
              required>
            </textarea>
          </div>
          <p>
            To submit connect with Metamask
          </p>
          <div class="form-group">
            <input
              type="submit"
              value="Connect with metamask" />
            </div>
          </form>
        );
  }else{
    return (
      <div>
        <h2>
          Select your identity type
        </h2>
        <form onSubmit={this.handleSubmit} >
          <div class="form-group">
            <label>
              Select identity type:
            </label>
            <select class="form-control" required>
              <option value="grapefruit">
                Cartão do Cidadão - República Portuguesa
              </option>
            </select>
          </div>
          <p>
            Login to your metamask to associate your ether wallet and refresh the page
          </p>
          <p>
            <a href="https://metamask.io/">
              What is Metamask?
            </a>
          </p>
        </form>
      </div>
    );
  }
  }else {
    return (
      <div>
        <h2>
          Select your identity type
        </h2>
        <form onSubmit={this.handleSubmit} >
          <div class="form-group">
            <label>
              Select identity type:
            </label>
            <select class="form-control" required>
              <option value="grapefruit">
                Cartão do Cidadão - República Portuguesa
              </option>
            </select>
          </div>
          <p>
            Don’t have memaskt plug in installed?
          </p>
          <p>
            <a href="https://metamask.io/">
            Download metamask here
            </a>
          </p>
          <p>
            <a href="https://metamask.io/">
              What is Metamask?
            </a>
          </p>
        </form>
      </div>
    );
  }
}
/*render() {
  return (
    <form onSubmit={this.handleSubmit} >
      <div class="form-group">
        <label>
          Identity document:
        </label>
        <select class="form-control" required>
          <option value="grapefruit">
            Cartão do Cidadão - República Portuguesa
          </option>
        </select>
      </div>
      <div class="form-group">
        <label>
          BlockID Encryption Password
        </label>
        <p>
          <a href="/">
            What is BlockID Encrytion Password?
          </a>
        </p>
        <div class="row ">
          <div class="col-md-6">
            <input
              type="password"
              name="password"
              onChange={this.handleChange}
              class="form-control"
              placeholder="Create the password to encrypt and later decrypt your certified ID attributes"
              required />
          </div>
          <div class="col-md-6">
            <input
              type="password"
              name="passwordCheck"
              onChange={this.handleChange}
              class="form-control"
              placeholder="Confirm the password to encrypt and later decrypt your certified ID attributes"
              required />
          </div>
        </div>
      </div>
      <div class="form-group">
        <label>
          ID Data:
        </label>
        <textarea
          id="importData"
          name="data"
          onChange={this.handleChange}
          class="form-control"
          rows="5"
          placeholder="Paste your ID Data provided by BlockID’s Import ID App"
          required>
        </textarea>
      </div>
      <p>
        To submit connect with Metamask
      </p>
      <div class="form-group">
        <input
          type="submit"
          value="Connect with metamask" /> Recommended action
          <p>
            <a href="https://metamask.io/">
              what is Metamask?
            </a>
          </p>
        </div>
      </form>
    );
  }*/
}

export default ImportForm;
