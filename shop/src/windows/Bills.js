import React from 'react';
import './styles/Bills.css';
import SideBar from '../components/SideBar';
import TopBar from '../components/TopBar';
import axios from 'axios';

class Bills extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      showNav : false,
      username : props.location.state ? props.location.state.username : 'ruben4181' || 'ruben4181',
      bills : [],
      filter: '',
      filtered : []
    }
    this.renderBills = this.renderBills.bind(this);
    this.getBills = this.getBills.bind(this);
    this.filterBills = this.filterBills.bind(this);
    this.onFilterChanging = this.onFilterChanging.bind(this);
    this.showMenu = this.showMenu.bind(this);
    this.getBills();
  }
  render(){
    return(
      <div className="Bills-Window">
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
                <h4 className="Display-Title-Text">Facturas</h4>
              </div>
              <div className="Filter-Right">
                <input type="text" className="AddProduct-TextField-Together" 
                value={this.state.value}
                onChange={this.onFilterChanging}
                placeholder="Buscar factura"/>
              </div>
            </div>
          </div>
          <div className="Bill-Container">
            {this.renderBills()}
          </div>
        </div>
      </div>
    );
  }

  showMenu(event){
    event.preventDefault();
    this.setState({showNav:!this.state.showNav})
  }

  onFilterChanging(event){
    this.setState({
      filter : event.target.value
    }, ()=>{
      this.filterBills(this.state.filter);
    })
  }

  renderBills(){
    let bills = this.state.filtered;
    const items = [];
    for(let i=0; i<bills.length; i++){
      items.push(
        <div className="Bills-Item" key={i} onClick={
          (event)=>{
            event.preventDefault();
            this.props.history.push('/bill', {
              id : bills[i].id,
              username : this.state.username
            });
          }
          }>
          <div className="Bills-Item-Col1">
            <b style={{margin : '1%'}}>{bills[i].id}</b>
          </div>
          <div className="Bills-Item-Col2">
            <b style={{margin : '1%'}}>{bills[i].client.name}</b>
            <b style={{margin : '1%'}}>{bills[i].client.DNI}</b>
          </div>
          <div className="Bills-Item-Col3">
            <b style={{margin : '1%'}}>Articulos: { bills[i].items.length }</b>
            <b style={{margin : '1%'}}>Total: ${ bills[i].total} </b>
            <b style={{margin : '1%'}}>Fecha: {bills[i].date} </b>
          </div>
        </div>
      );
    }
    return items;
  }

  filterBills(value){
    let bills = this.state.bills;
    let filter = []
    console.log(bills);
    for(let i=0; i<bills.length; i++){
      if(bills[i].id.toLowerCase().includes(value.toLowerCase()) || bills[i].client.name.toLowerCase().includes(value.toLowerCase())
      ||bills[i].client.DNI.includes(value)){
        filter.push(bills[i]);
      }
    }
    this.setState({
      filtered : filter
    });
  }

  getBills(){
    axios.get('http://localhost:3001/bills').then((resp)=>{
      if(resp.data){
        this.setState({
          bills : resp.data,
          filtered : resp.data
        });
      } else{
        window.electron.dialog.showMessageBoxSync({type:"info", 
          message : 'No fue posible obtener las facturas', buttons : ["ok"]});
      }
    }).catch((err)=>{
      window.electron.dialog.showMessageBoxSync({type:"error", 
          message : 'Error al obtener las facturas\n'+err, buttons : ["ok"]});
    })
  }
}

export default Bills;