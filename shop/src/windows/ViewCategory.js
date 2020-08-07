import React from 'react';
import TopBar from '../components/TopBar';
import SideBar from '../components/SideBar';
import './styles/ViewCategory.css';
import add from '../resources/add.svg';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import axios from 'axios';

class ViewCategory extends React.Component{
  constructor(props){
    super(props);
    this.state={
      updating : props.location.state ? props.location.state.update : false,
      username : props.location.state ? props.location.state.username : 'ruben4181',
      showNav : false,
      file : null,
      title : '',
      id : props.location.state ? props.location.state.id : 'no-parentx',
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
    this.getCategory = this.getCategory.bind(this);
    this.getCategories();
    this.getCategory();
  }

  render(){
    return(
      <div className="AddCategory-Window">
        <SideBar onHide={()=>{this.setState({showNav : !this.state.showNav})}}
          showNav={this.state.showNav}/>
        <div className="Header">
          <TopBar searchOn={true} history={this.props.history} menu={this.showMenu}
          username={this.state.username}/>
        </div>
        <div className="Inventory-Display">
          <div className="Display-Title-Container">
            <div className="Iventory-Title-Container">
              <h4 className="Display-Title-Text">{this.state.title}</h4>
            </div>
            <div className="Inventory-Product-Icon" onClick={(event)=>{this.handleCardClick(-1)}}>
              <img src={add} alt="Add" className="Inventory-AddIcon"/>
            </div>
          </div>
          <div className="Display-Categories-Container">
            <form onSubmit={this.onSendCategory}
              className="Category-Form">
              <input type="text" required className="AddCategories-TextField"
                placeholder="Nombre de categoria"
                value={this.state.name}
                onChange={(event)=>{
                  if(this.state.updating){
                    this.setState({name : event.target.value})
                  }
                  }}/>
              <input type="text-area" required className="AddCategories-TextField"
                value={this.state.description}
                onChange={(event)=>{
                  if(this.state.updating){
                    this.setState({description : event.target.value})
                  }
                }
                }
                placeholder="Descripcción"/>
              <input type="text" required className="AddCategories-TextField"
                value={this.state.tags}
                onChange = {(event)=>{
                  if(this.state.updating){
                    this.setState({tags:event.target.value})
                  }
                }}
                placeholder="Palabras clave separadas por ';'"/>
              <div className="AddCategories-Dropdown-Container">
                <Dropdown className='AddCategories-Dropdown' 
                  options={this.state.categories}
                  value={this.state.parent}
                  onChange={(item)=>{
                    if(this.state.updating){
                      this.setState({parent : item.value});
                    }
                    }} 
                placeholder="Subcategoría de"/>
              </div>
              <div className="AddCategories-File-Container">
                <h4 className="AddCategories-File-Label">Imagen</h4>
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

  renderButton(){
    if(this.state.updating){
      return(<input type="submit" className="AddCategories-Submit" value="Actualizar" 
      onKeyPress={(event)=>event.preventDefault()}/>);
    } else{
      return(<div></div>)
    }
  }

  renderImage(){
    let img = './public/category/category.svg';
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

  getCategory(){
    axios.get('http://localhost:3001/inventory/category?id='+this.state.id).then((resp)=>{
      if(resp.data){
        this.setState({
          title : resp.data.name,
          name : resp.data.name,
          description : resp.data.description,
          tags : resp.data.tags,
          parent : resp.data.parent,
          image : resp.data.image
        });
      }
    }).catch((err)=>{
      alert('NO se pudo obtener la categoría\n'+err);
    });
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
      alert('Error al obtener las categorías');
    });
  }

  onSendCategory(event){
    event.preventDefault()
    event.target.value = null;
    const form = new FormData();
    form.append('file', this.state.file);
    form.append('id', this.state.id);
    form.append('name', this.state.name);
    form.append('description', this.state.description);
    form.append('parent', this.state.parent);
    form.append('tags', this.state.tags);

    axios.post('http://localhost:3001/inventory/update-category', 
      form, {}).then((resp)=>{
        let tmp = this.state.fileElement;
        if(tmp){
          tmp.value = null;
        }
        if(resp.data.result==='OK'){
          alert('La categoría se actualizo correctamente');
          this.getCategory();
        } else{
          alert(resp.data.message);
        }
      }).catch((err)=>{
        alert(err);
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
    alert(id);
  }

  showMenu(event){
    event.preventDefault();
    this.setState({showNav:!this.state.showNav})
  }
}

export default ViewCategory;
