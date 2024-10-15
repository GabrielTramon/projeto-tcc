import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import SearchIcon from '@mui/icons-material/Search';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DateRangeIcon from '@mui/icons-material/DateRange';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import logo2 from "../assets/logo2.png";


const NAVIGATION = [
  {
    kind: 'header',
    title: 'Menu items',
  },
  {
    segment: 'painel/venda',
    title: 'Venda',
    icon: <PointOfSaleIcon />,
  },
  {
    segment: 'painel/adcCliente',
    title: 'Adicionar Clientes',
    icon: <PersonAddIcon/>,
  },
  {
    segment: 'painel/crudCliente',
    title: 'Pesquisar Clientes',
    icon: <PersonSearchIcon/>,
  },
  {
    segment: 'painel/adcProduto',
    title: 'Adicionar Produtos',
    icon: <LocalMallIcon/>,
  },
  {
    segment: 'painel/crudProduto',
    title: 'Pesquisar Produtos',
    icon: <SearchIcon/>,
  },
  {
    segment: 'painel/adcVendedor',
    title: 'Adicionar Vendedor',
    icon: <PersonAddIcon/>,
  },
  {
    segment: 'painel/crudVendedor',
    title: 'Pesquisar Vendedores',
    icon: <PersonSearchIcon/>,
  },
  {
    segment: 'painel/adcAgenda',
    title: 'Adicionar Agenda',
    icon: <DateRangeIcon/>,
  },
  {
    segment: 'painel/crudAgenda',
    title: 'Pesquisa Agenda',
    icon: <SearchIcon/>,
  },
  {
    segment: 'painel/faturamento',
    title: 'Faturamento',
    icon: <AttachMoneyIcon/>,
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
          default: '#121212',
          paper: '#121212',
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
  const { window } = props;
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
        logo: <img src={logo2} alt="Logo" style={{ height: '100px', width: '200px'}} />,
        title: '',
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
