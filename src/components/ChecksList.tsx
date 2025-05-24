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
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CheckForm from './CheckForm';

interface Check {
  id: string;
  check_name: string;
  check_description: string;
  detailed_prompt: string;
  associated_sections: string[];
  last_updated_date: string;
}

const sampleChecks: Check[] = [
  {
    id: '1',
    check_name: 'Page Margins',
    check_description: 'Verify that all page margins are set to 1 inch on all sides of the document. This includes top, bottom, left, and right margins. The margins should be consistent throughout the entire document and should not vary between sections.',
    detailed_prompt: 'Check all pages of the document for consistent 1-inch margins. Verify that no content extends beyond the margins and that the layout is uniform throughout.',
    associated_sections: ['Document Formatting', 'Page Layout'],
    last_updated_date: '2024-03-20',
  },
  {
    id: '2',
    check_name: 'Executive Summary',
    check_description: 'Check if executive summary is present and properly formatted. The summary should include key findings, recommendations, and a brief overview of the document. It should be concise yet comprehensive, providing a clear snapshot of the main points covered in the document.',
    detailed_prompt: 'Review the executive summary section for completeness and proper formatting. Ensure it captures the main points of the document and follows the standard executive summary format.',
    associated_sections: ['Content Review', 'Document Structure'],
    last_updated_date: '2024-03-19',
  },
  {
    id: '3',
    check_name: 'Financial Data',
    check_description: 'Verify all financial data is accurate and properly formatted. This includes checking numerical values, currency symbols, decimal places, and date formats. Ensure that all calculations are correct and that the data is presented in a clear, consistent manner throughout the document.',
    detailed_prompt: 'Examine all financial figures, tables, and calculations in the document. Verify the accuracy of numbers, proper use of currency symbols, and consistent decimal places. Check that all calculations are correct and properly referenced.',
    associated_sections: ['Content Review', 'Data Validation'],
    last_updated_date: '2024-03-18',
  },
  {
    id: '4',
    check_name: 'Document Headers',
    check_description: 'Ensure that all document headers are properly formatted and consistent throughout the document. Headers should include the document title, section numbers, and page numbers. Check that the header style matches the document template and that there are no formatting inconsistencies.',
    detailed_prompt: 'Review all headers in the document for consistency in style, formatting, and content. Verify that headers include the correct document title, section numbers, and page numbers. Check that the header style matches the document template.',
    associated_sections: ['Document Formatting', 'Page Layout'],
    last_updated_date: '2024-03-17',
  },
  {
    id: '5',
    check_name: 'Table Formatting',
    check_description: 'Review all tables in the document for proper formatting and consistency. This includes checking column widths, row heights, cell padding, borders, and text alignment. Tables should be properly numbered and referenced in the text, with clear headers and appropriate spacing.',
    detailed_prompt: 'Examine all tables in the document for proper formatting and consistency. Check column widths, row heights, cell padding, borders, and text alignment. Verify that tables are properly numbered and referenced in the text.',
    associated_sections: ['Document Formatting', 'Content Review'],
    last_updated_date: '2024-03-16',
  }
];

const ChecksList: React.FC = () => {
  const [checks, setChecks] = useState<Check[]>(sampleChecks);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCheck, setEditingCheck] = useState<Check | undefined>();

  const handleEdit = (id: string) => {
    const check = checks.find(c => c.id === id);
    setEditingCheck(check);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setChecks(checks.filter(check => check.id !== id));
  };

  const handleAdd = () => {
    setEditingCheck(undefined);
    setFormOpen(true);
  };

  const handleSave = (checkData: Omit<Check, 'id' | 'last_updated_date'>) => {
    if (editingCheck) {
      // Update existing check
      setChecks(checks.map(check => 
        check.id === editingCheck.id 
          ? { ...check, ...checkData, last_updated_date: new Date().toISOString().split('T')[0] }
          : check
      ));
    } else {
      // Add new check
      const newCheck: Check = {
        id: Date.now().toString(),
        ...checkData,
        last_updated_date: new Date().toISOString().split('T')[0],
      };
      setChecks([...checks, newCheck]);
    }
    setFormOpen(false);
  };

  return (
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Control Checks
        </Typography>
        <Tooltip title="Add Check">
          <IconButton
            size="small"
            onClick={handleAdd}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <TableContainer component={Paper} sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Table sx={{ minWidth: 650 }} aria-label="checks list">
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ width: '100px' }}>Actions</TableCell>
              <TableCell>Check Name</TableCell>
              <TableCell sx={{ maxWidth: '300px' }}>Description</TableCell>
              <TableCell>Associated Sections</TableCell>
              <TableCell>Last Updated</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {checks.map((check) => (
              <TableRow key={check.id}>
                <TableCell align="center">
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(check.id)}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
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
                <TableCell>{check.check_name}</TableCell>
                <TableCell 
                  sx={{ 
                    maxWidth: '300px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {check.check_description}
                </TableCell>
                <TableCell>{check.associated_sections.join(', ')}</TableCell>
                <TableCell>{check.last_updated_date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CheckForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        initialData={editingCheck}
      />
    </Box>
  );
};

export default ChecksList; 