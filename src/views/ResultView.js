import '../style/App.css';
import { useRef } from 'react';
import { useHistory } from "react-router-dom";

export default function ResultView() {

  const history = useHistory();
  const emailRef = useRef(null);

  const onSubmit = e => {
    e.preventDefault();  
    console.log("click");
    console.log(emailRef.current.value);
    history.push("/complete")
  }

  return (
    <div className="Result">
          <h1>OTTIMO LAVORO !</h1>
          <h3>Inserisci la tua email per ricevere il premio</h3>

          <form onSubmit={onSubmit}>
            <input type='text' ref={emailRef}/>
            <p>*Confermo di aver preso visione della Privacy Policy.</p>
            <input type='submit'/>
      </form>
      <img className="logo" src="res/logo.png"/>
    </div>
  );
}