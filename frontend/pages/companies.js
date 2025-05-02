// frontend/pages/companies.js
import { useState, useEffect } from 'react';
import PrivateRoute from '../components/auth/PrivateRoute';
import {
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Box,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import CompanyForm from '../components/superadmin/CompanyForm';
import companyService from '../services/companyService';
import { toast } from 'react-toastify';

function CompaniesContent() {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async (search = '') => {
    try {
      const response = await companyService.getAll({ search });
      setCompanies(response.data.data);
    } catch (error) {
      toast.error('Error fetching companies');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCompanies(searchTerm);
  };

  const handleAdd = () => {
    setSelectedCompany(null);
    setOpenForm(true);
  };

  const handleEdit = (company) => {
    setSelectedCompany(company);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await companyService.delete(id);
        toast.success('Company deleted successfully');
        fetchCompanies();
      } catch (error) {
        toast.error('Error deleting company');
      }
    }
  };

  const handleFormClose = () => {
    setOpenForm(false);
    setSelectedCompany(null);
    fetchCompanies();
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4">Companies</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Add Company
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            label="Search companies"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
          />
          <Button type="submit" variant="contained" startIcon={<SearchIcon />}>
            Search
          </Button>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Website</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Zip Code</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company._id}>
                <TableCell>{company.name}</TableCell>
                <TableCell>{company.address}</TableCell>
                <TableCell>{company.website}</TableCell>
                <TableCell>{company.phone}</TableCell>
                <TableCell>{company.zipCode}</TableCell>
                <TableCell>
                  <Chip
                    label={company.status}
                    color={company.status === 'active' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(company)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(company._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CompanyForm
        open={openForm}
        onClose={handleFormClose}
        company={selectedCompany}
      />
    </Container>
  );
}

export default function Companies() {
  return (
    <PrivateRoute allowedRoles={['superadmin']}>
      <CompaniesContent />
    </PrivateRoute>
  );
}