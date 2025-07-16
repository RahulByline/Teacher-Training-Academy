import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  CloudUpload,
  ArrowBack,
  CheckCircle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import api from '../config/axiosConfig';
import Autocomplete, { AutocompleteRenderInputParams } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { SyntheticEvent } from 'react';

interface FileData {
  filename: string;
  headers: string[];
  preview: Record<string, any>[];
  totalRows: number;
  data: Record<string, any>[];
  error?: string;
}

interface ContactField {
  value: string;
  label: string;
  group?: string;
}

const steps = ['Upload Files', 'Map Fields', 'Import Data'];

const ImportDataPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [files, setFiles] = useState<FileData[]>([]);
  const [contactFields, setContactFields] = useState<ContactField[]>([]);
  const [mappings, setMappings] = useState<Record<string, string>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [importResults, setImportResults] = useState<any>(null);

  useEffect(() => {
    fetchContactFields();
  }, []);

  const fetchContactFields = async () => {
    try {
      const response = await api.get('/contacts/fields');
      setContactFields(response.data.fields);
    } catch (err) {
      console.error('Error fetching contact fields:', err);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setLoading(true);
    setError('');

    const formData = new FormData();
    Array.from(selectedFiles).forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await api.post('/import/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const uploadedFiles = response.data.files.filter((file: FileData) => !file.error);
      const errorFiles = response.data.files.filter((file: FileData) => file.error);

      if (errorFiles.length > 0) {
        setError(`Some files could not be processed: ${errorFiles.map((f: FileData) => f.filename).join(', ')}`);
      }

      if (uploadedFiles.length > 0) {
        setFiles(uploadedFiles);
        // Initialize mappings for each file
        const initialMappings = uploadedFiles.map((file: FileData) => {
          const mapping: Record<string, string> = {};
          file.headers.forEach(header => {
            mapping[header] = '-- Ignore --';
          });
          return mapping;
        });
        setMappings(initialMappings);
        setActiveStep(1);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to upload files');
    } finally {
      setLoading(false);
    }
  };

  const handleMappingChange = (fileIndex: number, header: string, value: string) => {
    const newMappings = [...mappings];
    newMappings[fileIndex][header] = value;
    setMappings(newMappings);
  };

  const handleImport = async () => {
    setLoading(true);
    setError('');

    try {
      const importData = {
        files: files.map(file => file.data),
        mappings: mappings,
      };

      const response = await api.post('/contacts/import', importData);
      setImportResults(response.data);
      setSuccess(`Import completed! ${response.data.total_imported} contacts imported.`);
      setActiveStep(2);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Import failed');
    } finally {
      setLoading(false);
    }
  };

  // Group fields by category for better UX
  const groupField = (field: ContactField): string => {
    return field.group || 'Other';
  };

  // Auto-match logic: when files are uploaded, try to auto-map headers to CRM fields
  useEffect(() => {
    if (files.length > 0 && contactFields.length > 0 && mappings.length === 0) {
      const initialMappings = files.map((file: FileData) => {
        const mapping: Record<string, string> = {};
        file.headers.forEach(header => {
          // Try to find a field with a similar name
          const match = contactFields.find(f =>
            f.value.toLowerCase() === header.toLowerCase() ||
            f.label.toLowerCase() === header.toLowerCase() ||
            f.value.replace(/_/g, '').toLowerCase() === header.replace(/\s/g, '').toLowerCase()
          );
          mapping[header] = match ? match.value : '-- Ignore --';
        });
        return mapping;
      });
      setMappings(initialMappings);
    }
    // eslint-disable-next-line
  }, [files, contactFields]);

  // Quick action handlers
  const handleMapAllIgnore = (fileIndex: number) => {
    const newMappings = [...mappings];
    Object.keys(newMappings[fileIndex]).forEach(header => {
      newMappings[fileIndex][header] = '-- Ignore --';
    });
    setMappings(newMappings);
  };
  const handleResetMappings = (fileIndex: number) => {
    const newMappings = [...mappings];
    Object.keys(newMappings[fileIndex]).forEach(header => {
      // Try to auto-match again
      const match = contactFields.find(f =>
        f.value.toLowerCase() === header.toLowerCase() ||
        f.label.toLowerCase() === header.toLowerCase() ||
        f.value.replace(/_/g, '').toLowerCase() === header.replace(/\s/g, '').toLowerCase()
      );
      newMappings[fileIndex][header] = match ? match.value : '-- Ignore --';
    });
    setMappings(newMappings);
  };
  const handleApplyMappingToAll = (fileIndex: number) => {
    const newMappings = [...mappings];
    for (let i = 0; i < newMappings.length; i++) {
      if (i !== fileIndex) {
        newMappings[i] = { ...newMappings[fileIndex] };
      }
    }
    setMappings(newMappings);
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <Card>
            <CardContent>
              <Box textAlign="center" py={4}>
                <CloudUpload sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Upload CSV or Excel Files
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Select one or more CSV or Excel files to import contact data
                </Typography>
                <input
                  accept=".csv,.xlsx,.xls"
                  style={{ display: 'none' }}
                  id="file-upload"
                  multiple
                  type="file"
                  onChange={handleFileUpload}
                  disabled={loading}
                />
                <label htmlFor="file-upload">
                  <Button
                    variant="contained"
                    component="span"
                    disabled={loading}
                    size="large"
                  >
                    {loading ? <CircularProgress size={24} /> : 'Choose Files'}
                  </Button>
                </label>
              </Box>
            </CardContent>
          </Card>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Map Your Data Fields
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Map each column from your files to the corresponding CRM fields
            </Typography>

            {files.map((file, fileIndex) => (
              <Card key={fileIndex} sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {file.filename} ({file.totalRows} rows)
                  </Typography>
                  <Box display="flex" gap={2} mb={2}>
                    <Button size="small" variant="outlined" onClick={() => handleMapAllIgnore(fileIndex)}>
                      Map all as Ignore
                    </Button>
                    <Button size="small" variant="outlined" onClick={() => handleResetMappings(fileIndex)}>
                      Reset all mappings
                    </Button>
                    <Button size="small" variant="outlined" onClick={() => handleApplyMappingToAll(fileIndex)}>
                      Apply mapping to all files
                    </Button>
                  </Box>
                  <Grid container spacing={2}>
                    {file.headers.map((header) => (
                      <Grid item xs={12} sm={6} md={4} key={header}>
                        <Box display="flex" alignItems="center" mb={1}>
                          <Box minWidth={120}>
                            <Chip label={header} size="small" />
                          </Box>
                          <Box mx={2}>→</Box>
                          <Tooltip title={contactFields.find((f: ContactField) => f.value === mappings[fileIndex]?.[header])?.label || ''} arrow>
                            <Autocomplete
                              size="small"
                              sx={{ minWidth: 320, maxWidth: 400 }}
                              options={[{ value: '-- Ignore --', label: '-- Ignore --' }, ...contactFields] as ContactField[]}
                              groupBy={groupField}
                              getOptionLabel={(option: ContactField) => option.label}
                              value={contactFields.find((f: ContactField) => f.value === mappings[fileIndex]?.[header]) || { value: '-- Ignore --', label: '-- Ignore --' }}
                              onChange={(_: SyntheticEvent, newValue: ContactField | null) => handleMappingChange(fileIndex, header, newValue ? newValue.value : '-- Ignore --')}
                              renderInput={(params: AutocompleteRenderInputParams) => <TextField {...params} label="Map to" variant="outlined" />}
                              isOptionEqualToValue={(option: ContactField, value: ContactField) => option.value === value.value}
                            />
                          </Tooltip>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            ))}

            <Box display="flex" justifyContent="space-between" mt={3}>
              <Button
                onClick={() => setActiveStep(0)}
                disabled={loading}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleImport}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Import Data'}
              </Button>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Card>
            <CardContent>
              <Box textAlign="center" py={4}>
                <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Import Complete!
                </Typography>
                {importResults && (
                  <Box>
                    <Typography variant="body1" paragraph>
                      Successfully imported {importResults.total_imported} contacts
                    </Typography>
                    {importResults.errors && importResults.errors.length > 0 && (
                      <Box mt={2}>
                        <Alert severity="warning">
                          <Typography variant="subtitle2" gutterBottom>
                            Some rows had errors:
                          </Typography>
                          <Box component="ul" sx={{ textAlign: 'left', mt: 1 }}>
                            {importResults.errors.slice(0, 5).map((error: string, index: number) => (
                              <li key={index}>{error}</li>
                            ))}
                            {importResults.errors.length > 5 && (
                              <li>... and {importResults.errors.length - 5} more</li>
                            )}
                          </Box>
                        </Alert>
                      </Box>
                    )}
                  </Box>
                )}
                <Box mt={3}>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/contacts')}
                    sx={{ mr: 2 }}
                  >
                    View Contacts
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setActiveStep(0);
                      setFiles([]);
                      setMappings([]);
                      setImportResults(null);
                      setSuccess('');
                      setError('');
                    }}
                  >
                    Import More
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/contacts')}
            sx={{ mb: 2 }}
          >
            Back to Contacts
          </Button>
          <Typography variant="h4" gutterBottom>
            Import Contact Data
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Upload and import contact data from CSV or Excel files
          </Typography>
        </Box>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {loading && activeStep === 1 && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress />
        </Box>
      )}

      {renderStep()}
    </Box>
  );
};

export default ImportDataPage;