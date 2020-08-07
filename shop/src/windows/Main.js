import React from 'react';
import './styles/Main.css';
import SideBar from '../components/SideBar';

import bill from '../resources/bill.svg';
import inventory from '../resources/inventory.svg';
import loan from '../resources/loan.svg';

import TopBar from '../components/TopBar';

class Main extends React.Component{
  constructor(props){
    super(props);
    this.state={
      username : props.location.state ? props.location.state.username : 'ruben4181',
      showNav : false
    }
    this.goToInventory = this.goToInventory.bind(this);
    this.goToBilling = this.goToBilling.bind(this);
    this.showMenu = this.showMenu.bind(this);
    this.goToLoans = this.goToLoans.bind(this);
  }
  render(){
    return(
      <div class="Main-Window">
        <SideBar onHide={()=>{this.setState({showNav : !this.state.showNav})}}
          showNav={this.state.showNav}/>
        <TopBar searchOn={true} history={this.props.history} menu={this.showMenu}
        username={this.state.username}/>
        <div class="Main-Body">
          <div class="Main-CardSelection" onClick={this.goToBilling}>
            <div class="Main-CardSelection-Image">
              <img src={bill} className="photo" alt="Bill"/>
            </div>
            <div class="Main-CardSelection-Body">
              <h3 className="CardSelection-Body-Title">Facturación</h3>
              <p>Registra una nueva venta, revisa las facturas anteriores, rectifica alguna factura, etc...</p>
            </div>
            <div className="Main-CardSelection-Button-Div">
              <button className="Main-CardSelection-Button">Entrar</button>
            </div>
          </div>
          <div class="Main-CardSelection" onClick={this.goToInventory}>
            <div class="Main-CardSelection-Image">
              <img src={inventory} className="photo" alt="Inventory"/>
            </div>
            <div class="Main-CardSelection-Body">
              <h3 className="CardSelection-Body-Title">Inventario</h3>
              <p>Agrega o actualiza un producto del inventario</p>
            </div>
            <div className="Main-CardSelection-Button-Div">
              <button className="Main-CardSelection-Button">Entrar</button>
            </div>
          </div>
          <div class="Main-CardSelection" onClick={this.goToLoans}>
            <div class="Main-CardSelection-Image">
              <img src={loan} className="photo" alt="Loan"/>
            </div>
            <div class="Main-CardSelection-Body">
              <h3 className="CardSelection-Body-Title">Creditos</h3>
              <p>Crea un nuevo credito o registra un abono a uno activo</p>
            </div>
            <div className="Main-CardSelection-Button-Div">
              <button className="Main-CardSelection-Button">Entrar</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  goToLoans(event){
    this.props.history.push('/loans', {
      username : this.state.username
    });
  }

  goToBilling(event){
    this.props.history.push('/billing', {
      username : this.state.username
    });
  }

  showMenu(event){
    event.preventDefault();
    this.setState({showNav:!this.state.showNav})
  }

  goToInventory(event){
    event.preventDefault();
    this.props.history.push('/inventory', {
      username : this.state.username
    });
  }
}

export default Main;
