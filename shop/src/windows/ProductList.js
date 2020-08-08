import React from 'react';
import './styles/ProductList.css';
import SideBar from '../components/SideBar';
import TopBar from '../components/TopBar';
import axios from 'axios';

class ProductList extends React.Component{
  constructor(props){
    super(props);
    this.state={
      showNav : false,
      username : props.location.state ? props.location.state.username : 'ruben4181~' || 'ruben4181x',
      search : props.location.state ? props.location.state.search : 'all~' || 'allx',
      products : [],
      filtered : []
    }
    this.changeSearch = this.changeSearch.bind(this);
    this.renderProducts = this.renderProducts.bind(this);
    this.filterProducts = this.filterProducts.bind(this);
    this.getProducts = this.getProducts.bind(this);
    this.getProducts(this.state.search);
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
          username={this.state.username}
          search={this.changeSearch}/>
        </div>
        <div className="Inventory-Display">
          <div className="Display-Title-Container">
            <div className="Inventory-Title-Container">
              <h4 className="Display-Title-Text">Resultados de la busqueda "{this.state.search}"</h4>
            </div>
          </div>
          <div className="Display-Products-Container">
            {this.renderProducts()}
          </div>
        </div>
        
      </div>
    );
  }

  getProducts(search){
    let config = {
      method : 'get',
      url : 'http://localhost:3001/inventory/products'
    }
    axios(config).then((resp)=>{
      this.setState({
        products : resp.data || []
      }, ()=>{this.filterProducts(search)});
    }).catch((err)=>{
      window.electron.dialog.showMessageBoxSync({type:"none", 
          message : 'Error al buscar los productos\n'+err, buttons : ["ok"]});
    });
  }

  filterProducts(search){
    search = search.toLowerCase();
    const items = []
    for(let i=0; i<this.state.products.length; i++){
      let c1 = this.state.products[i].name.toLowerCase().includes(search);
      let c2 = this.state.products[i].content.toLowerCase().includes(search);
      let c3 = this.state.products[i].brand.toLowerCase().includes(search);
      let c4 = this.state.products[i].description ? this.state.products[i].description.includes(search) : false;
      let c5 = this.state.products[i].price_out.toLowerCase().includes(search);
      let c6 = this.state.products[i].category.toLowerCase().includes(search);

      if(c1 || c2 || c3 || c4 || c5 || c6){
        items.push(this.state.products[i]);
      }
    }
    this.setState({
      products : items
    });
  }

  changeSearch(search) {
    this.setState({
      search
    }, ()=>{
      this.getProducts(search);
    });
  }

  renderProduct(product){
    if(product){
      if(product.image==='add-category.svg'){
        product.image = './public/add-category.svg';
      } else if(product.image==='no-image'){
        product.image = './public/products/product.svg';
      }
      return(
        <div className="Display-Products-Item" onClick={(event)=>{
            if(product.name==='Agregar un nuevo producto'){
              this.handleItemClick(-1);
            } else{
              this.handleItemClick(product.id);
            }
          }}>
          <div className="Product-MiniImage-Container">
            <img src={"http://localhost:3001/inventory/category/resource?resource="+product.image} 
              alt={product.image}
              className="Product-MiniImage"/>
          </div>
          <div className="Product-Info-Container">
            <b style={{'margin-right' : '2%', 'width' : '30%'}}>{product.name}</b>
            <b style={{'font-weight' : 'normal', 'margin-right' : '2%',
              'width' : '35vw'}}>{product.brand}</b>
            {product.content}
          </div>
          <div className="Product-Actions-Container">
            <b>${product.price_out}</b>
          </div>
        </div>
      );
    } else{
      return(<div></div>);
    }
  }

  renderProducts(){
    let products = this.state.products;
    /*products = [
      {name : 'Agregar un nuevo producto', brand : '', price : '', content : '',
      image : 'add-category.svg'}
    ]//*/
    const items = []
    for(let i=0; i<products.length; i++){
      items.push(this.renderProduct(products[i]));
    }
    return items;
  }
}

export default ProductList;
