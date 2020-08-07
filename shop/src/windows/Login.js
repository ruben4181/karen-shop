import React from 'react';
import './styles/Login.css';
import TopBar from '../components/TopBar';
import axios from 'axios';

class Login extends React.Component{
  constructor(props){
    super(props);
    this.state={
      username : '',
      password : ''
    }
    this.checkLoggin = this.checkLoggin.bind(this);
  }
  render(){
    return(
      <div className="Login-Window">
        <TopBar searchBar={false}/>
        <div className="Login-Body">
          {this.loginForm()}  
        </div>
      </div>
    );
  }
  loginForm(){
    return(
      <div className="Login-Form">
        <h5 className="Login-Form-Title">Inicio de sesión</h5>
        <form onSubmit={this.checkLoggin}>
          <input type="text" placeholder="Nombre de usuario"className="Login-Form-TextInput"
          value={this.state.username} onChange={(event)=>{this.setState({username:event.target.value})}}
          /><br/>
          <input type="password" placeholder="Contraseña"className="Login-Form-TextInput"
          value={this.state.password} onChange={(event)=>{this.setState({password:event.target.value})}}
          /><br/>
          <input type="submit" className="Login-Form-Button" onClick={this.checkLoggin} value={"Iniciar sesion"}/>
        </form>
      </div>
    );
  }
  checkLoggin(event){
    event.preventDefault();
    let config = {
      method : 'POST',
      url : 'http://localhost:3001/verifyUser',
      data : {
        user : this.state.username,
        password : this.state.password
      }
    }
    axios(config).then((resp)=>{
      if(resp.data.result==='OK'){
        this.props.history.push('/main', {
          username : this.state.username
        });
      } else{
        alert('Usuario/contraseña incorrectos, intente de nuevo');
      }
    }).catch((err)=>{
      alert(err);
    });
  }
}

export default Login;