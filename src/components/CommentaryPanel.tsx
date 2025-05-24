import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  IconButton,
  Chip,
  Tooltip,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

interface CheckItem {
  check_id: string;
  check_short_name: string;
  details: string[];
  check_status: 'pass' | 'fail';
  check_feedback?: 'positive' | 'negative' | null;
}

interface Section {
  id: string;
  section_title: string;
  page_number: number;
  checks: CheckItem[];
}

interface CommentaryPanelProps {
  sections: Section[];
  onCheckClick: (pageNum: number) => void;
}

const CommentaryPanel: React.FC<CommentaryPanelProps> = ({
  sections,
  onCheckClick
}) => {
  const [localSections, setLocalSections] = useState<Section[]>(sections);

  const getStatusColor = (status: CheckItem['check_status']): string => {
    return status === 'pass' ? '#4caf50' : '#f44336';
  };

  const handleFeedback = (sectionId: string, checkId: string, feedback: 'positive' | 'negative') => {
    setLocalSections(prevSections => 
      prevSections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            checks: section.checks.map(check => {
              if (check.check_id === checkId) {
                return {
                  ...check,
                  check_feedback: check.check_feedback === feedback ? null : feedback
                };
              }
              return check;
            })
          };
        }
        return section;
      })
    );
  };

  const handleSectionClick = (e: React.MouseEvent, pageNumber: number) => {
    e.stopPropagation();
    onCheckClick(pageNumber);
  };

  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'white'
    }}>
      <Box sx={{ 
        flex: 1,
        overflow: 'auto', 
        p: 2
      }}>
        {sections.length > 0 ? (
          <Box sx={{ mt: 0 }}>
            {localSections.map((section) => (
              <Accordion 
                key={section.id} 
                sx={{ 
                  mb: 0,
                  '&:before': {
                    display: 'none'
                  }
                }}
                defaultExpanded
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  onClick={(e) => handleSectionClick(e, section.page_number)}
                  sx={{
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                      {section.section_title}
                    </Typography>
                    {section.page_number && (
                      <Chip 
                        label={`Page ${section.page_number}`}
                        size="small"
                        sx={{ ml: 2 }}
                      />
                    )}
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {section.checks.map((check) => (
                      <Card 
                        key={check.check_id}
                        onClick={(e) => handleSectionClick(e, section.page_number)}
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: 'rgba(0, 0, 0, 0.04)'
                          }
                        }}
                      >
                        <CardContent sx={{ p: 1.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box 
                              sx={{ 
                                width: 6, 
                                height: 6, 
                                borderRadius: '50%', 
                                bgcolor: getStatusColor(check.check_status),
                                flexShrink: 0
                              }} 
                            />
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                flexGrow: 1,
                                fontSize: '0.75rem',
                                fontWeight: 500
                              }}
                            >
                              {check.check_short_name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Tooltip title="Helpful">
                                <IconButton 
                                  size="small" 
                                  sx={{ 
                                    p: 0.5,
                                    color: check.check_feedback === 'positive' ? 'success.main' : 'inherit'
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleFeedback(section.id, check.check_id, 'positive');
                                  }}
                                >
                                  <ThumbUpIcon sx={{ fontSize: '1rem' }} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Not Helpful">
                                <IconButton 
                                  size="small" 
                                  sx={{ 
                                    p: 0.5,
                                    color: check.check_feedback === 'negative' ? 'error.main' : 'inherit'
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleFeedback(section.id, check.check_id, 'negative');
                                  }}
                                >
                                  <ThumbDownIcon sx={{ fontSize: '1rem' }} />
                                </IconButton>
                              </Tooltip>
                              <IconButton 
                                size="small" 
                                sx={{ p: 0.5 }}
                                onClick={(e) => handleSectionClick(e, section.page_number)}
                              >
                                <NavigateNextIcon sx={{ fontSize: '1rem' }} />
                              </IconButton>
                            </Box>
                          </Box>
                          <List 
                            dense 
                            sx={{ 
                              mt: 0.5, 
                              py: 0,
                              '& .MuiListItem-root': {
                                py: 0.5,
                                pl: 0
                              },
                              '& .MuiListItemText-root': {
                                m: 0,
                                pl: 0
                              }
                            }}
                          >
                            {check.details.map((detail, index) => (
                              <ListItem 
                                key={index} 
                                sx={{ 
                                  pl: 0,
                                  pr: 0
                                }}
                              >
                                <ListItemText
                                  primary={detail}
                                  primaryTypographyProps={{
                                    variant: 'body2',
                                    color: 'text.secondary',
                                    fontSize: '0.75rem',
                                    lineHeight: 1.3
                                  }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        ) : (
          <Typography>
            No sections available for review.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default CommentaryPanel; 