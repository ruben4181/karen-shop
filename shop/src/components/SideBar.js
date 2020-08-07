import React from 'react';
import SideNav from 'react-simple-sidenav';

class SideBar extends React.Component{
  render(){
    return(
      <div>
        <SideNav
          showNav={this.props.showNav}
          onHideNav = {()=>{this.props.onHide()}}
          title={<div>{this.props.username}</div>}
          items={this.renderMenuItems()}
          itemStyle={{'padding' : '0px', 'cursor' : 'none'}}
          openFromRight={false}
          titleStyle={{'backgroundColor' : '#ff4d4d'}}
          />
      </div>
    )
  }

  renderMenuItems(){
    const items=[
      <div className="MenuItem-Container">
        <div className="MenuItem-Icon">
          Icono
        </div>
        <div className="MenuItem-Text">
          Agregar usuario
        </div>
      </div>,
      <div className="MenuItem-Container">
        <div className="MenuItem-Icon">
          Icono
        </div>
        <div className="MenuItem-Text">
          Eliminar usuario
        </div>
      </div>,
      <div className="MenuItem-Container">
        <div className="MenuItem-Icon">
          Icono
        </div>
        <div className="MenuItem-Text">
          Cambiar contraseña
        </div>
      </div>,
      <div className="MenuItem-Container">
        <div className="MenuItem-Icon">
          Icono
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
