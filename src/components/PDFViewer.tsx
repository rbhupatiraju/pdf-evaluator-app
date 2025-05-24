import React, { useState, useRef, useEffect } from 'react';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Box, Typography, Button, AppBar, Toolbar, IconButton } from '@mui/material';
import PDFPanel from './PDFPanel';
import CommentaryPanel from './CommentaryPanel';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface PDFPageInfo {
  originalWidth: number;
}

interface CheckItem {
  id: string;
  check_title: string;
  check_descriptions: string[];
  check_status: 'pass' | 'fail';
  check_feedback?: 'positive' | 'negative' | null;
}

interface Section {
  id: string;
  section_title: string;
  page_number: number;
  checks: CheckItem[];
}

interface Document {
  id: string;
  doc_name: string;
  doc_type: string;
  client_name: string;
  last_updated_by: string;
  last_updated_date: string;
  doc_status: string;
}

const PDFViewer: React.FC = () => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pageWidth, setPageWidth] = useState<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [leftPanelWidth, setLeftPanelWidth] = useState<number>(50);
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);

  // Sample sections data - replace with your actual data
  const sections: Section[] = [
    {
      id: 'formatting',
      section_title: 'Document Formatting',
      page_number: 1,
      checks: [
        {
          id: 'format-1',
          check_title: 'Page Margins',
          check_descriptions: [
            'Verify that all pages have consistent margins',
            'Check for proper spacing around headers and footers',
            'Ensure no content is cut off at the edges'
          ],
          check_status: 'fail'
        },
        {
          id: 'format-2',
          check_title: 'Font Consistency',
          check_descriptions: [
            'Check for consistent font usage throughout the document',
            'Verify heading styles are properly applied',
            'Ensure no mixed font families in paragraphs'
          ],
          check_status: 'pass'
        }
      ]
    },
    {
      id: 'content',
      section_title: 'Content Review',
      page_number: 3,
      checks: [
        {
          id: 'content-1',
          check_title: 'Executive Summary',
          check_descriptions: [
            'Review the executive summary for completeness',
            'Check for key findings and recommendations',
            'Verify alignment with main document content'
          ],
          check_status: 'pass'
        },
        {
          id: 'content-2',
          check_title: 'Financial Data',
          check_descriptions: [
            'Verify all financial figures and calculations',
            'Check for proper formatting of currency values',
            'Ensure all tables are properly labeled and referenced'
          ],
          check_status: 'fail'
        }
      ]
    },
    {
      id: 'legal',
      section_title: 'Legal Compliance',
      page_number: 5,
      checks: [
        {
          id: 'legal-1',
          check_title: 'Regulatory Requirements',
          check_descriptions: [
            'Verify compliance with industry regulations',
            'Check for required legal disclaimers',
            'Ensure proper citation of laws and regulations'
          ],
          check_status: 'pass'
        },
        {
          id: 'legal-2',
          check_title: 'Data Privacy',
          check_descriptions: [
            'Review data protection statements',
            'Check for proper handling of personal information',
            'Verify GDPR compliance where applicable'
          ],
          check_status: 'fail'
        }
      ]
    },
    {
      id: 'technical',
      section_title: 'Technical Specifications',
      page_number: 7,
      checks: [
        {
          id: 'tech-1',
          check_title: 'System Requirements',
          check_descriptions: [
            'Verify minimum system requirements are listed',
            'Check for compatibility information',
            'Ensure all dependencies are documented'
          ],
          check_status: 'pass'
        },
        {
          id: 'tech-2',
          check_title: 'API Documentation',
          check_descriptions: [
            'Review API endpoint documentation',
            'Check for proper request/response examples',
            'Verify authentication requirements are clear'
          ],
          check_status: 'pass'
        }
      ]
    },
    {
      id: 'quality',
      section_title: 'Quality Assurance',
      page_number: 9,
      checks: [
        {
          id: 'qa-1',
          check_title: 'Testing Procedures',
          check_descriptions: [
            'Review test coverage documentation',
            'Check for test case descriptions',
            'Verify test environment requirements'
          ],
          check_status: 'fail'
        },
        {
          id: 'qa-2',
          check_title: 'Performance Metrics',
          check_descriptions: [
            'Verify performance benchmarks are documented',
            'Check for load testing results',
            'Ensure scalability requirements are clear'
          ],
          check_status: 'pass'
        }
      ]
    }
  ];

  const onDocumentLoadSuccess = ({ numPages }: PDFDocumentProxy): void => {
    setNumPages(numPages);
  };

  const handlePageLoadSuccess = (page: PDFPageInfo): void => {
    if (!pageWidth) {
      setPageWidth(page.originalWidth);
    }
  };

  const calculateScale = (panelWidth: number): number => {
    if (!pageWidth) return 1.0;
    const availableWidth = panelWidth - 80; // Account for padding
    const minScale = 0.5;
    const maxScale = 2.0;
    const baseScale = availableWidth / pageWidth;
    return Math.min(Math.max(baseScale, minScale), maxScale);
  };

  const handlePanelResize = (sizes: number[]): void => {
    setLeftPanelWidth(sizes[0]);
    if (panelRef.current) {
      const containerWidth = panelRef.current.offsetWidth;
      const panelWidth = (containerWidth * sizes[0]) / 100;
      const newScale = calculateScale(panelWidth);
      setScale(newScale);
    }
  };

  useEffect(() => {
    if (panelRef.current && pageWidth) {
      const containerWidth = panelRef.current.offsetWidth;
      const panelWidth = (containerWidth * leftPanelWidth) / 100;
      const newScale = calculateScale(panelWidth);
      setScale(newScale);
    }
  }, [pageWidth, leftPanelWidth]);

  useEffect(() => {
    const storedDocument = localStorage.getItem('selectedDocument');
    if (storedDocument) {
      setDocument(JSON.parse(storedDocument));
    } else {
      // If no document is selected, redirect back to the list
      navigate('/');
    }
  }, [navigate]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setPageWidth(null);
      setPageNumber(1);
    } else {
      alert('Please upload a valid PDF file');
    }
  };

  const handleCheckClick = (pageNum: number): void => {
    setPageNumber(pageNum);
    setTimeout(() => {
      const pageElement = document.getElementById(`page-${pageNum}`);
      if (pageElement) {
        pageElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 100);
  };

  if (!document) {
    return null;
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            PDF Viewer
          </Typography>
          <Button
            variant="contained"
            component="label"
            sx={{ ml: 2 }}
          >
            Upload PDF
            <input
              type="file"
              hidden
              accept=".pdf"
              onChange={handleFileUpload}
            />
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, overflow: 'hidden' }} ref={panelRef}>
        <PanelGroup direction="horizontal" onLayout={handlePanelResize}>
          <Panel defaultSize={50} minSize={30}>
            <PDFPanel
              pdfFile={pdfFile}
              scale={scale}
              pageNumber={pageNumber}
              numPages={numPages}
              onDocumentLoadSuccess={onDocumentLoadSuccess}
              onPageLoadSuccess={handlePageLoadSuccess}
              onPanelResize={handlePanelResize}
            />
          </Panel>
          
          <PanelResizeHandle style={{ width: '4px', background: '#ccc' }} />
          
          <Panel defaultSize={50} minSize={30}>
            <CommentaryPanel
              pdfFile={pdfFile}
              sections={sections}
              onCheckClick={handleCheckClick}
            />
          </Panel>
        </PanelGroup>
      </Box>

      <Box 
        component="footer" 
        sx={{ 
          py: 2, 
          px: 3, 
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider'
        }}
      >
        <Typography variant="body2" color="text.secondary" align="center">
          {pdfFile ? (
            <>
              {`Page ${pageNumber} of ${numPages}`} • 
              {` Scale: ${Math.round(scale * 100)}%`}
            </>
          ) : (
            'No PDF file selected'
          )}
        </Typography>
      </Box>
    </Box>
  );
};

export default PDFViewer; 