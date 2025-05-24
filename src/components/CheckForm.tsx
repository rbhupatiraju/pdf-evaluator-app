import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';

interface CheckFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (check: {
    check_name: string;
    check_description: string;
    detailed_prompt: string;
    associated_sections: string[];
  }) => void;
  initialData?: {
    check_name: string;
    check_description: string;
    detailed_prompt: string;
    associated_sections: string[];
  };
}

const availableSections = [
  'Document Formatting',
  'Page Layout',
  'Content Review',
  'Document Structure',
  'Data Validation',
  'Legal Compliance',
  'Technical Specifications',
  'Quality Assurance'
];

const CheckForm: React.FC<CheckFormProps> = ({ open, onClose, onSave, initialData }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [detailedPrompt, setDetailedPrompt] = useState('');
  const [associatedSections, setAssociatedSections] = useState<string[]>([]);

  useEffect(() => {
    if (initialData) {
      setName(initialData.check_name);
      setDescription(initialData.check_description);
      setDetailedPrompt(initialData.detailed_prompt);
      setAssociatedSections(initialData.associated_sections);
    } else {
      // Reset form when opening for new check
      setName('');
      setDescription('');
      setDetailedPrompt('');
      setAssociatedSections([]);
    }
  }, [initialData, open]);

  const handleSave = () => {
    onSave({
      check_name: name,
      check_description: description,
      detailed_prompt: detailedPrompt,
      associated_sections: associatedSections,
    });
  };

  const handleToggleSection = (section: string) => {
    const currentIndex = associatedSections.indexOf(section);
    const newSections = [...associatedSections];

    if (currentIndex === -1) {
      newSections.push(section);
    } else {
      newSections.splice(currentIndex, 1);
    }

    setAssociatedSections(newSections);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        {initialData ? 'Edit Control Check' : 'Add New Control Check'}
      </DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Grid container spacing={3}>
          {/* Left Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}>
              <Box>
                <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                  Check Name
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter check name"
                />
              </Box>

              <Box>
                <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                  Description
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter check description"
                  multiline
                  rows={3}
                />
              </Box>

              <Box>
                <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                  Detailed Prompt
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={detailedPrompt}
                  onChange={(e) => setDetailedPrompt(e.target.value)}
                  placeholder="Enter detailed prompt"
                  multiline
                  rows={6}
                />
              </Box>
            </Box>
          </Grid>

          {/* Right Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                Associated Sections
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  height: '335px',
                  overflow: 'auto'
                }}
              >
                <List sx={{ width: '100%', p: 0 }}>
                  {availableSections.map((section) => (
                    <ListItem
                      key={section}
                      disablePadding
                      divider
                    >
                      <ListItemButton
                        dense
                        onClick={() => handleToggleSection(section)}
                      >
                        <Checkbox
                          edge="start"
                          checked={associatedSections.indexOf(section) !== -1}
                          tabIndex={-1}
                          disableRipple
                        />
                        <ListItemText primary={section} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} size="small">Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          size="small"
          disabled={!name || !description || !detailedPrompt || associatedSections.length === 0}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CheckForm; 