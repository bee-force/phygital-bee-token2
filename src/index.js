import { render } from "react-dom";
import 'bootstrap/dist/css/bootstrap.css';
import App from './frontend/components/App';
import * as serviceWorker from './serviceWorker';

const rootElement = document.getElementById("root");
render( <App />, rootElement);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
serviceWorker.unregister();
