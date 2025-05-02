// frontend/pages/yamazumi/[id]/index.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PrivateRoute from '../../../components/auth/PrivateRoute';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Grid,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import InputData from '../../../components/yamazumi/InputData';
import YamazumiChart from '../../../components/yamazumi/YamazumiChart';
import SaturationChart from '../../../components/yamazumi/SaturationChart';
import yamazumiService from '../../../services/yamazumiService';
import { toast } from 'react-toastify';
import { useAuth } from '../../../contexts/AuthContext';

function ViewYamazumiContent() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await yamazumiService.getById(id);
      setProject(response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching project');
      router.push('/yamazumi');
    }
  };

  const handleBack = () => {
    router.push('/yamazumi');
  };

  const handleEdit = () => {
    router.push(`/yamazumi/${id}/edit`);
  };

// In both 4m.js and yamazumi.js
const canEdit = user?.role === 'superadmin' || user?.role === 'admin' || user?.role === 'editor';
const canDelete = user?.role === 'superadmin' || user?.role === 'admin';

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              {project.projectName}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Created by: {project.userId?.name} | Last updated: {new Date(project.lastUpdated).toLocaleDateString()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
            >
              Back
            </Button>
            {canEdit && (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleEdit}
              >
                Edit
              </Button>
            )}
          </Box>
        </Box>

        <InputData
          data={{ stations: project.stations }}
          readOnly={true}
        />

        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12}>
            <YamazumiChart data={{ stations: project.stations }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <SaturationChart data={{ stations: project.stations }} />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default function ViewYamazumi() {
  return (
    <PrivateRoute>
      <ViewYamazumiContent />
    </PrivateRoute>
  );
}