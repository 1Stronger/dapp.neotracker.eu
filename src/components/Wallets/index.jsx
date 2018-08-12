import React, { Component } from 'react';
import 'whatwg-fetch';
import deleteIcon from '../../assets/img/delete.svg';

class Wallets extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newaddress: "", newlabel: "",
      wallets: []
    };

	this.newNOSWallet = this.newNOSWallet.bind(this);
    this.newWallet = this.newWallet.bind(this);
    this.updateWallet = this.updateWallet.bind(this);
    this.deleteWallet = this.deleteWallet.bind(this);
    this.handleChangeWalletLabel = this.handleChangeWalletLabel.bind(this);
	this.handleChangeWalletAddress = this.handleChangeWalletAddress.bind(this);
    this._modifyWallet = this._modifyWallet.bind(this);
  }

  handleChangeWalletLabel(event) {
    this.setState({newlabel: event.target.value});
  }
  
  handleChangeWalletAddress(event) {
    this.setState({newaddress: event.target.value});
  }
  componentDidMount() {//
    fetch('https://neotracker.eu/api/wallets', { method: 'GET', credentials: 'include', headers: {'Content-Type':'application/json'}})
      .then(function(res){
	return res.json();
		})
      .then(json => {
        this.setState({
          wallets: json
        });
      });
  }

  newWallet() {
	  
	if (this.state.newaddress == null || this.state.newaddress == "" || this.state.newlabel == null || this.state.newlabel == ""){
		alert("Invalid Wallet Data");
		return false;
	}

    fetch('https://neotracker.eu/api/wallets/create', { method: 'POST', credentials: 'include', headers: {'Content-Type':'application/json'}, body: JSON.stringify({"address":this.state.newaddress, "label":this.state.newlabel})})
      .then(res => res.json())
      .then(json => {
        let data = this.state.wallets;
        data.push(json);
        this.setState({
          wallets: data
        });
      });
  }

  newNOSWallet() {
	 const nos = (window.NOS != null && window.NOS.V1 != null) ? window.NOS.V1 : null;
	 if (nos != null){
		 nos.getAddress().then((address) => {
			fetch('https://neotracker.eu/api/wallets/create', { method: 'POST', credentials: 'include', headers: {'Content-Type':'application/json'}, body: JSON.stringify({"address":address, "label":"NOS WALLET"})})
			  .then(res => res.json())
			  .then(json => {
				let data = this.state.wallets;
				data.push(json);
					this.setState({
				  wallets: data
				});
			  }); 
		 }).catch((err) => alert(`Error: ${err.message}`));
		 
	 }else{
		 alert("NOS Client not avaialable");
	 }
  }
  
  updateWallet(index) {
    const id = this.state.wallets[index]._id;

    fetch(`https://neotracker.eu/api/wallets/${id}/increment`, { method: 'PUT' })
      .then(res => res.json())
      .then(json => {
        this._modifyWallet(index, json);
      });
  }

  deleteWallet(index) {
    const address = this.state.wallets[index].address;

    fetch(`https://neotracker.eu/api/wallets/${address}`, { method: 'DELETE', credentials: 'include' })
      .then(_ => {
        this._modifyWallet(index, null);
      });
    }

    _modifyWallet(index, data) {
    let prevData = this.state.wallets;

    if (data) {
      prevData[index] = data;
    } else {
      prevData.splice(index, 1);
    }

    this.setState({
      wallets: prevData
    });
  }

  render() {
    return (
 	<div>
        <ul>
          { this.state.wallets.map((wallet, i) => (
            <li key={i}>
				<div className="wallet-row">
					<table>
						<tbody>
							<tr>
								<td className="table-col-label-wallet">{wallet.label}</td>
								<td className="table-col-delete-wallet"><button className="delete-wallet-button" onClick={() => this.deleteWallet(i)}><img className="delete-wallet-icon" src={deleteIcon} /></button></td>
							</tr>
							<tr>
								<td className="table-col-address-wallet" colSpan="2">{wallet.address}</td>
							</tr>
						</tbody>
					</table>
					
					<span></span>
					
				</div>
				
            </li>
          )) }
        </ul>
	<div className="wallet-row">
	   <span className="table-col-label-wallet">Enter new wallet </span>
	  <form onSubmit={this.newWallet}>
		<div className="row">
			<div className="input-field col s12">
				<input type="text" defaultValue="" placeholder="Wallet Label..." onChange={this.handleChangeWalletLabel} />
			</div>
		</div>
		<div className="row">
			<div className="input-field col s12">
				<input type="text" defaultValue="" placeholder="Wallet Address..." onChange={this.handleChangeWalletAddress} />
			</div>
		</div>
		
		</form>
		<div className="row create-wallet-row">
			<button className="create-wallet-button" onClick={() => this.newWallet()}>ADD WALLET</button>
		</div>
		<div className="row create-wallet-row">
			<button className="create-wallet-button" onClick={() => this.newNOSWallet()}>ADD NOS WALLET</button>
		</div>
	</div>
	</div>
    );
  }
}

export default Wallets;
