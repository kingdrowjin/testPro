// frontend/components/yamazumi/InputData.js
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    IconButton,
    Paper,
    Typography,
    Box,
  } from '@mui/material';
  import AddIcon from '@mui/icons-material/Add';
  import DeleteIcon from '@mui/icons-material/Delete';
  
  const InputData = ({ data, onChange, readOnly = false }) => {
    const handleStationChange = (index, field, value) => {
      const newStations = [...data.stations];
      if (field === 'name') {
        newStations[index].name = value;
      } else {
        newStations[index][field] = parseFloat(value) || 0;
      }
      onChange({ ...data, stations: newStations });
    };
  
    const addStation = () => {
      const newStation = {
        name: `Station ${data.stations.length + 1}`,
        nvaa: 0,
        vaa: 0,
        svaa: 0,
        unb: 0
      };
      onChange({ ...data, stations: [...data.stations, newStation] });
    };
  
    const removeStation = (index) => {
      const newStations = data.stations.filter((_, i) => i !== index);
      onChange({ ...data, stations: newStations });
    };
  
    // Calculate totals
    const totals = data.stations.reduce(
      (acc, station) => ({
        nvaa: acc.nvaa + (station.nvaa || 0),
        vaa: acc.vaa + (station.vaa || 0),
        svaa: acc.svaa + (station.svaa || 0),
        unb: acc.unb + (station.unb || 0),
        total: acc.total + (station.nvaa || 0) + (station.vaa || 0) + (station.svaa || 0) + (station.unb || 0)
      }),
      { nvaa: 0, vaa: 0, svaa: 0, unb: 0, total: 0 }
    );
  
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Yamazumi in Seconds</Typography>
          {!readOnly && (
            <IconButton color="primary" onClick={addStation}>
              <AddIcon />
            </IconButton>
          )}
        </Box>
  
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Station</TableCell>
                <TableCell align="center">NVAA</TableCell>
                <TableCell align="center">VAA</TableCell>
                <TableCell align="center">SVAA</TableCell>
                <TableCell align="center">UNB</TableCell>
                <TableCell align="center">Total</TableCell>
                {!readOnly && <TableCell align="center">Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.stations.map((station, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <TextField
                      value={station.name}
                      onChange={(e) => handleStationChange(index, 'name', e.target.value)}
                      disabled={readOnly}
                      size="small"
                      variant="standard"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      type="number"
                      value={station.nvaa}
                      onChange={(e) => handleStationChange(index, 'nvaa', e.target.value)}
                      disabled={readOnly}
                      size="small"
                      variant="standard"
                      sx={{ width: 80 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      type="number"
                      value={station.vaa}
                      onChange={(e) => handleStationChange(index, 'vaa', e.target.value)}
                      disabled={readOnly}
                      size="small"
                      variant="standard"
                      sx={{ width: 80 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      type="number"
                      value={station.svaa}
                      onChange={(e) => handleStationChange(index, 'svaa', e.target.value)}
                      disabled={readOnly}
                      size="small"
                      variant="standard"
                      sx={{ width: 80 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      type="number"
                      value={station.unb}
                      onChange={(e) => handleStationChange(index, 'unb', e.target.value)}
                      disabled={readOnly}
                      size="small"
                      variant="standard"
                      sx={{ width: 80 }}
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ backgroundColor: '#e3f2fd' }}>
                    {(station.nvaa + station.vaa + station.svaa + station.unb).toFixed(1)}
                  </TableCell>
                  {!readOnly && (
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeStation(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                <TableCell align="center" sx={{ backgroundColor: '#e3f2fd', fontWeight: 'bold' }}>
                  {totals.nvaa.toFixed(1)}
                </TableCell>
                <TableCell align="center" sx={{ backgroundColor: '#e3f2fd', fontWeight: 'bold' }}>
                  {totals.vaa.toFixed(1)}
                </TableCell>
                <TableCell align="center" sx={{ backgroundColor: '#e3f2fd', fontWeight: 'bold' }}>
                  {totals.svaa.toFixed(1)}
                </TableCell>
                <TableCell align="center" sx={{ backgroundColor: '#e3f2fd', fontWeight: 'bold' }}>
                  {totals.unb.toFixed(1)}
                </TableCell>
                <TableCell align="center" sx={{ backgroundColor: '#e3f2fd', fontWeight: 'bold' }}>
                  {totals.total.toFixed(1)}
                </TableCell>
                {!readOnly && <TableCell />}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
  
        {/* Saturation Percentage Table */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Saturation in %</Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Station</TableCell>
                  <TableCell align="center">NVAA</TableCell>
                  <TableCell align="center">VAA</TableCell>
                  <TableCell align="center">SVAA</TableCell>
                  <TableCell align="center">UNB</TableCell>
                  <TableCell align="center">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.stations.map((station, index) => {
                  const stationTotal = station.nvaa + station.vaa + station.svaa + station.unb;
                  return (
                    <TableRow key={index}>
                      <TableCell>{station.name}</TableCell>
                      <TableCell align="center" sx={{ backgroundColor: '#e3f2fd' }}>
                        {stationTotal > 0 ? Math.round((station.nvaa / stationTotal) * 100) : 0}%
                      </TableCell>
                      <TableCell align="center" sx={{ backgroundColor: '#e3f2fd' }}>
                        {stationTotal > 0 ? Math.round((station.vaa / stationTotal) * 100) : 0}%
                      </TableCell>
                      <TableCell align="center" sx={{ backgroundColor: '#e3f2fd' }}>
                        {stationTotal > 0 ? Math.round((station.svaa / stationTotal) * 100) : 0}%
                      </TableCell>
                      <TableCell align="center" sx={{ backgroundColor: '#e3f2fd' }}>
                        {stationTotal > 0 ? Math.round((station.unb / stationTotal) * 100) : 0}%
                      </TableCell>
                      <TableCell align="center" sx={{ backgroundColor: '#e3f2fd', fontWeight: 'bold' }}>
                        100%
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    );
  };
  
  export default InputData;