// frontend/components/superadmin/UserForm.js
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
} from '@mui/material';
import userService from '../../services/userService';
import companyService from '../../services/companyService';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';

export default function UserForm({ open, onClose, user }) {
  const { user: currentUser } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    companyId: '',
    role: 'viewer',
    locations: '',
    status: 'active',
  });

  useEffect(() => {
    if (open) {
      fetchCompanies();
    }
  }, [open]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '', // Don't populate password for editing
        phone: user.phone || '',
        companyId: user.companyId?._id || user.companyId || '',
        role: user.role || 'viewer',
        locations: user.locations || '',
        status: user.status || 'active',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        companyId: currentUser.role === 'admin' ? currentUser.companyId : '',
        role: 'viewer',
        locations: '',
        status: 'active',
      });
    }
  }, [user, currentUser]);

  const fetchCompanies = async () => {
    try {
      if (currentUser.role === 'superadmin') {
        const response = await companyService.getAll();
        setCompanies(response.data.data);
      }
    } catch (error) {
      toast.error('Error fetching companies');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = { ...formData };
      if (user && !dataToSubmit.password) {
        delete dataToSubmit.password; // Don't send empty password when editing
      }

      if (user) {
        await userService.update(user._id, dataToSubmit);
        toast.success('User updated successfully');
      } else {
        await userService.create(dataToSubmit);
        toast.success('User created successfully');
      }
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving user');
    }
  };

  const getRoleOptions = () => {
    if (currentUser.role === 'superadmin') {
      return ['superadmin', 'admin', 'editor', 'viewer'];
    } else {
      return ['admin', 'editor', 'viewer'];
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {user ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Name"
                fullWidth
                required
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email"
                type="email"
                fullWidth
                required
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            {!user && (
              <Grid item xs={12}>
                <TextField
                  name="password"
                  label="Password"
                  type="password"
                  fullWidth
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <TextField
                name="phone"
                label="Phone"
                fullWidth
                required
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="locations"
                label="Location"
                fullWidth
                value={formData.locations}
                onChange={handleChange}
              />
            </Grid>
            {currentUser.role === 'superadmin' && (
              <Grid item xs={12}>
                <TextField
                  name="companyId"
                  label="Company"
                  select
                  fullWidth
                  required={formData.role !== 'superadmin'}
                  value={formData.companyId}
                  onChange={handleChange}
                >
                  {companies.map((company) => (
                    <MenuItem key={company._id} value={company._id}>
                      {company.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <TextField
                name="role"
                label="Role"
                select
                fullWidth
                value={formData.role}
                onChange={handleChange}
              >
                {getRoleOptions().map((role) => (
                  <MenuItem key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="status"
                label="Status"
                select
                fullWidth
                value={formData.status}
                onChange={handleChange}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {user ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}