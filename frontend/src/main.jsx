import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
<<<<<<< HEAD
import { BrowserRouter } from 'react-router-dom'
//import AppContextProvider from './context/AppContext.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>

    {/* <AppContextProvider> */}
     
     <App />

   {/* </AppContextProvider> */}
    </BrowserRouter>
   
  </StrictMode>,
=======
import  {Provider} from 'react-redux'
import { store } from './redux/store.js'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    
    <Provider store={store}>
       <App />
    </Provider>
    </BrowserRouter>
  </StrictMode>
 
>>>>>>> 51a0b6f (first)
)
