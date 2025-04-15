import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'
// Cấu hình Redux Store
import { Provider } from 'react-redux'
import { store } from '~/redux/store'
import { ConfirmProvider } from 'material-ui-confirm'
// Add Material-UI theme provider
import { ThemeProvider as ThemeProviderV5 } from '@mui/material/styles';

import { StyledEngineProvider } from '@mui/material/styles';
import { LayoutProvider } from './context/LayoutContext';
import { UserProvider } from './context/UserContext';
import { ManagementProvider } from './context/ManagementContext';
import {
  ThemeProvider as ThemeChangeProvider,
  ThemeStateContext,
  useThemeState
} from './context/ThemeContext';
import CssBaseline from '@mui/material/CssBaseline';

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

// Component con sử dụng hook thay vì Consumer
function ThemedApp() {
  const theme = useThemeState();
  return (
    <ThemeProviderV5 theme={theme}>
      <ManagementProvider>
        <CssBaseline />
        <ConfirmProvider>
          <App />
          <ToastContainer position="bottom-left" theme="colored" />
        </ConfirmProvider>
      </ManagementProvider>
    </ThemeProviderV5>
  );
}

const root = createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <LayoutProvider>
        <UserProvider>
          <StyledEngineProvider injectFirst>
            <ThemeChangeProvider>
              <BrowserRouter basename='/'>
                <ThemedApp />
              </BrowserRouter>
            </ThemeChangeProvider>
          </StyledEngineProvider>
        </UserProvider>
      </LayoutProvider>
    </PersistGate>
  </Provider>
)