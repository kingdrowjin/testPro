// frontend/components/fourM/FourMDiagram.js
import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const FourMDiagram = ({ data, onChange, readOnly = false }) => {
  const [projectData, setProjectData] = useState({
    problemDescription: '',
    categories: {
      method: [],
      machine: [],
      design: [],
      man: [],
      material: []
    }
  });

  useEffect(() => {
    if (data) {
      setProjectData(data);
    }
  }, [data]);

  const handleProblemChange = (e) => {
    const newData = {
      ...projectData,
      problemDescription: e.target.value
    };
    setProjectData(newData);
    if (onChange) onChange(newData);
  };

  const addItem = (category) => {
    const newData = {
      ...projectData,
      categories: {
        ...projectData.categories,
        [category]: [
          ...projectData.categories[category],
          { text: '', status: 'OK', position: { x: 0, y: 0 } }
        ]
      }
    };
    setProjectData(newData);
    if (onChange) onChange(newData);
  };

  const updateItem = (category, index, field, value) => {
    const newData = {
      ...projectData,
      categories: {
        ...projectData.categories,
        [category]: projectData.categories[category].map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        )
      }
    };
    setProjectData(newData);
    if (onChange) onChange(newData);
  };

  const deleteItem = (category, index) => {
    const newData = {
      ...projectData,
      categories: {
        ...projectData.categories,
        [category]: projectData.categories[category].filter((_, i) => i !== index)
      }
    };
    setProjectData(newData);
    if (onChange) onChange(newData);
  };

  const toggleStatus = (category, index) => {
    const currentStatus = projectData.categories[category][index].status;
    updateItem(category, index, 'status', currentStatus === 'OK' ? 'KO' : 'OK');
  };

  const categoryConfig = {
    method: { title: 'Method', color: '#1976d2' },
    machine: { title: 'Machine', color: '#388e3c' },
    design: { title: 'Design', color: '#f57c00' },
    man: { title: 'Man', color: '#7b1fa2' },
    material: { title: 'Material', color: '#c2185b' }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Problem Description */}
      <Card sx={{ mb: 4, backgroundColor: '#ffebee' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Problem Description
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={projectData.problemDescription}
            onChange={handleProblemChange}
            disabled={readOnly}
            variant="outlined"
            size="small"
          />
        </CardContent>
      </Card>

      {/* Fishbone Diagram */}
      <Box sx={{ position: 'relative', minHeight: '600px' }}>
        {/* Main Spine */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '10%',
            right: '10%',
            height: '4px',
            backgroundColor: '#333',
            transform: 'translateY(-50%)'
          }}
        />

        {/* Categories */}
        <Grid container spacing={4}>
          {/* Top Row */}
          <Grid item xs={4}>
            <Box sx={{ mb: 20 }}>
              <CategoryBox
                category="method"
                title={categoryConfig.method.title}
                color={categoryConfig.method.color}
                items={projectData.categories.method}
                onAddItem={() => addItem('method')}
                onUpdateItem={(index, field, value) => updateItem('method', index, field, value)}
                onDeleteItem={(index) => deleteItem('method', index)}
                onToggleStatus={(index) => toggleStatus('method', index)}
                readOnly={readOnly}
              />
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ mb: 20 }}>
              <CategoryBox
                category="machine"
                title={categoryConfig.machine.title}
                color={categoryConfig.machine.color}
                items={projectData.categories.machine}
                onAddItem={() => addItem('machine')}
                onUpdateItem={(index, field, value) => updateItem('machine', index, field, value)}
                onDeleteItem={(index) => deleteItem('machine', index)}
                onToggleStatus={(index) => toggleStatus('machine', index)}
                readOnly={readOnly}
              />
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ mb: 20 }}>
              <CategoryBox
                category="design"
                title={categoryConfig.design.title}
                color={categoryConfig.design.color}
                items={projectData.categories.design}
                onAddItem={() => addItem('design')}
                onUpdateItem={(index, field, value) => updateItem('design', index, field, value)}
                onDeleteItem={(index) => deleteItem('design', index)}
                onToggleStatus={(index) => toggleStatus('design', index)}
                readOnly={readOnly}
              />
            </Box>
          </Grid>

          {/* Bottom Row */}
          <Grid item xs={6}>
            <CategoryBox
              category="man"
              title={categoryConfig.man.title}
              color={categoryConfig.man.color}
              items={projectData.categories.man}
              onAddItem={() => addItem('man')}
              onUpdateItem={(index, field, value) => updateItem('man', index, field, value)}
              onDeleteItem={(index) => deleteItem('man', index)}
              onToggleStatus={(index) => toggleStatus('man', index)}
              readOnly={readOnly}
            />
          </Grid>
          <Grid item xs={6}>
            <CategoryBox
              category="material"
              title={categoryConfig.material.title}
              color={categoryConfig.material.color}
              items={projectData.categories.material}
              onAddItem={() => addItem('material')}
              onUpdateItem={(index, field, value) => updateItem('material', index, field, value)}
              onDeleteItem={(index) => deleteItem('material', index)}
              onToggleStatus={(index) => toggleStatus('material', index)}
              readOnly={readOnly}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

const CategoryBox = ({
  category,
  title,
  color,
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onToggleStatus,
  readOnly
}) => {
  return (
    <Card sx={{ backgroundColor: color + '20', borderColor: color, borderWidth: 2, borderStyle: 'solid' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color: color, fontWeight: 'bold' }}>
            {title}
          </Typography>
          {!readOnly && (
            <IconButton onClick={onAddItem} size="small" sx={{ color: color }}>
              <AddIcon />
            </IconButton>
          )}
        </Box>

        {items.map((item, index) => (
          <Box key={index} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              value={item.text}
              onChange={(e) => onUpdateItem(index, 'text', e.target.value)}
              disabled={readOnly}
              variant="outlined"
            />
            <IconButton
              onClick={() => onToggleStatus(index)}
              size="small"
              sx={{ color: item.status === 'OK' ? '#4caf50' : '#f44336' }}
              disabled={readOnly}
            >
              {item.status === 'OK' ? <CheckCircleIcon /> : <CancelIcon />}
            </IconButton>
            {!readOnly && (
              <IconButton
                onClick={() => onDeleteItem(index)}
                size="small"
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default FourMDiagram;