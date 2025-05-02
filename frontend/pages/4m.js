// frontend/pages/4m.js
import { useState, useEffect } from 'react';
import PrivateRoute from '../components/auth/PrivateRoute';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FourMDiagram from '../components/fourM/FourMDiagram';
import fourMService from '../services/fourMService';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';

function FourMContent() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fourMService.getAll();
      setProjects(response.data.data);
    } catch (error) {
      toast.error('Error fetching 4M projects');
    }
  };

  const handleCreate = () => {
    router.push('/4m/new');
  };

  const handleView = (project) => {
    router.push(`/4m/${project._id}`);
  };

  const handleEdit = (project) => {
    router.push(`/4m/${project._id}/edit`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await fourMService.delete(id);
        toast.success('Project deleted successfully');
        fetchProjects();
      } catch (error) {
        toast.error('Error deleting project');
      }
    }
  };

// In both 4m.js and yamazumi.js
const canEdit = user?.role === 'superadmin' || user?.role === 'admin' || user?.role === 'editor';
const canDelete = user?.role === 'superadmin' || user?.role === 'admin';

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4">4M Analysis</Typography>
        {canEdit && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            New Project
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} md={6} lg={4} key={project._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {project.projectName}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {project.problemDescription}
                </Typography>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Created by: {project.userId?.name}
                </Typography>
                <Typography variant="caption" display="block">
                  Last updated: {new Date(project.lastUpdated).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton color="primary" onClick={() => handleView(project)}>
                  <VisibilityIcon />
                </IconButton>
                {canEdit && (
                  <IconButton color="primary" onClick={() => handleEdit(project)}>
                    <EditIcon />
                  </IconButton>
                )}
                {canDelete && (
                  <IconButton color="error" onClick={() => handleDelete(project._id)}>
                    <DeleteIcon />
                  </IconButton>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default function FourM() {
  return (
    <PrivateRoute>
      <FourMContent />
    </PrivateRoute>
  );
}