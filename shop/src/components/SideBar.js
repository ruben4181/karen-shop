import React from 'react';
import SideNav from 'react-simple-sidenav';
import './styles/SideBar.css';

class SideBar extends React.Component{
  constructor(props){
    super(props)
    this.state={
      username : props.username || 'ruben4181',
      history : props.history,
      type : props.type
    }
    this.goToUsers = this.goToUsers.bind(this);
  }

  render(){
    return(
      <div>
        <SideNav
          showNav={this.props.showNav}
          onHideNav = {()=>{this.props.onHide()}}
          title={<div>{this.props.username}</div>}
          items={this.renderMenuItems()}
          itemStyle={{'padding' : '0px'}}
          openFromRight={false}
          titleStyle={{'backgroundColor' : '#ff4d4d'}}
          />
      </div>
    )
  }

  goToUsers(choice){
    let choices = ['add-user', 'del-user', 'change-password'];
    if(this.state.type){
      this.state.type(choices[choice]);
    }
    this.state.history.push('/users', {
      username : this.state.username,
      type:choices[choice]
    });
  }

  renderMenuItems(){
    const items=[
      <div className="MenuItem-Container" onClick={(event)=>{this.goToUsers(0)}}>
        <div className="MenuItem-Icon">
          <img className="MenuItem-Icon-Image" 
          src={require('../resources/add-user.svg')} alt="add-user"/>
        </div>
        <div className="MenuItem-Text">
          Agregar usuario
        </div>
      </div>,
      <div className="MenuItem-Container" onClick={(event)=>{this.goToUsers(1)}}>
        <div className="MenuItem-Icon">
          <img className="MenuItem-Icon-Image" 
          src={require('../resources/del-user.svg')} alt="del-user"/>
        </div>
        <div className="MenuItem-Text">
          Eliminar usuario
        </div>
      </div>,
      <div className="MenuItem-Container" onClick={(event)=>{this.goToUsers(2)}}>
        <div className="MenuItem-Icon">
          <img className="MenuItem-Icon-Image" 
          src={require('../resources/change-password.svg')} alt="change-password"/>
        </div>
        <div className="MenuItem-Text">
          Cambiar contraseña
        </div>
      </div>,
      <div className="MenuItem-Container">
        <div className="MenuItem-Icon">
          <img className="MenuItem-Icon-Image" 
          src={require('../resources/log-out.svg')} alt="log-out"/>
        </div>
        <div className="MenuItem-Text">
          Cerrar sesión
        </div>
      </div>
    ]
    return items;
  }
}

export default SideBar
