import React from 'react';
import './styles/TopBar.css';

class TopBar extends React.Component{
  constructor(props){
    super(props);
    this.state={
      searchOn : props.searchOn,
      search : '',
      history : props.history,
      menu : props.menu,
      username : props.username
    }
    this.renderTools = this.renderTools.bind(this);
    this.goBack = this.goBack.bind(this);
  }
  render(){
    return(
      <div className="TopBarContainer">
        <div className="TopBar-Title-Container">
          <h4 className="TopBarShopNameLabel">El Surtidor De La Belleza</h4>
        </div>
        {this.renderTools()}
      </div>
    )
  }
  renderTools(){
    const items = []
    let i=100;
    if(this.state.searchOn===true){
      i=i+1;
      items.push(
        <div className="TobBar-NavBar-Container" key={i}>
          <div className="TobBar-NavBar-Item1"
            onClick={(event)=>{this.props.history.push('/billing', {username : this.state.username})}}>
            <h5>Facturación</h5>
          </div>
          <div className="TobBar-NavBar-Item2"
            onClick={(event)=>{this.props.history.push('/inventory', {username : this.state.username})}}>
            <h5>Inventario</h5>
          </div>
          <div className="TobBar-NavBar-Item3"
            onClick={(event)=>{this.props.history.push('/loans', {username : this.state.username})}}>
            <h5>Creditos</h5>
          </div>
          <div className="TobBar-NavBar-Search">
            <form>
              <input type="text" placeholder="Buscar producto"
                className="NavBar-Search-Input"/>
            </form>
          </div>
        </div>
      );
      items.push(
        <div className="TobBar-Actions-Container" key={i*2}>
          <div className="TobBar-Actions-Back" onClick={this.goBack}>
            <img src={require('../resources/back.svg')} alt="Back"
              className="TobBar-Actions-BackIcon"/>
          </div>
          <div className="TobBar-Actions-User" onClick={this.props.menu}>
            <img src={require('../resources/menu.svg')} alt="Menu"
              className="TobBar-Actions-Icon"/>
          </div>
        </div>
      );
    }
    return items;
  }
  goBack(event){
    event.preventDefault();
    this.state.history.goBack();
  }
}

export default TopBar;
