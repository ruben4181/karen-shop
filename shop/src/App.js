import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './App.css';

import Login from './windows/Login';
import Main from './windows/Main';
import Inventory from './windows/Inventory';
import AddCategory from './windows/AddCategory';
import AddProduct from './windows/AddProduct';
import ViewProduct from './windows/ViewProduct';
import ViewCategory from './windows/ViewCategory';
import Billing from './windows/Billing';
import Bills from './windows/Bills';
import Bill from './windows/Bill';
import Loans from './windows/Loans';
import Users from './windows/Users';
import ProductList from './windows/ProductList';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' exact component={Login}/>
        <Route path='/main' exact component={Main}/>
        <Route path='/inventory' exact component={Inventory}/>
        <Route path='/inventory/add-category' exact component={AddCategory}/>
        <Route path="/inventory/add-product" exact component={AddProduct}/>
        <Route path="/inventory/view-product" exact component={ViewProduct}/>
        <Route path="/inventory/view-category" exact component={ViewCategory}/>
        <Route path="/billing" exact component={Billing}/>
        <Route path="/bills" exact component={Bills}/>
        <Route component={Bill} path="/bill" exact/>
        <Route component={Loans} path="/loans" exact/>
        <Route component={Users} path="/users" exact/>
        <Route component={ProductList} pat="/products-list" exact/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
