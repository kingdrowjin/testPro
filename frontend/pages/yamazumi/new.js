// frontend/pages/yamazumi/new.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import PrivateRoute from '../../components/auth/PrivateRoute';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  TextField,
  Grid,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import InputData from '../../components/yamazumi/InputData';
import YamazumiChart from '../../components/yamazumi/YamazumiChart';
import SaturationChart from '../../components/yamazumi/SaturationChart';
import yamazumiService from '../../services/yamazumiService';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';

function NewYamazumiContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [projectName, setProjectName] = useState('');
  const [projectData, setProjectData] = useState({
    stations: []
  });

  const handleSave = async () => {
    if (!projectName) {
      toast.error('Please enter a project name');
      return;
    }

    try {
      const data = {
        projectName,
        stations: projectData.stations,
        companyId: user.companyId
      };

      await yamazumiService.create(data);
      toast.success('Project created successfully');
      router.push('/yamazumi');
    } catch (error) {
      toast.error('Error creating project');
    }
  };

  const handleCancel = () => {
    router.push('/yamazumi');
  };

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          New Yamazumi Analysis Project
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
            Save Project
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default function NewYamazumi() {
  return (
    <PrivateRoute allowedRoles={['superadmin', 'admin', 'editor']}>
      <NewYamazumiContent />
    </PrivateRoute>
  );
}