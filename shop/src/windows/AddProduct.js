import React from 'react';
import './styles/AddProduct.css';
import SideBar from '../components/SideBar';
import TopBar from '../components/TopBar';
import add from '../resources/add.svg';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import BarcodeReader from 'react-barcode-reader';
import axios from 'axios';

class AddProduct extends React.Component{
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
      price_in : null,
      price_out : null,
      barcode : '',
      units : null
    }
    this.onChangingPriceIn = this.onChangingPriceIn.bind(this);
    this.onChangingPriceOut = this.onChangingPriceOut.bind(this);
    this.handleCardClick = this.handleCardClick.bind(this);
    this.handleScan = this.handleScan.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.onChangingUnits = this.onChangingUnits.bind(this);
    this.onFileSelected = this.onFileSelected.bind(this);
    this.onSendProduct = this.onSendProduct.bind(this);
    this.getCategories();
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
        <BarcodeReader
          onError={this.handleError}
          onScan={this.handleScan}
        />
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
              <h4 className="Display-Title-Text">Nuevo producto</h4>
            </div>
            <div className="Inventory-Product-Icon" onClick={(event)=>{this.handleCardClick(-1)}}>
              <img src={add} alt="Add" className="Inventory-AddIcon"/>
            </div>
          </div>
          <div className="Display-Categories-Container">
            <form onSubmit={this.onSendProduct}
              className="Category-Form">
              <div className="AddProduct-TextField-Dropdown">
                <input type="text" required className="AddProduct-TextField-Together"
                  placeholder="Codigo de barras del producto"
                  onKeyPress={e => {
                    if (e.key === 'Enter') e.preventDefault();
                  }}
                  value={this.state.barcode} readonly/>
                <button className="AddProduct-Scann"
                onClick={(event)=>{event.preventDefault(alert('Presiona ok y scannea el codigo'))}} 
                  onKeyPress={e => {
                  if (e.key === 'Enter') e.preventDefault();
                }}>Scanear el codigo</button>
              </div>
              <input type="text" required className="AddCategories-TextField"
                placeholder="Nombre del producto"
                value={this.state.name}
                onKeyPress={e => {
                  if (e.key === 'Enter') e.preventDefault();
                }}
                onChange={(event)=>{this.setState({name : event.target.value})}}/>

              <input type="text" required className="AddCategories-TextField"
                placeholder="Contenido (e.g. 100g)"
                value={this.state.content}
                onKeyPress={e => {
                  if (e.key === 'Enter') e.preventDefault();
                }}
                onChange={(event)=>{this.setState({content : event.target.value})}}/>

              <input type="text" required className="AddCategories-TextField"
                placeholder="Marca"
                value={this.state.brand}
                onKeyPress={e => {
                  if (e.key === 'Enter') e.preventDefault();
                }}
                onChange={(event)=>{this.setState({brand : event.target.value})}}/>

              <input type="text" className="AddCategories-TextField"
                placeholder="Descripcción (opcional)"
                value={this.state.description}
                onKeyPress={e => {
                  if (e.key === 'Enter') e.preventDefault();
                }}
                onChange={(event)=>{this.setState({description : event.target.value})}}/>
              
              <input type="text" required className="AddCategories-TextField"
                placeholder="Precio compra"
                value={this.state.price_in}
                onKeyPress={e => {
                  if (e.key === 'Enter') e.preventDefault();
                }}
                onChange={this.onChangingPriceIn}/>

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
                    this.setState({priceRatio : item.value});
                    if(item.value!=='5116'){
                      this.setState({price_out : Math.round(this.state.price_in*(1+Number(item.value)))});
                    }
                  }} 
                placeholder="Precio de salida"/>
              </div>
              <input type="text" required className="AddCategories-TextField"
                placeholder="Unidades disponibles"
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
                  onChange={(item)=>{this.setState({parent : item.value})}} 
                placeholder="Subcategoría de"/>
              </div>
              <div className="AddCategories-File-Container">
                <h4 className="AddCategories-File-Label">Agregar imagen(opcional)</h4>
                <input type="file" id="file" name="file" onChange={this.onFileSelected}/>
              </div>
              <input type="submit" className="AddCategories-Submit" value="Agregar" 
              onKeyPress={(event)=>event.preventDefault()}/>
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
  
  onFileSelected(event){
    this.setState({
      fileElement : event.target,
      file : event.target.files[0],
      loaded : 0
    });
  }

  onSendProduct(event){
    event.preventDefault();
    const form = new FormData();
    form.append('file', this.state.file);
    form.append('id', this.state.barcode);
    form.append('name', this.state.name);
    form.append('content', this.state.content);
    form.append('brand', this.state.brand.toUpperCase());
    form.append('description', this.state.description);
    form.append('price_in', Number(this.state.price_in));
    form.append('price_out', Number(this.state.price_out));
    form.append('units', Number(this.state.units));
    form.append('category', this.state.parent);

    axios.post('http://localhost:3001/inventory/add-product', 
      form, {}).then((resp)=>{
        if(resp.data.result==='OK'){
          alert('Producto agregado exitosamente');
          let tmp = this.state.fileElement;
          if(tmp){
            tmp.value = null;
          }
          this.setState({
            file : undefined,
            barcode : '',
            name : '',
            content : '',
            brand : '',
            description : '',
            price_in : '',
            price_out : '',
            units : '',
            parent : ''
          });
        } else{
          alert('No fue posible agregar el producto\nCasua: '+resp.data.message);
        }
      }).catch((err)=>{
        alert(err);
      })
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
      alert('Error al obtener las categorías');
    });
  }

  handleScan(data){
    this.setState({
      barcode: data,
    });
  }
  handleError(err){
    console.error(err)
  }

  onChangingPriceOut(event){
    if(event.target.value==='' || /^\d+$/.test(event.target.value)){
      if(event.target.value!=='' && this.state.priceRatio==='5116'){
        this.setState({price_out : Number(event.target.value)});
      } else if(event.target.value===''){
        this.setState({price_out : 0});
      }
    } else{
      alert('Solo puedes ingresar numerso en este campo');
      this.setState({price_out : ''});
    }
  }
  onChangingPriceIn(event){
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
      alert('Solo puedes ingresar numerso en este campo');
      this.setState({price_in : ''});
    }
  }
  onChangingUnits(event){
    if(event.target.value==='' || /^\d+$/.test(event.target.value)){
      if(event.target.value!==''){
        this.setState({units : Number(event.target.value)});
      } else{
        this.setState({units : 0});
      }
    } else{
      alert('Solo puedes ingresar numerso en este campo');
      this.setState({units : ''});
    }
  }
  handleCardClick(id){
    if(id===-1){
      alert(Number(this.state.priceRatio));
    }
  }
}

export default AddProduct;