// frontend/pages/users.js
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
import UserForm from '../components/superadmin/UserForm';
import userService from '../services/userService';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

function UsersContent() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (search = '') => {
    try {
      const params = { search };
      if (currentUser.role !== 'superadmin') {
        params.companyId = currentUser.companyId;
      }
      const response = await userService.getAll(params);
      setUsers(response.data.data);
    } catch (error) {
      toast.error('Error fetching users');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(searchTerm);
  };

  const handleAdd = () => {
    setSelectedUser(null);
    setOpenForm(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.delete(id);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error deleting user');
      }
    }
  };

  const handleFormClose = () => {
    setOpenForm(false);
    setSelectedUser(null);
    fetchUsers();
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'superadmin':
        return 'error';
      case 'admin':
        return 'primary';
      case 'editor':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4">Users</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Add User
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            label="Search users"
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
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.companyId?.name || '-'}</TableCell>
                <TableCell>{user.locations || '-'}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    color={getRoleColor(user.role)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.status}
                    color={user.status === 'active' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(user)}
                  >
                    <EditIcon />
                  </IconButton>
                  {user._id !== currentUser._id && (
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(user._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <UserForm
        open={openForm}
        onClose={handleFormClose}
        user={selectedUser}
      />
    </Container>
  );
}

export default function Users() {
  return (
    <PrivateRoute allowedRoles={['superadmin', 'admin']}>
      <UsersContent />
    </PrivateRoute>
  );
}