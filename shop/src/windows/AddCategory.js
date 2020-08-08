import React from 'react';
import TopBar from '../components/TopBar';
import SideBar from '../components/SideBar';
import './styles/AddCategory.css';
import add from '../resources/add.svg';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import axios from 'axios';

class AddCategory extends React.Component{
  constructor(props){
    super(props);
    this.state={
      username : props.location.state ? props.location.state.username : 'ruben4181',
      showNav : false,
      file : null,
      name : '',
      description : '',
      tags : '',
      parent : props.location.state.parent || 'no-parent',
      image : '',
      fileElement : null,
      categories : [],
      parentChoose : null
    }
    this.showMenu = this.showMenu.bind(this);
    this.onFileSelected = this.onFileSelected.bind(this);
    this.onSendCategory = this.onSendCategory.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.getCategories();
  }

  render(){
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
            <div className="Iventory-Title-Container">
              <h4 className="Display-Title-Text">Nuevo categoría</h4>
            </div>
            <div className="Inventory-Icon" onClick={(event)=>{this.handleCardClick(-1)}}>
              <img src={add} alt="Add" className="Inventory-AddIcon"/>
            </div>
          </div>
          <div className="Display-Categories-Container">
            <form onSubmit={this.onSendCategory}
              className="Category-Form">
              <input type="text" required className="AddCategories-TextField"
                placeholder="Nombre de categoria"
                value={this.state.name}
                onChange={(event)=>{this.setState({name : event.target.value})}}/>
              <input type="text-area" required className="AddCategories-TextField"
                value={this.state.description}
                onChange={(event)=>{this.setState({description : event.target.value})}}
                placeholder="Descripcción"/>
              <input type="text" required className="AddCategories-TextField"
                value={this.state.tags}
                onChange = {(event)=>{this.setState({tags:event.target.value})}}
                placeholder="Palabras clave separadas por ';'"/>
              <div className="AddCategories-Dropdown-Container">
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
              <input type="submit" className="AddCategories-Submit" value="Agregar"/>
            </form>
          </div>
        </div>
      </div>
    );
  }

  getCategories(){
    let config = {
      url : 'http://localhost:3001/inventory/categories?parent=all'
    }
    let items = []
    items.push({
      value : 'no-parent',
      label : 'Seleccione una categoría padre (Ninguna por defecto)'
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
      window.electron.dialog.showMessageBoxSync({type:"error", 
          message : "Error al obtener las categorías", buttons : ["ok"]});
    });
  }

  onSendCategory(event){
    event.preventDefault()
    event.target.value = null;
    const form = new FormData();
    form.append('file', this.state.file);
    form.append('id', this.state.name.toLowerCase().replace(/ /g, '-')+'-'+Date.now());
    form.append('name', this.state.name);
    form.append('description', this.state.description);
    form.append('parent', this.state.parent);
    form.append('tags', this.state.tags);

    axios.post('http://localhost:3001/inventory/new-category', 
      form, {}).then((resp)=>{
        let tmp = this.state.fileElement;
        if(tmp){
          tmp.value = null;
        }
        if(resp.data.result==='OK'){
          window.electron.dialog.showMessageBoxSync({type:"none", 
          message : "La categoría se creó correctamente", buttons : ["ok"]});
          this.setState({
            id : '',
            name : '',
            parent : 'no-parent',
            tags : '',
            description: ''
          });
        } else{
          window.electron.dialog.showMessageBoxSync({type:"none", 
          message : resp.data.message, buttons : ["ok"]});
        }
      }).catch((err)=>{
        window.electron.dialog.showMessageBoxSync({type:"error", 
          message : err, buttons : ["ok"]});
      });
  }

  onFileSelected(event){
    this.setState({
      fileElement : event.target,
      file : event.target.files[0],
      loaded : 0
    });
  }

  handleCardClick(id){
    
  }

  showMenu(event){
    event.preventDefault();
    this.setState({showNav:!this.state.showNav})
  }
}

export default AddCategory;
