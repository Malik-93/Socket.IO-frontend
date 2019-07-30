import React from 'react';
// import './App.css';
import Partner from './components/Partner'
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Chat from './components/Chat';
import Status from './components/Status';
function App() {
  return (
    <BrowserRouter>
      <div>
        <Switch>
          <Route exact path='/' component={Chat} />
          <Route path='/partner' component={Partner} />
          <Route path='/status' component={Status} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
