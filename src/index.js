import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_m61QXqQmo",  // Cognito User Pool URL
  client_id: "55b82psg55qubr8q6dmbrliq2u",  // Client ID from Cognito
  redirect_uri: "https://eventplanner.lopezbio.com",  // The redirect URI for the app
  response_type: "code",  // Response type for authorization code
  scope: "phone openid email",  // Scopes to request
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider {...cognitoAuthConfig}>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
