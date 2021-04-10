import React, { useState } from 'react';
import './App.css';
import Trackview from './Trackview'
import WelcomeView from './WelcomeView'

export default function App() {

  const [start, setStart] = useState(false)
  const onStart = ()=>setStart(true)

  return (
    <div className="App">
      {start ? (<Trackview/>) : (<WelcomeView onStart={onStart}/>)}
    </div>
  );
}