import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'
// Cấu hình Redux Store
import { Provider } from 'react-redux'
import { store } from '~/redux/store'
import { ConfirmProvider } from 'material-ui-confirm'

// Cấu hình Redux-Persist
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
const persistor = persistStore(store)

import App from './App';
import 'aos/dist/aos.css';
import AOS from 'aos';

AOS.init();
// Kỹ thuật Inject Store
import { injectStore } from './utils/authorizeAxios'
injectStore(store)


const root = createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <BrowserRouter basename='/'>
      <ConfirmProvider>
        <App />
      </ConfirmProvider>
    </BrowserRouter>
  </Provider>
)