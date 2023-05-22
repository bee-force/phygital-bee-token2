/* In the context of a React application, the index.js file serves as the entry point for the application. 
Its primary purpose is to render the main React component, <App />, into the DOM. The DOM provides the 
interface for JavaScript to interact with the HTML document, while React manages the rendering and updating 
of components within the DOM. It abstracts the DOM in a way that allows developers to work with components 
instead of directly dealing with HTML elements. The rendering process involves several steps. Firstly, the 
getElementById method is used to retrieve the DOM element with the id "root". This element, typically a <div>, 
serves as the mounting point where the React component tree will be inserted. Next, the render function from 
the react-dom library is called to render the <App /> component into the specified DOM element. The <App /> 
component represents the root of the component tree. During rendering, React creates an instance of the <App /> 
component, generates its corresponding JSX markup, and attaches it to the DOM at the mounting point. This 
process is known as mounting, as it involves creating and inserting the component into the DOM for the first time.
The <App /> component acts as the root of the component tree, which is a hierarchical composition of React components. 
Each component can contain other components, forming a tree-like structure. Components in the tree can have their 
own state and properties (props) that determine their behavior and appearance. React manages the component tree, 
and if there are changes in the component state or prop values, it re-renders the affected components and updates 
the DOM to reflect the new state of the component tree. By combining the functionality of index.js and the App.js 
component, React takes control of the specified DOM element and handles subsequent updates and changes to the component tree. 
This combination allows for the creation of dynamic, interactive user interfaces that reflect the state and behavior 
defined within the React components, providing a seamless and efficient user experience. */

// Import the render function from the react-dom library
import { render } from "react-dom";

// Import the Bootstrap CSS file for styling
import 'bootstrap/dist/css/bootstrap.css';

// Import the main App component
import App from './frontend/components/App';

// Import the serviceWorker for handling Progressive Web App functionality
import * as serviceWorker from './serviceWorker';

// Get the root element from the HTML file
const rootElement = document.getElementById("root");

// Render the App component inside the root element
render(<App />, rootElement);

// Unregister the service worker (optional)
serviceWorker.unregister();
