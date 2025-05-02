// frontend/pages/4m/new.js
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
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import FourMDiagram from '../../components/fourM/FourMDiagram';
import fourMService from '../../services/fourMService';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';

function NewFourMContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [projectName, setProjectName] = useState('');
  const [diagramData, setDiagramData] = useState({
    problemDescription: '',
    categories: {
      method: [],
      machine: [],
      design: [],
      man: [],
      material: []
    }
  });

  const handleSave = async () => {
    if (!projectName) {
      toast.error('Please enter a project name');
      return;
    }

    try {
      const data = {
        projectName,
        problemDescription: diagramData.problemDescription,
        categories: diagramData.categories,
        companyId: user.companyId
      };

      await fourMService.create(data);
      toast.success('Project created successfully');
      router.push('/4m');
    } catch (error) {
      toast.error('Error creating project');
    }
  };

  const handleCancel = () => {
    router.push('/4m');
  };

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          New 4M Analysis Project
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
            Save Project
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default function NewFourM() {
  return (
    <PrivateRoute allowedRoles={['superadmin', 'admin', 'editor']}>
      <NewFourMContent />
    </PrivateRoute>
  );
}