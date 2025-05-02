// frontend/pages/yamazumi/[id]/edit.js
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
  Grid,
  CircularProgress,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import InputData from '../../../components/yamazumi/InputData';
import YamazumiChart from '../../../components/yamazumi/YamazumiChart';
import SaturationChart from '../../../components/yamazumi/SaturationChart';
import yamazumiService from '../../../services/yamazumiService';
import { toast } from 'react-toastify';

function EditYamazumiContent() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [projectName, setProjectName] = useState('');
  const [projectData, setProjectData] = useState({ stations: [] });

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await yamazumiService.getById(id);
      const project = response.data.data;
      setProjectName(project.projectName);
      setProjectData({ stations: project.stations });
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching project');
      router.push('/yamazumi');
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
        stations: projectData.stations
      };

      await yamazumiService.update(id, data);
      toast.success('Project updated successfully');
      router.push('/yamazumi');
    } catch (error) {
      toast.error('Error updating project');
    }
  };

  const handleCancel = () => {
    router.push('/yamazumi');
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
          Edit Yamazumi Analysis Project
        </Typography>
        
        <TextField
          label="Project Name"
          fullWidth
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          sx={{ mb: 3 }}
          required
        />

        <InputData
          data={projectData}
          onChange={setProjectData}
          readOnly={false}
        />

        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12}>
            <YamazumiChart data={projectData} />
          </Grid>
          <Grid item xs={12} md={6}>
            <SaturationChart data={projectData} />
          </Grid>
        </Grid>

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

export default function EditYamazumi() {
  return (
    <PrivateRoute allowedRoles={['admin', 'editor']}>
      <EditYamazumiContent />
    </PrivateRoute>
  );
}