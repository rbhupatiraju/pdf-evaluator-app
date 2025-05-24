import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Button,
  Tooltip,
  Link,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

interface CheckRow {
  id: string;
  documentSection: string;
  associatedSection: string;
  associatedCheck: string;
}

const RunChecks: React.FC = () => {
  const navigate = useNavigate();
  const [checks, setChecks] = useState<CheckRow[]>([
    {
      id: '1',
      documentSection: 'Introduction',
      associatedSection: 'Document Formatting',
      associatedCheck: 'Page Margins',
    },
    {
      id: '2',
      documentSection: 'Executive Summary',
      associatedSection: 'Content Review',
      associatedCheck: 'Executive Summary',
    },
    {
      id: '3',
      documentSection: 'Financial Data',
      associatedSection: 'Content Review',
      associatedCheck: 'Financial Data',
    },
  ]);

  const handleDelete = (id: string) => {
    setChecks(checks.filter(check => check.id !== id));
  };

  const handleRunChecks = () => {
    // Add your run checks logic here
    console.log('Running checks:', checks);
  };

  const handleViewResults = () => {
    navigate('/viewer');
  };

  return (
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        Run Checks on Document
      </Typography>

      <TableContainer component={Paper} sx={{ flex: 1, display: 'flex', flexDirection: 'column', mb: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="checks list">
          <TableHead>
            <TableRow>
              <TableCell>Document Section</TableCell>
              <TableCell>Associated Section</TableCell>
              <TableCell>Associated Check</TableCell>
              <TableCell align="center" sx={{ width: '50px' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {checks.map((check) => (
              <TableRow key={check.id}>
                <TableCell>{check.documentSection}</TableCell>
                <TableCell>{check.associatedSection}</TableCell>
                <TableCell>{check.associatedCheck}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(check.id)}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Link
          component="button"
          variant="body2"
          onClick={handleViewResults}
          sx={{ 
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
        >
          View Results
        </Link>
        <Button
          variant="contained"
          color="primary"
          onClick={handleRunChecks}
          sx={{ minWidth: '120px' }}
        >
          Run Checks
        </Button>
      </Box>
    </Box>
  );
};

export default RunChecks; 