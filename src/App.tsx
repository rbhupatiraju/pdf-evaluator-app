import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import PDFViewer from './components/PDFViewer';
import DocumentList from './components/DocumentList';
import RunChecks from './components/RunChecks';
import ChecksList from './components/ChecksList';
import { Box, Grid, Typography, AppBar, Toolbar, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
  typography: {
    fontSize: 13,
    h6: {
      fontSize: '1rem',
    },
    body1: {
      fontSize: '0.875rem',
    },
    body2: {
      fontSize: '0.75rem',
    },
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: '0.75rem',
          padding: '8px 16px',
        },
        head: {
          fontSize: '0.75rem',
          fontWeight: 600,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: '0.75rem',
          borderRadius: 0,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: '4px',
          borderRadius: 0,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: '0.75rem',
          height: '24px',
          borderRadius: 0,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          '&:before': {
            display: 'none',
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          backgroundColor: '#f5f5f5',
          '&:hover': {
            backgroundColor: '#eeeeee',
          },
        },
      },
    },
  },
});

interface Document {
  id: string;
  name: string;
  type: string;
  client: string;
  lastUpdatedBy: string;
  lastUpdatedDate: string;
  status: string;
}

const AppBarWithNavigation = () => {
  const navigate = useNavigate();

  return (
    <AppBar 
      position="static" 
      sx={{ 
        bgcolor: '#1976d2', // Material-UI primary blue
        '& .MuiToolbar-root': {
          minHeight: '48px'
        }
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          PDF Evaluator
        </Typography>
        <IconButton 
          edge="end" 
          color="inherit" 
          aria-label="home"
          onClick={() => navigate('/')}
          sx={{ 
            ml: 2,
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <HomeIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
          <AppBarWithNavigation />
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <Routes>
              <Route path="/" element={<DocumentList />} />
              <Route path="/viewer/:documentId" element={<PDFViewer />} />
              <Route path="/run-checks/:documentId" element={<RunChecks />} />
              <Route path="/checks" element={<ChecksList />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App; 