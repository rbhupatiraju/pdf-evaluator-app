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
  title: string;
  descriptions: string[];
  status: 'pass' | 'fail';
  feedback?: 'positive' | 'negative' | null;
}

interface Section {
  id: string;
  title: string;
  pageNumber: number;
  checks: CheckItem[];
}

interface Document {
  id: string;
  name: string;
  type: string;
  client: string;
  lastUpdatedBy: string;
  lastUpdatedDate: string;
  status: string;
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
      title: 'Document Formatting',
      pageNumber: 1,
      checks: [
        {
          id: 'format-1',
          title: 'Page Margins',
          descriptions: [
            'Verify that all pages have consistent margins',
            'Check for proper spacing around headers and footers',
            'Ensure no content is cut off at the edges'
          ],
          status: 'fail'
        },
        {
          id: 'format-2',
          title: 'Font Consistency',
          descriptions: [
            'Check for consistent font usage throughout the document',
            'Verify heading styles are properly applied',
            'Ensure no mixed font families in paragraphs'
          ],
          status: 'pass'
        }
      ]
    },
    {
      id: 'content',
      title: 'Content Review',
      pageNumber: 3,
      checks: [
        {
          id: 'content-1',
          title: 'Executive Summary',
          descriptions: [
            'Review the executive summary for completeness',
            'Check for key findings and recommendations',
            'Verify alignment with main document content'
          ],
          status: 'pass'
        },
        {
          id: 'content-2',
          title: 'Financial Data',
          descriptions: [
            'Verify all financial figures and calculations',
            'Check for proper formatting of currency values',
            'Ensure all tables are properly labeled and referenced'
          ],
          status: 'fail'
        }
      ]
    },
    {
      id: 'legal',
      title: 'Legal Compliance',
      pageNumber: 5,
      checks: [
        {
          id: 'legal-1',
          title: 'Regulatory Requirements',
          descriptions: [
            'Verify compliance with industry regulations',
            'Check for required legal disclaimers',
            'Ensure proper citation of laws and regulations'
          ],
          status: 'pass'
        },
        {
          id: 'legal-2',
          title: 'Data Privacy',
          descriptions: [
            'Review data protection statements',
            'Check for proper handling of personal information',
            'Verify GDPR compliance where applicable'
          ],
          status: 'fail'
        }
      ]
    },
    {
      id: 'technical',
      title: 'Technical Specifications',
      pageNumber: 7,
      checks: [
        {
          id: 'tech-1',
          title: 'System Requirements',
          descriptions: [
            'Verify minimum system requirements are listed',
            'Check for compatibility information',
            'Ensure all dependencies are documented'
          ],
          status: 'pass'
        },
        {
          id: 'tech-2',
          title: 'API Documentation',
          descriptions: [
            'Review API endpoint documentation',
            'Check for proper request/response examples',
            'Verify authentication requirements are clear'
          ],
          status: 'pass'
        }
      ]
    },
    {
      id: 'quality',
      title: 'Quality Assurance',
      pageNumber: 9,
      checks: [
        {
          id: 'qa-1',
          title: 'Testing Procedures',
          descriptions: [
            'Review test coverage documentation',
            'Check for test case descriptions',
            'Verify test environment requirements'
          ],
          status: 'fail'
        },
        {
          id: 'qa-2',
          title: 'Performance Metrics',
          descriptions: [
            'Verify performance benchmarks are documented',
            'Check for load testing results',
            'Ensure scalability requirements are clear'
          ],
          status: 'pass'
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