import React, { useState, useMemo } from 'react';
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
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';
import ChecklistIcon from '@mui/icons-material/Checklist';
import UploadIcon from '@mui/icons-material/Upload';
import { useNavigate } from 'react-router-dom';
import UploadDialog from './UploadDialog';

interface Document {
  id: string;
  name: string;
  type: string;
  client: string;
  lastUpdatedBy: string;
  lastUpdatedDate: string;
  status: string;
}

// Sample data - replace with actual data fetching logic
const sampleDocuments: Document[] = [
  {
    id: '1',
    name: 'Contract 2024',
    type: 'PDF',
    client: 'Acme Corp',
    lastUpdatedBy: 'John Doe',
    lastUpdatedDate: '2024-03-20',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Financial Report Q1',
    type: 'PDF',
    client: 'Tech Corp',
    lastUpdatedBy: 'Jane Smith',
    lastUpdatedDate: '2024-03-19',
    status: 'Pending',
  },
  {
    id: '3',
    name: 'Legal Document',
    type: 'PDF',
    client: 'Acme Corp',
    lastUpdatedBy: 'Mike Johnson',
    lastUpdatedDate: '2024-03-15',
    status: 'Completed',
  },
  {
    id: '4',
    name: 'Project Proposal',
    type: 'PDF',
    client: 'Global Inc',
    lastUpdatedBy: 'Sarah Wilson',
    lastUpdatedDate: '2024-03-10',
    status: 'Active',
  },
];

const dateRanges = [
  { value: '7', label: 'Last 7 Days' },
  { value: '30', label: 'Last 30 Days' },
  { value: '90', label: 'Last 90 Days' },
];

const DocumentList: React.FC = () => {
  const navigate = useNavigate();
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // Get unique clients and statuses from the data
  const clients = useMemo(() => 
    Array.from(new Set(sampleDocuments.map(doc => doc.client))),
    []
  );

  const statuses = useMemo(() => 
    Array.from(new Set(sampleDocuments.map(doc => doc.status))),
    []
  );

  const handleDocumentClick = (document: Document) => {
    localStorage.setItem('selectedDocument', JSON.stringify(document));
    navigate('/viewer');
  };

  const handleEditClick = (e: React.MouseEvent, document: Document) => {
    e.stopPropagation();
    localStorage.setItem('selectedDocument', JSON.stringify(document));
    navigate('/run-checks');
  };

  // Filter documents based on selected filters
  const filteredDocuments = useMemo(() => {
    return sampleDocuments.filter(doc => {
      const matchesClient = !selectedClient || doc.client === selectedClient;
      const matchesStatus = !selectedStatus || doc.status === selectedStatus;
      
      let matchesDateRange = true;
      if (selectedDateRange) {
        const docDate = new Date(doc.lastUpdatedDate);
        const today = new Date();
        const daysDiff = Math.floor((today.getTime() - docDate.getTime()) / (1000 * 60 * 60 * 24));
        matchesDateRange = daysDiff <= parseInt(selectedDateRange);
      }

      return matchesClient && matchesStatus && matchesDateRange;
    });
  }, [selectedClient, selectedStatus, selectedDateRange]);

  const handleRefresh = () => {
    // Add refresh logic here
    console.log('Refreshing document list');
  };

  const handleChecks = () => {
    navigate('/checks');
  };

  const handleUpload = () => {
    setUploadDialogOpen(true);
  };

  return (
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        Financial Statement Records
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
            Client
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel>Client</InputLabel>
            <Select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
            >
              <MenuItem value="">All Clients</MenuItem>
              {clients.map((client) => (
                <MenuItem key={client} value={client}>
                  {client}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
            Status
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <MenuItem value="">All Statuses</MenuItem>
              {statuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
            Date Range
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel>Date Range</InputLabel>
            <Select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
            >
              <MenuItem value="">All Time</MenuItem>
              {dateRanges.map((range) => (
                <MenuItem key={range.value} value={range.value}>
                  {range.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 1, mb: 2, justifyContent: 'flex-end' }}>
        <Tooltip title="Refresh">
          <IconButton
            size="small"
            onClick={handleRefresh}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Checks">
          <IconButton
            size="small"
            onClick={handleChecks}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <ChecklistIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Upload">
          <IconButton
            size="small"
            onClick={handleUpload}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <UploadIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <TableContainer component={Paper} sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Table sx={{ minWidth: 650 }} aria-label="document list">
          <TableHead>
            <TableRow>
              <TableCell>Document Name</TableCell>
              <TableCell>Document Type</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Last Updated By</TableCell>
              <TableCell>Last Updated Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center" sx={{ width: '50px' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDocuments.map((document) => (
              <TableRow
                key={document.id}
                hover
                onClick={() => handleDocumentClick(document)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDocumentClick(document);
                    }}
                  >
                    {document.name}
                  </Link>
                </TableCell>
                <TableCell>{document.type}</TableCell>
                <TableCell>{document.client}</TableCell>
                <TableCell>{document.lastUpdatedBy}</TableCell>
                <TableCell>{document.lastUpdatedDate}</TableCell>
                <TableCell>{document.status}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={(e) => handleEditClick(e, document)}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <UploadDialog 
        open={uploadDialogOpen} 
        onClose={() => setUploadDialogOpen(false)} 
      />
    </Box>
  );
};

export default DocumentList; 