import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './redux/Store';
import { fetchProfile } from './redux/slices/authSlice';
import AppRoutes from './routes';
import './assets/style/global.css';

const theme = createTheme({
  typography: {
    fontFamily: "'Plus Jakarta Sans', 'Poppins', sans-serif",
    allVariants: {
      lineHeight: 'normal',
    },
  },
  palette: {
    primary: {
      main: '#002147',
      light: '#00509d',
      dark: '#001529',
    },
    secondary: {
      main: '#f1b000',
    },
    background: {
      default: '#f7f7f7',
      paper: '#ffffff',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            backgroundColor: '#ffffff',
          },
        },
      },
    },
  },
});

export const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchProfile());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          reverseOrder={false}
          containerStyle={{ zIndex: 999999 }}
          toastOptions={{
            duration: 3000,
            style: {
              maxWidth: 'unset',
              fontSize: '14px',
              fontFamily: "'Plus Jakarta Sans', 'Poppins', sans-serif",
            },
          }}
        />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
