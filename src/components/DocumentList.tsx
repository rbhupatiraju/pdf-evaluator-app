import ChecklistIcon from '@mui/icons-material/Checklist';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import RefreshIcon from '@mui/icons-material/Refresh';
import UploadIcon from '@mui/icons-material/Upload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Box,
  FormControl,
  Grid,
  IconButton,
  Link,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadDialog from './UploadDialog';

interface Document {
  document_id: string;
  document_name: string;
  document_type: string;
  client_name: string;
  last_updated_by: string;
  last_updated_date: string;
  status: string;
}

// Sample data - replace with actual data fetching logic
const sampleDocuments: Document[] = [
  {
    document_id: '1',
    document_name: 'Contract 2024',
    document_type: 'PDF',
    client_name: 'Acme Corp',
    last_updated_by: 'John Doe',
    last_updated_date: '2024-03-20',
    status: 'CHECKS COMPLETE',
  },
  {
    document_id: '2',
    document_name: 'Financial Report Q1',
    document_type: 'PDF',
    client_name: 'Tech Corp',
    last_updated_by: 'Jane Smith',
    last_updated_date: '2024-03-19',
    status: 'EXTRACTION IN PROGRESS',
  },
  {
    document_id: '3',
    document_name: 'Legal Document',
    document_type: 'PDF',
    client_name: 'Acme Corp',
    last_updated_by: 'Mike Johnson',
    last_updated_date: '2024-03-15',
    status: 'CHECKS IN PROGRESS',
  },
  {
    document_id: '4',
    document_name: 'Project Proposal',
    document_type: 'PDF',
    client_name: 'Global Inc',
    last_updated_by: 'Sarah Wilson',
    last_updated_date: '2024-03-10',
    status: 'EXTRACTION COMPLETED',
  },
  {
    document_id: '5',
    document_name: 'Annual Report 2023',
    document_type: 'PDF',
    client_name: 'Acme Corp',
    last_updated_by: 'John Doe',
    last_updated_date: '2024-03-05',
    status: 'FILE UPLOADED',
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
    Array.from(new Set(sampleDocuments.map(doc => doc.client_name))),
    []
  );

  const statuses = [
    'FILE UPLOADED',
    'EXTRACTION IN PROGRESS',
    'EXTRACTION COMPLETED',
    'CHECKS IN PROGRESS',
    'CHECKS COMPLETE'
  ];

  const handleDocumentClick = (document: Document) => {
    localStorage.setItem('selectedDocument', JSON.stringify(document));
    navigate('/viewer');
  };

  const handleDownload = (e: React.MouseEvent, document: Document) => {
    e.stopPropagation();
    console.log('Downloading document:', document.document_name);
    // TODO: Implement actual download functionality
  };

  const handleViewClick = (e: React.MouseEvent, document: Document) => {
    e.stopPropagation();
    localStorage.setItem('selectedDocument', JSON.stringify(document));
    navigate(`/viewer/${document.document_id}`);
  };

  const handleEditClick = (e: React.MouseEvent, document: Document) => {
    e.stopPropagation();
    localStorage.setItem('selectedDocument', JSON.stringify(document));
    navigate(`/run-checks/${document.document_id}`);
  };

  // Filter documents based on selected filters
  const filteredDocuments = useMemo(() => {
    return sampleDocuments.filter(doc => {
      const matchesClient = !selectedClient || doc.client_name === selectedClient;
      const matchesStatus = !selectedStatus || doc.status === selectedStatus;
      
      let matchesDateRange = true;
      if (selectedDateRange) {
        const docDate = new Date(doc.last_updated_date);
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
            <Select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              displayEmpty
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
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              displayEmpty
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
            <Select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              displayEmpty
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
              <TableCell align="center" sx={{ width: '120px' }}>Actions</TableCell>
              <TableCell>Document Name</TableCell>
              <TableCell>Document Type</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Last Updated By</TableCell>
              <TableCell>Last Updated Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDocuments.map((document) => (
              <TableRow
                key={document.document_id}
                hover
                onClick={() => handleDocumentClick(document)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Tooltip title="View">
                      <span>
                        <IconButton
                          size="small"
                          onClick={(e) => handleViewClick(e, document)}
                          disabled={document.status !== 'CHECKS COMPLETE'}
                          sx={{
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            },
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="History">
                      <span>
                        <IconButton
                          size="small"
                          disabled
                          sx={{
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            },
                          }}
                        >
                          <HistoryIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
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
                  </Box>
                </TableCell>
                <TableCell>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={(e) => handleDownload(e, document)}
                  >
                    {document.document_name}
                  </Link>
                </TableCell>
                <TableCell>{document.document_type}</TableCell>
                <TableCell>{document.client_name}</TableCell>
                <TableCell>{document.last_updated_by}</TableCell>
                <TableCell>{document.last_updated_date}</TableCell>
                <TableCell>{document.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <UploadDialog 
        open={uploadDialogOpen} 
        onClose={() => setUploadDialogOpen(false)}
        onUpload={(file) => {
          console.log('Uploading file:', file);
          setUploadDialogOpen(false);
        }}
      />
    </Box>
  );
};

export default DocumentList; 