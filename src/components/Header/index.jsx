import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import 'whatwg-fetch';
import auth from '../../utils/auth';
import logo from '../../assets/img/logo.png';

function isAuthenticated() {
	var token = auth.getToken();
 	return  (token !== null);
  }

class Header extends Component {
  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
  }

  

  logout() {
	auth.clearAppStorage();
	fetch('https://neotracker.eu/logout')
      .then(function (){
        location.href = "/";
      });
	
  }

  dappinfo() {
	alert("NEO Tracker is a dApp on the nOS Virtual Operating System that helps users track addresses on the NEO blockchain. To start, you first need to connect with our Telegram bot. Once you have your credentials you can come back to the dApp and log in. Now simply add a wallet address or if you are connected to the nOS client just add your nOS wallet with one click. That’s it! From now on every time a transaction is sent from or received by a tracked address, our bot will send you a message on Telegram. Use NOS-NEO Tracker to get notified when you receive your ICO tokens or when someone hacked you and is stealing the funds.");
  }  
  

  render() {
    let logout_button;
    let login_button;
	let logo_link = "/";

    if (isAuthenticated()) {
      logout_button = <Link to="#" className="logout-button" onClick={() => this.logout()}>Logout</Link>
	  logo_link = "/wallets"
    }
    else{
      login_button = <Link to="/">Login</Link>
    }
	
	
    return (
	   <header>
	    <nav>
	      <div className="logo"><Link to={logo_link}><img src={logo} /></Link></div>
		  <div className="row ">
			  <div>Track your NEO wallet activity</div>
			  <div><Link to="#" onClick={() => this.dappinfo()}>More info about this dApp</Link></div>
		  </div>
	      <div className="row logout-row">
			{logout_button}
		  </div>
	    </nav>
	  </header>
    );
  }
}
export default Header;
