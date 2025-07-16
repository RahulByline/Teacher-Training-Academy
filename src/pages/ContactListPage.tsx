import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Search,
  Upload,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../config/axiosConfig';

interface Email {
  id: number;
  contact_id: number;
  email: string;
  type: string;
  is_primary?: boolean;
}

interface Phone {
  id: number;
  contact_id: number;
  phone: string;
  type: string;
}

interface Company {
  id: number;
  name: string;
  industry?: string;
  city?: string;
}

interface Contact {
  id: number;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  emails: Email[];
  phones: Phone[];
  company?: Company;
  department?: string;
  tags?: string;
  lead_status?: string;
  created_at: string;
}

const ContactListPage: React.FC = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalContacts, setTotalContacts] = useState(0);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchContacts();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      if (statusFilter) {
        params.append('status', statusFilter);
      }

      const response = await api.get(`/contacts?${params.toString()}`);
      setContacts(response.data.contacts);
      setTotalPages(response.data.pagination.total_pages);
      setTotalContacts(response.data.pagination.total);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await api.delete(`/contacts/${id}`);
        fetchContacts();
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to delete contact');
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (e: any) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'default';
      case 'contacted':
        return 'info';
      case 'qualified':
        return 'success';
      case 'unqualified':
        return 'error';
      case 'customer':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Contacts
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your customer contacts ({totalContacts} total)
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<Upload />}
            onClick={() => navigate('/import')}
          >
            Import Contacts
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/contacts/new')}
          >
            Add Contact
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <Box p={3}>
          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <TextField
              placeholder="Search contacts..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{ minWidth: 250 }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="new">New</MenuItem>
                <MenuItem value="contacted">Contacted</MenuItem>
                <MenuItem value="qualified">Qualified</MenuItem>
                <MenuItem value="unqualified">Unqualified</MenuItem>
                <MenuItem value="customer">Customer</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Card>

      <Card>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Emails</TableCell>
                <TableCell>Phones</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Industry</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : contacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No contacts found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                contacts.map((contact) => (
                  <TableRow key={contact.id} hover>
                    <TableCell>
                      {contact.full_name || 
                       `${contact.first_name || ''} ${contact.last_name || ''}`.trim() || 
                       'N/A'}
                    </TableCell>
                    <TableCell>
                      {contact.emails && contact.emails.length > 0
                        ? contact.emails.map(e => e.email).join(', ')
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {contact.phones && contact.phones.length > 0
                        ? contact.phones.map(p => p.phone).join(', ')
                        : 'N/A'}
                    </TableCell>
                    <TableCell>{contact.company?.name || 'N/A'}</TableCell>
                    <TableCell>{contact.company?.industry || 'N/A'}</TableCell>
                    <TableCell>{contact.company?.city || 'N/A'}</TableCell>
                    <TableCell>{contact.department || 'N/A'}</TableCell>
                    <TableCell>{contact.tags || 'N/A'}</TableCell>
                    <TableCell>
                      <Chip
                        label={contact.lead_status}
                        color={getStatusColor(contact.lead_status || 'default') as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDate(contact.created_at)}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/contacts/${contact.id}`)}
                        title="View"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/contacts/${contact.id}/edit`)}
                        title="Edit"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(contact.id)}
                        title="Delete"
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" p={3}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, page) => setCurrentPage(page)}
              color="primary"
            />
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default ContactListPage;