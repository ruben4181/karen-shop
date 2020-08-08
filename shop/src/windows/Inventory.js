import React from 'react';
import './styles/Inventory.css';
import TopBar from '../components/TopBar';
import SideBar from '../components/SideBar';
import add from '../resources/add.svg';
import axios from 'axios';
import back from '../resources/back.svg';

class Inventory extends React.Component {
  constructor(props){
    super(props);
    this.state={
      username : props.location.state ? props.location.state.username : 'ruben4181',
      categories : [],
      products : [],
      actualParent : 'no-parent',
      lastParent : ['no-parent'],
      actualTitle : 'Categorías',
      lastTitle : ['Categorías'],
      showNav : false
    }
    this.renderCategories = this.renderCategories.bind(this);
    this.renderProducts = this.renderProducts.bind(this);
    this.showMenu=this.showMenu.bind(this);
    this.handleCardClick = this.handleCardClick.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.getRootCategories = this.getRootCategories.bind(this);
    this.backCategory = this.backCategory.bind(this);
    this.getProducts = this.getProducts.bind(this);
    this.renderControls = this.renderControls.bind(this);
    this.onView = this.onView.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.getRootCategories();
    this.getProducts();
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
            <div className="Iventory-Title-Container">
              <h4 className="Display-Title-Text">{this.state.actualTitle}</h4>
            </div>
            <div className="Inventory-Controls">
              {this.renderControls()}
              <div className="Inventory-Icon" onClick={(event)=>{this.handleCardClick({id:-1})}}>
                <img src={add} alt="Add" className="Inventory-AddIcon"/>
              </div>
              <div className="Inventory-Icon" onClick={this.backCategory}>
              <img src={back} alt="Back" className="Inventory-AddIcon"/>
              </div>
            </div>
          </div>
          <div className="Display-Categories-Container">
            <table className="Display-Categories-Table">
              <tbody>{this.renderCategories()}</tbody>
            </table>
          </div>
        </div>
        <div className="Inventory-Display" style={{'margin-top' : '2%'}}>
          <div className="Display-Title-Container">
            <div className="Iventory-Title-Container">
              <h4 className="Display-Title-Text">Productos</h4>
            </div>
            <div className="Inventory-Product-Icon" onClick={(event)=>{this.handleItemClick(-1)}}>
              <img src={add} alt="Add" className="Inventory-AddIcon"/>
            </div>
          </div>
          <div className="Display-Products-Container">
            {this.renderProducts()}
          </div>
        </div>
      </div>
    );
  }

  renderControls(){
    if(this.state.actualParent!=='no-parent'){
      return(
        [
        <div className="Inventory-Control-Text" onClick={this.onView}>
          <b className="Modify-Text">Ver</b>
        </div>,
        <div className="Inventory-Control-Text" onClick={this.onUpdate}>
          <b className="Modify-Text">Modificar</b>
        </div>,
        <div className="Inventory-Control-Text" onClick={this.onDelete}>
          <b className="Modify-Text">Eliminar</b>
        </div>
        ]
      );
    }
  }

  onDelete(event){
    event.preventDefault();
    let conf=window.electron.dialog.showMessageBoxSync({type:"info", 
    message : '¿Estas seguro que deseas borrar esta categoría?', buttons : ["Cancelar", "ok"]})===1;
    if(conf){
      axios.get('http://localhost:3001/inventory/del-category?id='+this.state.actualParent).then((resp)=>{
        if(resp.data.result==='OK'){
          window.electron.dialog.showMessageBoxSync({type:"info", 
          message : 'Categoría borrada exitosamente', buttons : ["ok"]});
          this.getRootCategories();
        } else{
          window.electron.dialog.showMessageBoxSync({type:"info", 
          message : resp.data.message, buttons : ["ok"]});
        }
      }).catch((err)=>{
        window.electron.dialog.showMessageBoxSync({type:"info", 
          message : 'Error al borrar categoría\n'+err, buttons : ["ok"]});
      });
    }
  }

  onView(){
    this.props.history.push('/inventory/view-category',{
      username : this.state.username,
      id : this.state.actualParent
    });
  }

  onUpdate(){
    let conf = window.electron.dialog.showMessageBoxSync({type:"info", 
    message : '¿Deseas modificar esta categoría?', buttons : ["Cancelar", "ok"]})===1;
    if(conf){
      this.props.history.push('/inventory/view-category',{
        username : this.state.username,
        id : this.state.actualParent,
        update : true
      });
    }
  }

  compare( a, b ) {
    if ( a.name < b.name ){
      return -1;
    }
    if ( a.name > b.name ){
      return 1;
    }
    return 0;
  }

  getProducts(){
    let params = {category : this.state.actualParent}
    if(this.state.actualParent==='no-parent'){
      params = {}
    }
    let config = {
      method : 'GET',
      params : params,
      url : 'http://localhost:3001/inventory/products'
    }
    axios(config).then((resp)=>{
      if(resp.data){
        resp.data.sort(this.compare);
      }
      this.setState({
        products : resp.data
      });
    }).catch((err)=>{
      window.electron.dialog.showMessageBoxSync({type:"info", 
          message : 'Error al obtener los productos\n'+err, buttons : ["ok"]});
    });
  }
  
  backCategory(event){
    event.preventDefault();
    this.setState({
      actualParent : this.state.lastParent.pop(),
      actualTitle : this.state.lastTitle.pop()
    }, ()=>{
      this.getRootCategories();
      this.getProducts();
    });
  }

  getRootCategories(){
    let config = {
      method : 'get',
      url : 'http://localhost:3001/inventory/categories',
      params : {
        parent : this.state.actualParent
      }
    };

    axios(config).then((resp)=>{
      if(resp.data){
        this.setState({
          categories : resp.data
        });
        this.forceUpdate();
      }
    }).catch((err)=>{
      console.log(err);
      window.electron.dialog.showMessageBoxSync({type:"info", 
          message : err, buttons : ["ok"]});
    })
  }

  showMenu(event){
    event.preventDefault();
    this.setState({showNav:!this.state.showNav})
  }

  handleCardClick(item){
    if(item.id===-1){
      this.props.history.push('/inventory/add-category', {
        username : this.state.username,
        parent : this.state.actualParent
      });
    } else{
      this.state.lastParent.push(this.state.actualParent);
      this.state.lastTitle.push(this.state.actualTitle);
      this.setState({
        actualParent: item.id,
        actualTitle: item.name
      }, ()=>{
        this.getRootCategories();
        this.getProducts();
        window.scrollTo(0,0);
      });
    }
  }

  handleItemClick(id){
    if(id===-1){
      this.props.history.push('/inventory/add-product', {
        username : this.state.username,
        parent : this.state.actualParent
      });
    } else{
      this.props.history.push('/inventory/view-product',{
        username : this.state.username,
        id : id
      });
    }
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
    ]*/
    const items = []
    for(let i=0; i<products.length; i++){
      items.push(this.renderProduct(products[i]));
    }
    return items;
  }

  renderCategory(category){
    if(category){
      if(category.image==='add-category.svg'){
        category.image = './public/add-category.svg';
      } else if(!category.image || category.image==='no-image'){
        category.image = './public/category/category.svg';
      }
      return(
        <div className="Category-Card" onClick={(event)=>{
            if(category.name==="Agrega una nueva categoría"){
              this.handleCardClick({id:-1});
            } else{
              this.handleCardClick({id : category.id, name : category.name});
            }
          }}>
          <div className="Category-Card-Head">
            <h4 className="Category-Card-Title">{category.name}</h4>
          </div>
          <div className="Category-Card-Body">
            <img src={"http://localhost:3001/inventory/category/resource?resource="+category.image} 
            alt="Add Category" className="Category-Card-Image"/>
            <div className="Category-Card-Body-Text">
              <p>{category.description}</p>
            </div>
          </div>
        </div>
      );
    } else{
      return (<div></div>)
    }
  }

  renderCategories(){
    let categories = this.state.categories;
    console.log('Renderizando', this.state.categories.length)
    let category={name:'Agrega una nueva categoría', image : 'add-category.svg'};
    //categories.push({name:'Agrega una nueva categoría', image : 'add-category.svg'});
    const rows = [];
    if(categories.length>2){
      let stop = categories.length%2===0 ? 0 : 2
      for (let i=0; i<categories.length-stop; i=i+2){
        console.log('Imprimiendo i', i);
        rows.push(
          <tr className="Category-Card-TR" key={i}>
            <td className="Category-Card-TD">
              {this.renderCategory(categories[i])}
            </td>
            <td className="Category-Card-TD">
              {this.renderCategory(categories[i+1])}
            </td>
          </tr>
        );
      }
      if(categories.length%2!==0){
        rows.push(
          <tr className="Category-Card-TR" key={categories.length-1}>
            <td className="Category-Card-TD">
              {this.renderCategory(categories[categories.length-1])}
            </td>
            <td className="Category-Card-TD">

            </td>
          </tr>
        )
      }
    } else{
      if(categories.length===2){
          rows.push(
            <tr className="Category-Card-TR" key={0}>
              <td className="Category-Card-TD">
                {this.renderCategory(categories[0])}
              </td>
              <td className="Category-Card-TD">
                {this.renderCategory(categories[1])}
              </td>
            </tr>
          )
      } else{
        return (
          <tr className="Category-Card-TR" key={-1}>
            <td className="Category-Card-TD">
              {this.renderCategory(categories[0])}
            </td>
            <td className="Category-Card-TD">
              {this.renderCategory(category)}
            </td>
          </tr>
        )
      }
    }
    
    rows.push(
      <tr className="Category-Card-TR" key={-1}>
        <td className="Category-Card-TD">
          {this.renderCategory(category)}
        </td>
        <td className="Category-Card-TD">

        </td>
      </tr>
    )
    return rows;
  }
}

export default Inventory;
