import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext'
const queryclient = new QueryClient()
import { disableReactDevTools } from '@fvilers/disable-react-devtools';
disableReactDevTools()

ReactDOM.createRoot(document.getElementById('root')).render(
 // <React.StrictMode>
    <QueryClientProvider client={queryclient}>
      <BrowserRouter>
        <AuthProvider>      
          <App />
        </AuthProvider>
      </BrowserRouter> 
    </QueryClientProvider>
  //</React.StrictMode>,
)
