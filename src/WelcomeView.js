import React, { useState } from 'react';
import './App.css';
import ReactPlayer from 'react-player'

export default function WelcomeView({onStart}) {

  return (
    <div className="Welcome">
          <h1>Fai 50 Squats e vinci un regalo !</h1>
          <ReactPlayer url='video.mp4' playing={true} loop={true}/>
          <button onClick={()=>onStart()}>Inizia</button>
          <p>Le immagini catturate dalla tua webcam vengono processate sul browser, nulla viene inviato ai nostri server</p>
    </div>
  );
}