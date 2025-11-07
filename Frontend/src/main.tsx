import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { Provider as ReduxProvider } from "react-redux"; 
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import Provider from "./Provider"; 

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <AuthProvider>
        <CartProvider>
          <ReduxProvider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <App />
            </PersistGate>
          </ReduxProvider>
        </CartProvider>
      </AuthProvider>
    </Provider>
  </StrictMode>
);
