import React from 'react';
import './styles/Bill.css';
import SideBar from '../components/SideBar';
import TopBar from '../components/TopBar';
import axios from 'axios';

class Bill extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      showNav : false,
      username : props.location.state ? props.location.state.username : 'ruben4181',
      products : [],
      date : '',
      id : props.location.state.id,
      isLoan : false
    }
    this.renderProducts = this.renderProducts.bind(this);
    this.getBill = this.getBill.bind(this);
    this.renderIsLoan = this.renderIsLoan.bind(this);
    this.showMenu = this.showMenu.bind(this);
    this.getBill();
  }
  render(){
    return(
      <div className="Billing-Window">
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
              <h4 className="Display-Title-Text">{this.renderIsLoan()}</h4>
            </div>
            <div className="Bill-Date">
              <b>{this.state.date}</b>
            </div>
          </div>
          <div className="Bill-Container">
            <form onSubmit={this.handleScan}>
              <div className="Client-Container">
                <input className="Bill-TextField" type="text" placeholder="Nombre del cliente"
                  value={this.state.client} onChange={(event)=>{this.setState({client : event.target.value})}}/>
                <input className="Bill-TextField" type="text" placeholder="Número de documento del cliente"
                  value={this.state.clientID} onChange={(event)=>{this.setState({clientID : event.target.value})}}/>
              </div>
            </form>
            <div className="Bill-ProductList-Container">
              {this.renderProducts()}
            </div> 
          </div>
          {this.renderButtons()}
        </div>
      </div>
    );
  }

  showMenu(event){
    event.preventDefault();
    this.setState({showNav:!this.state.showNav})
  }

  renderIsLoan(){
    if(this.state.isLoan){
      return 'Factura a credito'
    } else{
      return(
        'Factura cancelada'
      )
    }
  }

  renderButtons(){
    if(this.state.products.length>0){
      return(
        <div className="Bill-Footer">
          <h4 className="Bill-Footer-Text">Total: ${this.state.total}</h4>
        </div>
      );
    }
  }

  getBill(){
    let config = {
      method : 'post',
      url : 'http://localhost:3001/bills',
      data : {
        filter : {
          id : this.state.id
        }
      }
    }
    axios(config).then((resp)=>{
      if(resp.data.length>0){
        this.setState({
          date : resp.data[0].date || 'YYYY-mm-DD',
          products : resp.data[0].items,
          client : resp.data[0].client.name,
          clientID : resp.data[0].client.DNI,
          total : resp.data[0].total,
          isLoan : resp.data[0].isLoan
        });
      } else{
        window.electron.dialog.showMessageBoxSync({type:"error", 
          message : "Hubo un error, intenta más tarde", buttons : ["ok"]});
      }
    }).catch((err)=>{
      console.log(err);
      window.electron.dialog.showMessageBoxSync({type:"info", 
          message : "Ocurrió un error al obtener las facturas\n"+err, buttons : ["ok"]});
    });
  }

  renderProducts(){
    let products = this.state.products;
    
    const items = [];
    for(let i=0; i<products.length; i++){
      items.push(
        <div className="Bill-ProductItem" key={i}>
          <div className="Bill-ProductItem-Col1">
            <b className="Bill-ProductName">{products[i].name}</b>
            <b className="Bill-ProductBrand">{products[i].brand}</b>
          </div>
          <div className="Bill-ProductItem-Col2">
            <b className="Bill-ProductContent">{products[i].content}</b>
          </div>
          <div className="Bill-ProductItem-Col3">
            <input className="Bill-ProductUnits" required value={this.state.products[i].unitsSelling}
              disabled
            />
            <b className="Bill-ProductValue">{products[i].price_out}</b>
          </div>
        </div>
      )
    }
    return items;
  }
}

export default Bill;