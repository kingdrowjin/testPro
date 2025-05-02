// frontend/pages/4m/[id]/edit.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PrivateRoute from '../../../components/auth/PrivateRoute';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  TextField,
  CircularProgress,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import FourMDiagram from '../../../components/fourM/FourMDiagram';
import fourMService from '../../../services/fourMService';
import { toast } from 'react-toastify';

function EditFourMContent() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [projectName, setProjectName] = useState('');
  const [diagramData, setDiagramData] = useState(null);

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await fourMService.getById(id);
      const project = response.data.data;
      setProjectName(project.projectName);
      setDiagramData({
        problemDescription: project.problemDescription,
        categories: project.categories
      });
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching project');
      router.push('/4m');
    }
  };

  const handleSave = async () => {
    if (!projectName) {
      toast.error('Please enter a project name');
      return;
    }

    try {
      const data = {
        projectName,
        problemDescription: diagramData.problemDescription,
        categories: diagramData.categories
      };

      await fourMService.update(id, data);
      toast.success('Project updated successfully');
      router.push('/4m');
    } catch (error) {
      toast.error('Error updating project');
    }
  };

  const handleCancel = () => {
    router.push('/4m');
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Edit 4M Analysis Project
        </Typography>
        
        <TextField
          label="Project Name"
          fullWidth
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          sx={{ mb: 3 }}
          required
        />

        <FourMDiagram
          data={diagramData}
          onChange={setDiagramData}
          readOnly={false}
        />

        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default function EditFourM() {
  return (
    <PrivateRoute allowedRoles={['admin', 'editor']}>
      <EditFourMContent />
    </PrivateRoute>
  );
}