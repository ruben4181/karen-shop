import React from 'react';
import './styles/Users.css';
import SideBar from '../components/SideBar';
import TopBar from '../components/TopBar';
import axios from 'axios';

class Users extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      showNav : false,
      password : 'contraseña',
      username : props.location.state ? props.location.state.username : 'ruben4181~' || 'ruben4181x',
      type : props.location.state ? props.location.state.type : 'add-user' || 'add-user',
      newUser : {username : '', password : '', passwordOk:''},
      changePass : {password : '', passwordOK:'', passwordOld : ''},
      delUser : {username:'', usernameOK : ''}
    }
    this.showMenu = this.showMenu.bind(this);
    this.getTitle = this.getTitle.bind(this);
    this.renderAddUser = this.renderAddUser.bind(this);
    this.renderDelUser = this.renderDelUser.bind(this);
    this.renderChangePassword = this.renderChangePassword.bind(this);
    this.setType = this.setType.bind(this);
    this.onAddUser = this.onAddUser.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onDelUser = this.onDelUser.bind(this);
  }
  render(){
    return(
      <div className="Inventory-Window">
        <SideBar onHide={()=>{this.setState({showNav : !this.state.showNav})}}
          showNav={this.state.showNav} history={this.props.history}
          type={this.setType}
          username={this.state.username}/>
        <div className="Header">
          <TopBar searchOn={true} history={this.props.history} menu={this.showMenu}
          username={this.state.username}/>
        </div>
        <div className="Inventory-Display">
          <div className="Display-Title-Container">
            <div className="Inventory-Title-Container">
              <h4 className="Display-Title-Text">{this.getTitle()}</h4>
            </div>
          </div>
          {this.renderAddUser()}
          {this.renderDelUser()}
          {this.renderChangePassword()}
        </div>
      </div>
    )
  }

  setType(choice){
    this.setState({
      type : choice,
      showNav : false
    });
  }

  getTitle(){
    let title=""
    if(this.state.type==="add-user"){
      title="Agregar usuario";
    } else if(this.state.type==="del-user"){
      title="Eliminar usuario";
    } else{
      title="Cambiar contraseña"
    }
    return title;
  }
  showMenu(event){
    event.preventDefault();
    this.setState({showNav:!this.state.showNav})
  }

  renderAddUser(){
    if(this.state.type==='add-user'){
      return(
        <div className="Add-User-Display">
          <form className="User-Form" onSubmit={this.onAddUser}>
            <input required type="text" className="User-Name-TextField" placeholder="Nombre de usuario"
            value={this.state.newUser.username}
            onChange={(e)=>{
              let user = this.state.newUser;
              user.username = e.target.value;
              this.setState({
                newUser : user
              });
            }}/>
            <input required type="password" className="User-Name-TextField" placeholder="Contraseña"
            value={this.state.newUser.password}
            onChange={(e)=>{
              let user = this.state.newUser;
              user.password = e.target.value;
              this.setState({
                newUser : user
              });
            }}/>
            <input required type="password" className="User-Name-TextField" placeholder="Repita contraseña"
            value={this.state.newUser.passwordOk}
            onChange={(e)=>{
              let user = this.state.newUser;
              user.passwordOk = e.target.value;
              this.setState({
                newUser : user
              });
            }}/>
            <input type="submit" className="Accept-Button" value="Agregar usuario"/>
          </form>
        </div>
      );
    }
  }

  onAddUser(event){
    event.preventDefault();
    if(this.state.newUser.password===this.state.newUser.passwordOk){
      let config = {
        method : 'post',
        url : 'http://localhost:3001/createUser',
        data : {
            user : this.state.newUser.username,
            password : this.state.newUser.password
        }
      }
      axios(config).then((resp)=>{
        if(resp.data.result==='OK'){
          window.electron.dialog.showMessageBoxSync({type:"info", 
          message : 'Usuario creado correctamente', buttons : ["ok"]});
          this.props.history.go();
        } else{
          window.electron.dialog.showMessageBoxSync({type:"info", 
          message : 'No se pudó crear el usuario o ya existe', buttons : ["ok"]});
        }
      }).catch((err)=>{
        window.electron.dialog.showMessageBoxSync({type:"info", 
          message : 'Error al crear el usuario\n'+err, buttons : ["ok"]});
      })
    } else{
      window.electron.dialog.showMessageBoxSync({type:"info", 
          message : 'Contraseñas no coinciden, intente de nuevo', buttons : ["ok"]});
      this.props.history.go();
    }
  }

  renderChangePassword(){
    if(this.state.type==='change-password'){
      return(
        <div className="Add-User-Display">
          <form className="User-Form" onSubmit={this.onChangePassword}>
            <input required type="password" className="User-Name-TextField" placeholder="Contraseña actual"
            value={this.state.changePass.passwordOld}
            onChange={ (e) =>{
              let changePass = this.state.changePass;
              changePass.passwordOld = e.target.value;
              this.setState({
                changePass
              });
            }}/>
            <input required type="password" className="User-Name-TextField" placeholder="Nueva contraseña"
            value={this.state.changePass.password}
            onChange={
              (e)=>{
                let changePass = this.state.changePass;
                changePass.password = e.target.value;
                this.setState({
                  changePass
                });
              }
            }/>
            <input required type="password" className="User-Name-TextField" placeholder="Repite nueva contraseña"
            value={this.state.changePass.passwordOK}
            onChange={
              (e)=>{
                let changePass = this.state.changePass;
                changePass.passwordOK=e.target.value;
                this.setState({
                  changePass
                })
              } 
            }/>
            <input required type="submit" className="Accept-Button" value="Cambiar Contraseña"/>
          </form>
        </div>  
      )
    }
  }

  onChangePassword(e){
    e.preventDefault();
    if(this.state.changePass.password===this.state.changePass.passwordOK){
      let config = {
        method : 'post',
        url : 'http://localhost:3001/updatePassword',
        data : {
          user : this.state.username,
          password : this.state.changePass.password
        }
      }
      axios(config).then((resp)=>{
        if(resp.data.result === 'OK'){
          window.electron.dialog.showMessageBoxSync({type:"info", 
          message : 'Contraseña cambiada correctamente', buttons : ["ok"]});
          this.props.history.go();
        } else{
          window.electron.dialog.showMessageBoxSync({type:"info", 
          message : 'La contraseña no fue actualizada', buttons : ["ok"]});
        }
      }).catch((err)=>{
        window.electron.dialog.showMessageBoxSync({type:"info", 
          message : 'Error al cambiar la contraseña\n'+err, buttons : ["ok"]});
      });
    } else{
      window.electron.dialog.showMessageBoxSync({type:"info", 
          message : 'Contraseña nueva no coincide, intente de nuevo', buttons : ["ok"]});
    }
  }

  renderDelUser(){
    if(this.state.type==='del-user'){
      return(
        <div className="Add-User-Display">
          <form className="User-Form" onSubmit={this.onDelUser}>
            <input required type="text" className="User-Name-TextField" placeholder="Escribe nombre de usuario a eliminar"
            value={this.state.delUser.username}
            onChange={(e)=>{
              let delUser = this.state.delUser;
              delUser.username=e.target.value;
              this.setState({
                delUser
              });
            }}/>
            <input required type="text" className="User-Name-TextField" placeholder="Repite el nombre de usuario a eliminar"
            value={this.state.delUser.usernameOK} 
            onChange={(e)=>{
              let delUser = this.state.delUser;
              delUser.usernameOK = e.target.value;
              this.setState({
                delUser
              });
            }}/>
            <input type="submit" className="Accept-Button" value="Eliminar Usuario"/>
          </form>
        </div>
      )
    }
  }

  onDelUser(e){
    e.preventDefault();
    if(this.state.delUser.username===this.state.delUser.usernameOK){
      let config = {
        method : 'get',
        url : 'http://localhost:3001/deleteUser',
        params : {
          user : this.state.delUser.username
        }
      }
      axios(config).then((resp)=>{
        if(resp.data.result==='OK'){
          window.electron.dialog.showMessageBoxSync({type:"info", 
          message : 'Usuario eliminado correctamente', buttons : ["ok"]});
        } else{
          window.electron.dialog.showMessageBoxSync({type:"info", 
          message : 'No se eliminó al usuario', buttons : ["ok"]});
        }
      }).catch((err)=>{
        window.electron.dialog.showMessageBoxSync({type:"info", 
          message : 'Error al eliminar el usuario\n'+err, buttons : ["ok"]});
      })
    } else{
      window.electron.dialog.showMessageBoxSync({type:"info", 
          message : 'Los nombres no coinciden, intente de nuevo', buttons : ["ok"]});
    }
  }
}

export default Users;