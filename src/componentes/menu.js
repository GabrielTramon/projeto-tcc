import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TimelineIcon from '@mui/icons-material/Timeline';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const NAVIGATION = [
  {
    kind: 'header',
    title: 'Menu items',
  },
  {
    segment: 'painel/venda',
    title: 'Venda',
    icon: <TimelineIcon />,
  },
  {
    segment: 'painel/adcCliente',
    title: 'Adicionar Clientes',
    icon: <DashboardIcon />,
  },
  {
    segment: 'painel/crudCliente',
    title: 'Pesquisa Clientes',
    icon: <DashboardIcon />,
  },
  {
    segment: 'painel/adcProduto',
    title: 'Adicionar Produtos',
    icon: <DashboardIcon />,
  },
  {
    segment: 'painel/crudProduto',
    title: 'Pesquisa Produtos',
    icon: <TimelineIcon />,
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'orders',
    title: 'Orders',
    icon: <ShoppingCartIcon />,
  },
];

const customTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: '#F9F9FE',
          paper: '#EEEEF9',
        },
      },
    },
    dark: {
      palette: {
        background: {
          default: '#2A4364',
          paper: '#112E4D',
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }) {
  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Typography>Dashboard content for {pathname}</Typography>
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function AppProviderTheme(props) {
  const { window, logoUrl } = props;
  const location = useLocation().pathname;

  const [pathname, setPathname] = React.useState('');
  const navigate = useNavigate();

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  React.useEffect(() => {
    if (!pathname) return;
    navigate(pathname);
  }, [pathname]);

  React.useEffect(() => {
    setPathname(location);
  }, [location]);

  // Remove this const when copying and pasting into your project.
  const demoWindow = window !== undefined ? window() : undefined;

  return (
    // preview-start
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={customTheme}
      window={demoWindow}
      branding={{
        logo: <img src={logoUrl} alt="Logo" style={{ height: '40px' }} />,
        title: 'T&T Sistens',
      }}
    >
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </AppProvider>
    // preview-end
  );
}

AppProviderTheme.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
  /**
   * URL for the logo image.
   */
  logoUrl: PropTypes.string.isRequired,
};

export default AppProviderTheme;
