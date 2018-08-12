import React, { Component } from 'react';
import 'whatwg-fetch';
import auth from '../../utils/auth';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {username: '', password: ''};

    this.handleChangeUsername = this.handleChangeUsername.bind(this);
	this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeUsername(event) {
    this.setState({"username": event.target.value});
  }

  handleChangePassword(event) {
    this.setState({"password": event.target.value});
  }
  
  handleSubmit(event) {
    event.preventDefault();
	  fetch('https://neotracker.eu/login',{
	  credentials: 'include',
      method: 'post',
      redirect: 'follow',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(this.state)
    })
      .then(res => {
	if (res == null || res.ok == false) {
		alert ("Ivalid Username/Password")
	}
	else {
		 auth.setToken("userisauthenticated");		
		 location.href = "/wallets";
	}
      });
  }

  render() {
    return (
	<div className="row form-container">
	  <form className="login-form col s12" onSubmit={this.handleSubmit} >
	    <div className="account-info">Contact our <a href="https://t.me/mazniobot"> telegram bot here </a> to create account</div>
		<div className="row">
			<div className="input-field col s12">
				<input type="text" defaultValue={this.state.username} placeholder="Username..." onChange={this.handleChangeUsername} />
			</div>
		</div>
		<div className="row">
			<div className="input-field col s12">
				<input type="password" defaultValue={this.state.password} placeholder="Password..." onChange={this.handleChangePassword} />
			</div>
		</div>
		<input className="login-button" type="submit" value="LOG IN" />
		</form>
	</div>
    );
  }
}

export default Login;
