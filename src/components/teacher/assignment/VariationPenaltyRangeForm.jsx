// import React, { useState, useEffect } from 'react';
// import {
//     TextField,
//     Button,
//     Typography,
//     Container,
//     Box,
//     CircularProgress,
//     ThemeProvider,
//     Slider,
//     IconButton
// } from '@mui/material';
// import { Add, Delete } from '@mui/icons-material';
// import theme from '../../Theme';
// import api from '../../../api';

// function VariationPenaltyRangeForm({ assignmentId }) {
//     const [variationPenaltyId, setVariationPenaltyId] = useState(null);
//     const [ranges, setRanges] = useState([{ days_late: '', penalty: 5 }]); 
//     const [lateSubmissionAllowed, setLateSubmissionAllowed] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [success, setSuccess] = useState('');
//     const [error, setError] = useState('');

//     // Fetch assignment's late submission limit and existing penalty data
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const assignmentRes = await api.get(`/api/courses/assignments/${assignmentId}/`);
//                 setLateSubmissionAllowed(assignmentRes.data.late_submission);

//                 const penaltyRes = await api.get(`/api/courses/variation_penalty/?assignment=${assignmentId}`);
//                 if (penaltyRes.data.length > 0) {
//                     const penalty = penaltyRes.data[0];
//                     setVariationPenaltyId(penalty.id);
//                     setRanges(penalty.variation_penalties_ranges || []);
//                 }
//             } catch (err) {
//                 setError('Failed to fetch data. Please try again.');
//                 console.error(err);
//             }
//         };

//         if (assignmentId) fetchData();
//     }, [assignmentId]);

//     // Handle input change for ranges
//     const handleInputChange = (index, field, value) => {
//         if (field === 'days_late' && lateSubmissionAllowed && value > lateSubmissionAllowed) {
//             setError(`Days late cannot exceed the allowed ${lateSubmissionAllowed} days.`);
//             return;
//         }

//         setError('');
//         setRanges(prev => prev.map((range, i) => i === index ? { ...range, [field]: value } : range));
//     };

//     // Add a new penalty range
//     const handleAddRange = () => {
//         setRanges(prev => [...prev, { days_late: '', penalty: 5 }]);
//     };

//     // Remove a specific penalty range
//     const handleDeleteRange = (index) => {
//         setRanges(prev => prev.filter((_, i) => i !== index));
//     };

//     // Submit form data
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setSuccess('');
//         setError('');
    
//         try {
//             let penaltyId = variationPenaltyId;
    
//             // Validate fields before API call
//             const validRanges = ranges.filter(range => range.days_late !== '' && range.penalty !== '');
//             if (validRanges.length === 0) {
//                 setError('At least one valid penalty range is required.');
//                 setLoading(false);
//                 return;
//             }
    
//             // If there's no existing variation penalty, create one
//             if (!penaltyId) {
//                 const response = await api.post('/api/courses/variation_penalty/', { assignment: assignmentId });
//                 penaltyId = response.data.id;
//                 setVariationPenaltyId(penaltyId);
//             }
    
//             // Submit penalty ranges
//             await Promise.all(
//                 validRanges.map(range => api.post('/api/courses/penalty_ranges/', {
//                     variation_penalty: penaltyId,
//                     days_late: Number(range.days_late),
//                     penalty: Number(range.penalty)
//                 }))
//             );
    
//             setSuccess('Variation penalty and ranges applied successfully!');
//         } catch (err) {
//             console.error(err);
//             setError(err.response?.data?.error || 'Failed to apply variation penalty.');
//         } finally {
//             setLoading(false);
//         }
//     };
    

//     return (
//         <ThemeProvider theme={theme}>
//             <Container maxWidth="sm" sx={{ mt: 3 }}>
//                 <Box sx={{ p: 3, boxShadow: 3, borderRadius: 2, backgroundColor: 'background.paper' }}>
//                     <Typography variant="h5" gutterBottom>
//                         Apply Variation Penalty
//                     </Typography>

//                     {success && <Typography color="primary">{success}</Typography>}
//                     {error && <Typography color="error">{error}</Typography>}

//                     <form onSubmit={handleSubmit}>
//                         {ranges.map((range, index) => (
//                             <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
//                                 <TextField
//                                     label="Days Late"
//                                     type="number"
//                                     value={range.days_late}
//                                     onChange={(e) => handleInputChange(index, 'days_late', e.target.value)}
//                                     fullWidth
//                                     required
//                                     inputProps={{ min: 1, max: lateSubmissionAllowed || undefined }}
//                                 />
                                
//                                 <Box sx={{ width: 150 }}>
//                                     <Typography variant="body2">Penalty: {range.penalty}%</Typography>
//                                     <Slider
//                                         value={range.penalty}
//                                         onChange={(_, newValue) => handleInputChange(index, 'penalty', newValue)}
//                                         min={0}
//                                         max={100}
//                                         step={0.5}
//                                         valueLabelDisplay="auto"
//                                     />
//                                 </Box>

//                                 <IconButton onClick={() => handleDeleteRange(index)} color="error">
//                                     <Delete />
//                                 </IconButton>
//                             </Box>
//                         ))}

//                         <Button startIcon={<Add />} onClick={handleAddRange} sx={{ mb: 2 }}>
//                             Add Range
//                         </Button>

//                         <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={loading}>
//                             {loading ? <>Applying <CircularProgress size={20} sx={{ ml: 2 }} /></> : 'Apply Variation Penalty'}
//                         </Button>
//                     </form>
//                 </Box>
//             </Container>
//         </ThemeProvider>
//     );
// }

// export default VariationPenaltyRangeForm;


import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Typography,
    Container,
    Box,
    CircularProgress,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import api from '../../../api';

function VariationPenaltyRangeForm({ penaltyId }) {
    const [penaltyRanges, setPenaltyRanges] = useState([]);
    const [formData, setFormData] = useState({ days_late: '', penalty: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    // Fetch existing penalty ranges
    useEffect(() => {
        const fetchPenaltyRanges = async () => {
            try {
                const response = await api.get(`/api/courses/penalty_ranges/?variation_penalty=${penaltyId}`);
                setPenaltyRanges(response.data);
            } catch (err) {
                console.error('Error fetching penalty ranges:', err);
            }
        };

        if (penaltyId) fetchPenaltyRanges();
    }, [penaltyId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess('');
        setError('');
    
        // Ensure penaltyId is defined
        if (!penaltyId) {
            setError('Penalty ID is missing.');
            setLoading(false);
            return;
        }
    
        try {
            const response = await api.post('/api/courses/penalty_ranges/', {
                variation_penalty: penaltyId,
                days_late: parseInt(formData.days_late, 10),
                penalty: parseFloat(formData.penalty),
            });
    
            setSuccess('Penalty range added successfully!');
            setPenaltyRanges([...penaltyRanges, response.data]);
            setFormData({ days_late: '', penalty: '' });
    
        } catch (err) {
            console.error('Error adding penalty range:', err);
    
            if (err.response && err.response.status === 403) {
                setError('You do not have permission to create penalty ranges for this course.');
            } else if (err.response && err.response.data?.variation_penalty_range) {
                setError(err.response.data.variation_penalty_range);
            } else {
                setError('Failed to add penalty range. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <Container maxWidth="sm">
            <Box sx={{ p: 3, boxShadow: 3, borderRadius: 2, backgroundColor: 'background.paper', mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Add Penalty Ranges
                </Typography>

                {success && <Typography color="primary">{success}</Typography>}
                {error && <Typography color="error">{error}</Typography>}

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Days Late"
                        name="days_late"
                        type="number"
                        value={formData.days_late}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        required
                        inputProps={{ min: 1 }}
                    />

                    <TextField
                        label="Penalty Percentage"
                        name="penalty"
                        type="number"
                        value={formData.penalty}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        required
                        inputProps={{ step: "0.01", min: 0 }}
                    />

                    <Button 
                        type="submit" 
                        variant="contained" 
                        fullWidth 
                        sx={{ mt: 2 }} 
                        disabled={loading}
                    >
                        {loading ? <>Saving <CircularProgress size={20} sx={{ ml: 2 }} /></> : 'Add Penalty Range'}
                    </Button>
                </form>

                {/* Display Added Penalty Ranges */}
                <Typography variant="h6" sx={{ mt: 3 }}>Existing Penalty Ranges</Typography>
                <List>
                    {penaltyRanges.length > 0 ? (
                        penaltyRanges.map((range, index) => (
                            <ListItem key={index}>
                                <ListItemText primary={`Days Late: ${range.days_late}, Penalty: ${range.penalty * 100}%`} />
                            </ListItem>
                        ))
                    ) : (
                        <Typography color="textSecondary">No penalty ranges added yet.</Typography>
                    )}
                </List>
            </Box>
        </Container>
    );
}

export default VariationPenaltyRangeForm;
