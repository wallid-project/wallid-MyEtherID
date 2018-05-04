import React, { Component } from "react";
import { HashRouter } from 'react-router-dom'
import { Route } from 'react-router'
import { NavLink } from 'react-router-dom'

import Home from './Home';
import Store from './Store';
import View from './View';
import Transactions from './Transactions';
import Help from './Help';
import Footer from './Footer';

class Main extends Component {
  state = {
    navCollapsed: true
  }
  onToggleNav = () => {
    this.setState({ navCollapsed: !this.state.navCollapsed })
  }
  closeNav = () => {
    this.setState({ navCollapsed: true });
  }

  render() {
    return (
      <HashRouter>
        <div>
          <header>
            <div class="container">
              <nav class="navbar navbar-expand-md fixed-top">
                <a class="navbar-brand" href="index.html">
                  <img class="logoHeader" src={require('./img/myetherid-logo.svg')} alt="MyEther ID Logo" />
                </a>
                <button class="navbar-toggler" type="button"
                  onClick={this.onToggleNav}>
                  <span class="navbar-toggler-icon"></span>
                </button>
                <div className={(this.state.navCollapsed ? 'collapse' : '') + ' navbar-collapse'}>
                  <ul class="navbar-nav ml-auto">
                    <li class="nav-link">
                      <NavLink exact to="/" onClick={this.closeNav}>Home Page</NavLink>
                    </li>
                    <li class="nav-link">
                      <NavLink to="/store" onClick={this.closeNav}>Store Identity</NavLink>
                    </li>
                    <li class="nav-link">
                      <NavLink to="/view" onClick={this.closeNav}>View Identities</NavLink>
                    </li>
                    <li class="nav-link">
                      <NavLink to="/transactions" onClick={this.closeNav}>Transactions</NavLink>
                    </li>
                    <li class="nav-link">
                      <NavLink to="/help" onClick={this.closeNav}>Help</NavLink>
                    </li>
                  </ul>
                </div>
              </nav>
            </div>
          </header>
          <div className="content">
            <Route exact path="/" component={Home}/>
            <Route path="/store" component={Store}/>
            <Route path="/view" component={View}/>
            <Route path="/transactions" component={Transactions}/>
            <Route path="/help" component={Help}/>
          </div>
          <Footer />
        </div>
      </HashRouter>
    );
  }
}

export default Main;
