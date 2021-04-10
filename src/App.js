import React, { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './style/App.css';
import FinishView from './views/FinishView';
import ResultView from './views/ResultView';
import Trackview from './views/Trackview'
import WelcomeView from './views/WelcomeView'

export default function App() {


  return (
    <div className="">
      <BrowserRouter>
        <Switch>
        <Route path="/squats">
            <Trackview />
          </Route> 
          <Route path="/result">
            <ResultView />
          </Route> 
          <Route path="/complete">
            <FinishView />
          </Route> 
          <Route path="/">
            <WelcomeView />
          </Route>
        </Switch>
      </BrowserRouter>

    </div>
  );
}