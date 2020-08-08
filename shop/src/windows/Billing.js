import React from 'react';
import './styles/Billing.css';
import SideBar from '../components/SideBar';
import TopBar from '../components/TopBar';
import axios from 'axios';

class Billing extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      showNav : false,
      username : props.location.state ? props.location.state.username : 'ruben4181',
      products : [],
      barcode : '',
      total : 0,
      payWith : '',
      client : '',
      clientID : '',
      isLoan : false
    }
    this.handleScan = this.handleScan.bind(this);
    this.checkUnits = this.checkUnits.bind(this);
    this.getProduct = this.getProduct.bind(this);
    this.checkPayment = this.checkPayment.bind(this);
    this.renderButtons = this.renderButtons.bind(this);
    this.renderProducts = this.renderProducts.bind(this);
    this.onView = this.onView.bind(this);
    this.sendLoan = this.sendLoan.bind(this);
    this.delItem = this.delItem.bind(this);
    this.showMenu = this.showMenu.bind(this);
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
              <h4 className="Display-Title-Text">Nueva venta</h4>
            </div>
            <div className="Bill-Controls">
              {this.renderControls()}
            </div>
          </div>
          <div className="Bill-Container">
            <form onSubmit={this.handleScan}>
              <div className="Bill-Input-Container">
                <input className="AddProduct-TextField-Together" autofocus="true" required
                type="text"
                value={this.state.barcode}
                onChange={(event)=>{this.setState({barcode : event.target.value})}}
                placeholder="Codigo de barras del producto"/>
                <input className="AddProduct-Scann" type="submit" value="Agregar"/>
              </div>
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

  sendBill(){
    if(this.state.payWith!==''){
      alert('Cambio: '+String(Number(this.state.payWith)-Number(this.state.total)));
    }
    if(window.confirm('¿Deseas terminar la venta?')){
      let conf = window.confirm('¿Deseas imprimir el recibo?');
      let items = [];
      for(let i=0; i<this.state.products.length; i++){
        items.push({
          id : this.state.products[i].id,
          name : this.state.products[i].name,
          content : this.state.products[i].content,
          brand : this.state.products[i].brand,
          unitsSelling : this.state.products[i].unitsSelling,
          price_out : this.state.products[i].price_out,
        });
      }
      let id = this.timeStamp()+'-'+Date.now();
      let config = {
        method : 'post',
        url : 'http://localhost:3001/biils/new-bill',
        data : {
          id : id,
          client : this.state.client!=='' ? this.state.client : 'Cliente anonimo',
          clientID : this.state.clientID!=='' ? this.state.clientID : '0000000000',
          seller : this.state.username,
          items,
          printing : conf,
          total : this.state.total,
          isLoan : this.state.isLoan
        }
      }
      axios(config).then((resp)=>{
        alert(resp.data.message);
        this.setState({products : []}, ()=>{
          this.sendLoan(id);
        });
      }).catch((err)=>{
        alert('Error al guardar la factura\n'+err);
      });
    }
  }

  sendLoan(idBill){
    if(this.state.isLoan){
      let loan = {
        id : this.timeStamp()+'-loan-'+Date.now(),
        client : {name : this.state.client || 'Usuario anonimo', 
          DNI : this.state.clientID || '0000000000'},
        idBill,
        date : this.timeStamp(),
        payments : [],
        total : this.state.total
      }

      let config = {
        method : 'post',
        url : 'http://localhost:3001/loans/new-loan',
        data : {
          loan
        }
      }
      axios(config).then((resp)=>{
        alert(resp.data.message);
        this.setState({isLoan : false, total : 0, client : '', clientID : ''}, ()=>{this.props.history.go()})
      }).catch((err)=>{
        alert('Error al crear el credito\n'+err);
      });
    } else{
      this.setState({isLoan : false, total : 0, client : '', clientID : ''}, ()=>{this.props.history.go()})
    }
  }

  renderButtons(){
    if(this.state.products.length>0){
      return(
        <div className="Bill-Footer">
          <input type="numeric" className="MoneyIn-TextField" placeholder="Paga"
          value={this.state.payWith}
          onChange={this.checkPayment}/>
          <h4 className="Bill-Footer-Text">Total: ${this.state.total}</h4>
          <input id="isLoan" name="isLoan" 
          style={{margin : '1%'}}
          onClick={(event)=>{this.setState({isLoan : !this.state.isLoan})}}
          type="checkbox" value={this.state.isLoan}/>
          <label style={{'margin-bottom' : '4%'}} for="isLoan">¿Factura a credito?</label><br/>
          <button onClick={(event)=>{this.sendBill()}} 
          className="Bill-Footer-Button">Terminar la venta</button>
        </div>
      );
    }
  }

  getProduct(){
    let config={
      method : 'get',
      url : 'http://localhost:3001/inventory/product',
      params : {
        id : this.state.barcode
      }
    }
    axios(config).then((resp)=>{
      if(resp.data){
        let flag = true;
        let tmp = resp.data;
        let buff = this.state.products;
        for(let i=0; i<buff.length; i++){
          if(tmp.id===buff[i].id){
            buff[i].unitsSelling+=1;
            flag = false;
          }
        }

        if(flag){
          tmp.unitsSelling=1;
          buff.push(tmp);
        }
        this.setState({products : buff, total : this.state.total+Number(tmp.price_out)});
      } else{
        alert('No se leyó correctamente o producto no existe en la base de datos');
      }
    }).catch((err)=>{
      alert('No se pudo obtener el producto\n'+err);
    });
  }

  handleScan(event){
    event.preventDefault();
    this.getProduct();
    this.setState({barcode : ''});
  }

  renderControls(){
    if(this.state.actualParent!=='no-parent'){
      return(
        [
        <div className="Bill-Control-Text" 
          style={{'width' : '20vw'}}
          onClick={this.onView}>
          <b>Ver Facturas</b>
        </div>  
        ]
      );
    }
  }

  onView(event){
    event.preventDefault();
    this.props.history.push('/bills', {
      username : this.state.username
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
              onChange={(event)=>{this.checkUnits(event.target.value, i)}}
            />
            <b className="Bill-ProductValue">{products[i].price_out}</b>
          </div>
          <div className="Bill-ProductItem-Col4">
            <button className="Bill-DelItem"
              onClick={(e)=>{this.delItem(i)}}
            >Eliminar</button>
          </div>
        </div>
      )
    }
    return items;
  }

  delItem(i){
    if(window.confirm('¿Desea eliminar este producto de la lista?')){
      let total = this.state.total;
      total-=this.state.products[i].unitsSelling*this.state.products[i].price_out;
      let a = this.state.products.slice(0, i);
      let b = this.state.products.slice(i+1);
      let c = a.concat(b);
      this.setState({total, products : c});
    }
  }

  checkPayment(event){
    let value = event.target.value;
    console.log(value);
    if(value==='' || /^\d+$/.test(value)){
      if(value!==''){
        if(value[0]==='0'){
          this.setState({payWith : value.substr(1, value.length-1)})
        } else{
          this.setState({payWith : value});
        }
      } else{
        this.setState({payWith : 0});
      }
    } else{
      alert('Solo numeros en este campo')
    }
  }

  checkUnits(value, i){
    let tmp = this.state.products;
    if(value.length>12){
      let total = this.state.total;
      total-=tmp[i].unitsSelling*tmp[i].price_out;
      tmp[i].unitsSelling=0;
      alert('Si desas scannear algún producto, por favor da click en "Codigo de barras del producto" y scannea de nuevo');
      return this.setState({products : tmp, total});
      
    }
    if(value==='' || /^\d+$/.test(value)){
      if(value!==''){
        let total = this.state.total;
        total-=tmp[i].unitsSelling*tmp[i].price_out;
        tmp[i].unitsSelling=Number(value);
        total+=tmp[i].unitsSelling*tmp[i].price_out;
        this.setState({products : tmp, total});
      } else{
        let total = this.state.total;
        total-=tmp[i].unitsSelling*tmp[i].price_out;
        tmp[i].unitsSelling=0;
        this.setState({products : tmp, total});
      }
    } else{
      alert('Solo numeros en este campo')
    }
  }
  timeStamp (){
    var today = new Date(); 
    var dd = today.getDate(); 
    var mm = today.getMonth() + 1; 
  
    var yyyy = today.getFullYear(); 
    if (dd < 10) { 
        dd = '0' + dd; 
    } 
    if (mm < 10) { 
        mm = '0' + mm; 
    } 
    today = dd + '-' + mm + '-' + yyyy;
    return today;
  }
}

export default Billing;