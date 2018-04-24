import React, { Component } from "react";
//import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
// products will be presented by react-bootstrap-table
/*var products = [{
  Service: "CrediBank",
  Entity: "Portuguese Republic",
  Card: "Cartão de Cidadão",
  Attributes: "Identity, Address",
  SCaddress: "9h8gj79x9h8gj79x",
  TransactionDate: " 21 Jan 18"
},
{
  Service: "CarRENT",
  Entity: "Ord. Advg.",
  Card: "Ballot",
  Attributes: "Identity",
  SCaddress: "8htr1d998htr1d99",
  TransactionDate: "16 Fev 18"
}
];*/
class List extends Component {
  render() {
    return (
      <main role="main" class="container">
        <div class="row justify-content-md-center">
            <div class="col text-center">
                <h1>List the transactions of your identities</h1>
            </div>
        </div>
        <div class="row pt-2">
            <div class="col text-center">
                <p>Check the transaction history at Etherscan,
                  pressing <a href="https://rinkeby.etherscan.io/address/0x82209352470b2f22f5a6874790114d5651a75285"
                  target="_blank rel=noopener">here</a>.</p>
            </div>
        </div>
        <div class="row pb-3 containerBorderBottom">
            <div class="col">
                <div class="row">
                    <div class="col">
                        <div class="text-center">
                            <img class="img-fluid imgTransaction" src={require('./img/blockchain.svg')} alt="Blockchain Transation" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
      {/*<br />
          <div class="form-group">
            <label>Paste an Ether wallet public address below to check its transaction history</label>
            <input type="password" name="password" onChange={this.handleChange} class="form-control" placeholder="Ether wallet public address" required />
          </div>
          <br />
        <BootstrapTable
          data={products}
          hover
          condensed
          pagination
          search
          >
          <TableHeaderColumn dataField="Service" width='20%'>Service</TableHeaderColumn>
          <TableHeaderColumn dataField="Entity" width='20%' isKey={true}>Entity</TableHeaderColumn>
          <TableHeaderColumn dataField="Card" width='15%'>Card</TableHeaderColumn>
          <TableHeaderColumn dataField="Attributes" width='15%'>Attributes</TableHeaderColumn>
          <TableHeaderColumn dataField="SCaddress" width='15%'>SC Address</TableHeaderColumn>
          <TableHeaderColumn dataField="TransactionDate" width='15%'>Transaction Date</TableHeaderColumn>
        </BootstrapTable>*/}
      </main>
    );
  }
}

export default List;