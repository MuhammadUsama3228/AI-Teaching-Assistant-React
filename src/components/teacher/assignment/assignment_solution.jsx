import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import api from '../../../api';

const UpdateSolutionForm = ({ solution, onClose, onSuccess }) => {
  const [text, setText] = useState(solution.text || '');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (text) formData.append('text', text);
    if (file) formData.append('file', file);

    setLoading(true);
    try {
      await api.patch(`/api/courses/solution/${solution.id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onSuccess(); 
      onClose();
    } catch (error) {
      console.error('Error updating solution:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box mb={2}>
        <TextField
          label="Solution Text"
          multiline
          fullWidth
          minRows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </Box>
      <Box mb={2}>
        <Button variant="outlined" component="label">
          Upload File
          <input type="file" hidden onChange={(e) => setFile(e.target.files[0])} />
        </Button>
        {file && <Box mt={1}>{file.name}</Box>}
      </Box>
      <Box textAlign="right">
        <Button onClick={onClose} sx={{ mr: 2 }}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? 'Updating...' : 'Update'}
        </Button>
      </Box>
    </form>
  );
};

export default UpdateSolutionForm;
