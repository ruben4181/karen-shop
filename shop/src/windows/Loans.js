import React from 'react';
import './styles/Loan.css';
import SideBar from '../components/SideBar';
import TopBar from '../components/TopBar';
import axios from 'axios';

class Loans extends React.Component{
  constructor(props){
    super(props);
    this.state={
      showNav : false,
      username : props.location.state ? props.location.state.username : 'ruben4181' || 'ruben4181',
      value : '',
      loans : [],
      filtered : []
    }
    this.renderLoans = this.renderLoans.bind(this);
    this.getLoans = this.getLoans.bind(this);
    this.showMenu = this.showMenu.bind(this);
    this.getLoans();
  }

  render(){
    return(
      <div className="Inventory-Window">
        <SideBar onHide={()=>{this.setState({showNav : !this.state.showNav})}}
          showNav={this.state.showNav} history={this.props.history}
          username={this.state.username}/>
        <div className="Header">
          <TopBar searchOn={true} history={this.props.history} menu={this.showMenu}
          username={this.state.username}/>
        </div>
        <div className="Inventory-Display">
          <div className="Display-Title-Container">
            <div className="Bill-Title-Container">
              <div className="Filter-Left">
                <h4 className="Display-Title-Text">Creditos</h4>
              </div>
              <div className="Filter-Right">
                <input type="text" className="AddProduct-TextField-Together" 
                value={this.state.value}
                onChange={this.onFilterChanging}
                placeholder="Buscar credito"/>
              </div>
            </div>
          </div>
          <div className="Bill-Container">
            {this.renderLoans()}
          </div>
        </div>
      </div>
    )
  }
  showMenu(event){
    event.preventDefault();
    this.setState({showNav:!this.state.showNav})
  }

  getLoans(){
    axios.get('http://localhost:3001/loans').then((resp)=>{
      if(resp.data){
        this.setState({
          loans : resp.data,
          filtered : resp.data
        });
      }
    }).catch((err)=>{
      window.electron.dialog.showMessageBoxSync({type:"none", 
          message : 'Error al obtener los creditos', buttons : ["ok"]});
    });
  }

  renderLoans(){
    let loans = this.state.filtered;
    const items = [];
    for(let i=0; i<loans.length; i++){
      items.push(
        <div className="Bills-Item" key={i} onClick={
          (event)=>{
            event.preventDefault();
            this.props.history.push('/loan', {
              id : loans[i].id
            });
          }
          }>
          <div className="Bills-Item-Col1">
            <b style={{margin : '1%'}}>{loans[i].id}</b>
          </div>
          <div className="Bills-Item-Col2">
            <b style={{margin : '1%'}}>{loans[i].client.name}</b>
            <b style={{margin : '1%'}}>{loans[i].client.DNI}</b>
          </div>
          <div className="Bills-Item-Col3">
            <b style={{margin : '1%'}}>Total: ${ loans[i].total} </b>
            <b style={{margin : '1%'}}>Fecha: {loans[i].date} </b>
          </div>
        </div>
      );
    }
    return items;
  }
}

export default Loans;
