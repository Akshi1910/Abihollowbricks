import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Auth0Provider} from '@auth0/auth0-react';

createRoot(document.getElementById('root')).render(
  <Auth0Provider
  domain="dev-qes5ylsamzvmum5h.us.auth0.com"
  clientId="kzlaMGWIAhYCwtOxY00CAkQu8723bMcw"
  authorizationParams={{
    redirect_uri: window.location.origin,
  }}
  >
  <StrictMode>
    <App />
  </StrictMode>,
  </Auth0Provider>
)
