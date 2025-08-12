import React from "react";
import ReactDOM from "react-dom";
import "react-toastify/dist/ReactToastify.css";
import "./styles/styles.scss";
import "bootstrap/dist/css/bootstrap.min.css";

import App from "./containers/App";
import * as serviceWorker from "./serviceWorker";
import IntlProviderWrapper from "./hoc/IntlProviderWrapper";

import { Provider } from "react-redux";
import reduxStore, { persistor } from "./redux";
import { GoogleOAuthProvider } from "@react-oauth/google";

const renderApp = () => {
  ReactDOM.render(
    <Provider store={reduxStore}>
      <GoogleOAuthProvider clientId="197540518658-2ghgu7rlg2neuna5asvo0ujrbjumfqo9.apps.googleusercontent.com">
        <IntlProviderWrapper>
          <App persistor={persistor} />
        </IntlProviderWrapper>
      </GoogleOAuthProvider>
    </Provider>,
    document.getElementById("root")
  );
};

renderApp();
serviceWorker.unregister();
