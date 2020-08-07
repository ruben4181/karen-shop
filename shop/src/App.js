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

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route className="App-container" path='/' exact component={Login}/>
        <Route className="App-container" path='/main' exact component={Main}/>
        <Route className="App-container" path='/inventory' exact component={Inventory}/>
        <Route className="App-container" path='/inventory/add-category' exact component={AddCategory}/>
        <Route className="App-container" path="/inventory/add-product" exact component={AddProduct}/>
        <Route className="App-container" path="/inventory/view-product" exact component={ViewProduct}/>
        <Route className="App-container" path="/inventory/view-category" exact component={ViewCategory}/>
        <Route className="App-container" path="/billing" exact component={Billing}/>
        <Route className="App-container" path="/bills" exact component={Bills}/>
        <Route component={Bill} path="/bill" exact/>
        <Route component={Loans} path="/loans" exact/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
