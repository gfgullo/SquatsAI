import { Link } from 'react-router-dom';
import '../style/App.css';

export default function WelcomeView() {

  return (
    <div className="Welcome">
          <h1>APPESANTITO DALLE FESTE ?</h1>
          <h2>Fai 20 squats per vincere un regalo</h2>
          <img className="sample" src="res/video.gif"/>
          <p>Le immagini catturate dalla tua webcam vengono processate sul browser, nulla viene inviato ai nostri server</p>
          <Link className="button" to='/squats'>Inizia Ora</Link>
          <img className="logo" src="res/logo.png"/>
    </div>
  );
}