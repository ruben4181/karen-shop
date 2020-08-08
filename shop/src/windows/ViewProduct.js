import React from 'react';
import SideBar from '../components/SideBar';
import TopBar from '../components/TopBar';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import axios from 'axios';
import './styles/ViewProduct.css';

class ViewProduct extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      showNav : false,
      username : props.location.state ? props.location.state.username : 'ruben4181',
      parent : props.location.state ? props.location.state.parent : 'no-parent',
      categories : [],
      name : '',
      content : '',
      brand : '',
      description : null,
      priceRatio : '0.3',
      price_in : 0,
      price_out : 0,
      barcode : props.location.state ? props.location.state.id : '',
      units : null,
      image : null,
      updating : false,
      changingImage : false,
      unitsText : 'Unidades disponibles'
    }
    this.onChangingPriceIn = this.onChangingPriceIn.bind(this);
    this.onChangingPriceOut = this.onChangingPriceOut.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.onChangingUnits = this.onChangingUnits.bind(this);
    this.onFileSelected = this.onFileSelected.bind(this);
    this.onSendProduct = this.onSendProduct.bind(this);
    this.getProduct = this.getProduct.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.renderButton = this.renderButton.bind(this);
    this.renderImage = this.renderImage.bind(this);
    this.showMenu = this.showMenu.bind(this);
    this.getCategories();
    this.getProduct();
  }

  render(){
    const priceOptions = [
      {value : '5116', label : 'Custom'},
      {value : '0.1', label : '10%'},
      {value : '0.2', label : '20%'},
      {value : '0.3', label : '30%'},
      {value : '0.4', label : '40%'},
      {value : '0.5', label : '50%'},
      {value : '0.6', label : '60%'},
      {value : '0.7', label : '70%'},
      {value : '0.8', label : '80%'},
      {value : '0.9', label : '90%'},
      {value : '1', label : '100%'}
    ]
    return(
      <div className="AddCategory-Window">
        <SideBar onHide={()=>{this.setState({showNav : !this.state.showNav})}}
          showNav={this.state.showNav} history={this.props.history}
          username={this.state.username}/>
        <div className="Header">
          <TopBar searchOn={true} history={this.props.history} menu={this.showMenu}
          username={this.state.username}/>
        </div>
        <div className="Inventory-Display">
          <div className="Display-Title-Container">
            <div className="ViewProduct-Title-Container">
              <h4 className="Display-Title-Text">Nuevo producto</h4>
            </div>
            <div className="ViewProduct-Contros">
              <div className="Control-Text" onClick={this.onUpdate}>
                <b className="Modify-Text">Modificar</b>
              </div> 
              <div className="Control-Text" onClick={this.onDelete}>
                <b className="Modify-Text">Eliminar</b>
              </div>
            </div>
          </div>
          <div className="Display-Categories-Container">
            <form onSubmit={this.onSendProduct}
              className="Category-Form">
              <label>Codigo de barras</label>
              <div className="AddProduct-TextField-Dropdown">
                <input type="text" required className="AddProduct-TextField-Together"
                  style={{width : '100%'}}
                  disabled
                  id="barcode"
                  placeholder="Codigo de barras del producto"
                  onKeyPress={e => {
                    if (e.key === 'Enter') e.preventDefault();
                  }}
                  value={this.state.barcode} readonly/>
              </div>
              <label>Nombre del producto</label>
              <input type="text" required className="AddCategories-TextField"
                placeholder="Nombre del producto"
                value={this.state.name}
                onKeyPress={e => {
                  if (e.key === 'Enter') e.preventDefault();
                }}
                onChange={(event)=>{
                  if(this.state.updating){
                    this.setState({name : event.target.value})}}  
                  }
                  />
              <label>Contenido</label>
              <input type="text" required className="AddCategories-TextField"
                placeholder="Contenido (e.g. 100g)"
                value={this.state.content}
                onKeyPress={e => {
                  if (e.key === 'Enter') e.preventDefault();
                }}
                onChange={(event)=>{
                  if(this.state.updating){
                  this.setState({content : event.target.value})}
                  }
                }/>
              <label>Marca</label>
              <input type="text" required className="AddCategories-TextField"
                placeholder="Marca"
                value={this.state.brand}
                onKeyPress={e => {
                  if (e.key === 'Enter') e.preventDefault();
                }}
                onChange={(event)=>{
                  if(this.state.updating){
                    this.setState({brand : event.target.value})}
                  }
                  }/>
              <label>Descripcción</label>
              <input type="text" className="AddCategories-TextField"
                placeholder="Descripcción (opcional)"
                value={this.state.description}
                onKeyPress={e => {
                  if (e.key === 'Enter') e.preventDefault();
                }}
                onChange={(event)=>{
                  if(this.state.updating){
                    this.setState({description : event.target.value})}
                  }
                }/>
              <label>Precio de ingreso</label>
              <input type="text" required className="AddCategories-TextField"
                placeholder="Precio compra"
                value={this.state.price_in}
                onKeyPress={e => {
                  if (e.key === 'Enter') e.preventDefault();
                }}
                onChange={this.onChangingPriceIn}/>
              <label>Precio al cliente</label>
              <div className="AddProduct-TextField-Dropdown">
                <input type="text" required className="AddProduct-TextField-Together"
                  placeholder="Precio venta"
                  onKeyPress={e => {
                    if (e.key === 'Enter') e.preventDefault();
                  }}
                  value={this.state.price_out}
                  onChange={this.onChangingPriceOut}/>
                <Dropdown className='AddProduct-Together' 
                  options={priceOptions}
                  value={this.state.priceRatio}
                  onChange={(item)=>{
                    if(this.state.updating){
                      this.setState({priceRatio : item.value});
                    }
                    if(item.value!=='5116' && this.state.updating){
                      this.setState({price_out : Math.round(this.state.price_in*(1+Number(item.value)))});
                    }
                  }} 
                placeholder="Precio de salida"/>
              </div>
                <label>{this.state.unitsText}</label>
              <input type="text" required className="AddCategories-TextField"
                placeholder="Agrega unidades a las ya existentes"
                value={this.state.units}
                onKeyPress={e => {
                  if (e.key === 'Enter') e.preventDefault();
                }}
                onChange={this.onChangingUnits}/>
              <div className="AddProduct-Dropdown-Container">
                <b style={{'margin' : '1%', 'font-weight' : 'normal'}}>Categoría del producto</b>
                <Dropdown className='AddCategories-Dropdown' 
                  options={this.state.categories}
                  value={this.state.parent}
                  onChange={(item)=>{
                    if(this.state.updating){
                      this.setState({parent : item.value})}  
                    }
                  } 
                placeholder="Subcategoría de"/>
              </div>
              <div className="AddCategories-File-Container">
                <h4 className="AddCategories-File-Label">Actualiza imagen</h4>
                <input type="file" id="file" name="file" onChange={this.onFileSelected}/>
              </div>
              {this.renderImage()}
              {this.renderButton()}
              
            </form> 
          </div>
        </div>
      </div>
    );
  }

  showMenu(event){
    event.preventDefault();
    this.setState({showNav:!this.state.showNav})
  }

  renderImage(){
    let img = './public/products/product.svg';
    if(this.state.image && this.state.image!=='no-image'){
      img = this.state.image;
    }
    return(
      <div className="ViewProduct-ImageContainer">
        <b>Imagen actual</b>
        <img className="ViewProduct-Image"
        src={"http://localhost:3001/inventory/category/resource?resource="+img} 
        alt="Product"/>
      </div>);
  }

  renderButton(){
    if(this.state.updating){
      return(<input type="submit" className="AddCategories-Submit" value="Actualizar" 
      onKeyPress={(event)=>event.preventDefault()}/>);
    } else{
      return(<div></div>)
    }
  }

  onUpdate(event){
    event.preventDefault();
    let conf = window.electron.dialog.showMessageBoxSync({type:"none", 
    message : '¿Deseas modificar el producto?', buttons : ["Cancelar", "ok"]})===1;
    if(conf){
      window.electron.dialog.showMessageBoxSync({type:"none", 
          message : `El numero que pongas en el campo de unidades serán sumados al numero actual(${this.state.units})`, buttons : ["ok"]});
      this.setState({updating : true, units : 0, unitsText : 'Agregar unidades'});
    }
  }

  onDelete(event){
    event.preventDefault();
    let conf = window.electron.dialog.showMessageBoxSync({type:"none", 
    message : '¿Deseas eliminar permanentemente el producto?', buttons : ["Cancelar", "ok"]})===1;
    if(conf){
      axios.get('http://localhost:3001/inventory/delete-product?id='+this.state.barcode).then((resp)=>{
        if(resp.data.result==='OK'){
          window.electron.dialog.showMessageBoxSync({type:"none", 
          message : 'Producto eliminado exitosamente', buttons : ["ok"]});
          this.props.history.goBack();
        } else{
          window.electron.dialog.showMessageBoxSync({type:"none", 
          message : resp.data.message, buttons : ["ok"]});
        }
      }).catch((err)=>{
        window.electron.dialog.showMessageBoxSync({type:"none", 
          message : 'No se pudó eliminar el producto\n'+err, buttons : ["ok"]});
      })
    }
  }

  getProduct(){
    let config = {
      url : 'http://localhost:3001/inventory/product',
      method : 'get',
      params : {
        id : this.state.barcode
      }
    }
    axios(config).then((resp)=>{
      this.setState({
        parent : resp.data.category,
        name : resp.data.name,
        content : resp.data.content,
        brand : resp.data.brand,
        description : resp.data.description,
        price_in : resp.data.price_in,
        price_out : resp.data.price_out,
        units : resp.data.units,
        lastUnits : resp.data.units,
        image : resp.data.image,
        unitsText : 'Unidades disponibles'
      }, window.scrollTo(0, 0));
    }).catch((err)=>{
      window.electron.dialog.showMessageBoxSync({type:"none", 
          message : 'No se pudo obtener el producto\n'+err, buttons : ["ok"]});
    });
  }

  onSendProduct(event){
    event.preventDefault();
    if(this.state.updating){
      let form  = new FormData();
      form.append('file', this.state.file);
      form.append('id', this.state.barcode);
      form.append('name', this.state.name);
      form.append('content', this.state.content);
      form.append('brand', this.state.brand.toUpperCase());
      form.append('description', this.state.description);
      form.append('price_in', this.state.price_in);
      form.append('price_out', this.state.price_out);
      form.append('category', this.state.parent);
      form.append('units', Number(this.state.units)+Number(this.state.lastUnits));

      axios.post('http://localhost:3001/inventory/update-product', 
        form, {}).then((resp)=>{
          let tmp = this.state.fileElement;
          if(tmp){
            tmp.value=null;
          }
          if(resp.data.result==='OK'){
            window.electron.dialog.showMessageBoxSync({type:"none", 
          message : 'Actualización completada', buttons : ["ok"]});
            this.getProduct();
          } else{
            window.electron.dialog.showMessageBoxSync({type:"none", 
            message : resp.data.message, buttons : ["ok"]});
          }
        }).catch((err)=>{
          window.electron.dialog.showMessageBoxSync({type:"none", 
          message : 'Error al actualizar el producto\n'+err, buttons : ["ok"]});
        });
    }
  }

  onFileSelected(event){
    this.setState({
      fileElement : event.target,
      file : event.target.files[0],
      loaded : 0,
      changingImage : true
    });
  }

  getCategories(){
    let config = {
      url : 'http://localhost:3001/inventory/categories?parent=all'
    }
    let items = []
    items.push({
      value : 'no-parent',
      label : 'Sin categoría'
    });
    axios(config).then((resp)=>{
      if(resp.data){
        for(let i=0; i<resp.data.length; i++){
          items.push({
            value : resp.data[i].id,
            label : resp.data[i].name
          });
        }
        this.setState({
          categories : items
        })
        this.forceUpdate();
      }
    }).catch((err)=>{
      console.log(err);
      window.electron.dialog.showMessageBoxSync({type:"none", 
          message : 'Error al obtener las categorías\n'+err, buttons : ["ok"]});
    });
  }

  onChangingPriceOut(event){
    if(this.state.updating){
      if(event.target.value==='' || /^\d+$/.test(event.target.value)){
        if(event.target.value!=='' && this.state.priceRatio==='5116'){
          this.setState({price_out : Number(event.target.value)});
        } else if(event.target.value===''){
          this.setState({price_out : 0});
        }
      } else{
        window.electron.dialog.showMessageBoxSync({type:"none", 
          message : 'Solo puedes ingresar numeros en este campo', buttons : ["ok"]});
        this.setState({price_out : ''});
      }
    }
  }
  onChangingPriceIn(event){
    if(this.state.updating){
      if(event.target.value==='' || /^\d+$/.test(event.target.value)){
        if(event.target.value!==''){
          this.setState({price_in : Number(event.target.value)},
            ()=>{
              if(this.state.priceRatio!=='5116'){
                this.setState({
                  price_out : Math.round(this.state.price_in*(1+Number(this.state.priceRatio)))
                });
              }
            }
          );
        } else{
          this.setState({price_in : 0});
        }
      } else{
        window.electron.dialog.showMessageBoxSync({type:"none", 
          message : 'Solo puedes ingresar numeros en este campo', buttons : ["ok"]});
        this.setState({price_in : ''});
      }
    }
  }
  onChangingUnits(event){
    if(this.state.updating){
      if(event.target.value==='' || /^\d+$/.test(event.target.value)){
        if(event.target.value!==''){
          this.setState({units : Number(event.target.value)});
        } else{
          this.setState({units : 0});
        }
      } else{
        window.electron.dialog.showMessageBoxSync({type:"none", 
          message : 'Solo puedes ingresar numeros en este campo', buttons : ["ok"]});
        this.setState({units : ''});
      }
    }
  }
}

export default ViewProduct;
