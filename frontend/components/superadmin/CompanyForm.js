// frontend/components/superadmin/CompanyForm.js
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
import companyService from '../../services/companyService';
import { toast } from 'react-toastify';

export default function CompanyForm({ open, onClose, company }) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    website: '',
    phone: '',
    zipCode: '',
    status: 'active',
  });

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        address: company.address || '',
        website: company.website || '',
        phone: company.phone || '',
        zipCode: company.zipCode || '',
        status: company.status || 'active',
      });
    } else {
      setFormData({
        name: '',
        address: '',
        website: '',
        phone: '',
        zipCode: '',
        status: 'active',
      });
    }
  }, [company]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (company) {
        await companyService.update(company._id, formData);
        toast.success('Company updated successfully');
      } else {
        await companyService.create(formData);
        toast.success('Company created successfully');
      }
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving company');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {company ? 'Edit Company' : 'Add New Company'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Company Name"
                fullWidth
                required
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="address"
                label="Address"
                fullWidth
                required
                value={formData.address}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="website"
                label="Website"
                fullWidth
                value={formData.website}
                onChange={handleChange}
              />
            </Grid>
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
                name="zipCode"
                label="Zip Code"
                fullWidth
                required
                value={formData.zipCode}
                onChange={handleChange}
              />
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
            {company ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}