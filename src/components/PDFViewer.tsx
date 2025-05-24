import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import React, { useEffect, useRef, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useNavigate } from 'react-router-dom';
import CommentaryPanel from './CommentaryPanel';
import PDFPanel from './PDFPanel';

interface PDFPageInfo {
  originalWidth: number;
}

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
          check_id: 'format-1',
          check_short_name: 'Page Margins',
          details: [
            'The document should maintain consistent 1-inch margins on all sides (top, bottom, left, and right) throughout all pages. This is crucial for professional presentation and printing purposes. Check for any content that extends beyond these margins or any inconsistencies in margin sizes between different sections of the document.',
            'Pay special attention to headers and footers, ensuring they are properly positioned within the margin boundaries. Headers should be at least 0.5 inches from the top edge, and footers should be at least 0.5 inches from the bottom edge.',
            'Verify that no text, images, or other elements are cut off or too close to the page edges. All content should be comfortably contained within the margin boundaries while maintaining readability and visual appeal.'
          ],
          check_status: 'fail'
        },
        {
          check_id: 'format-2',
          check_short_name: 'Font Consistency',
          details: [
            'The document should use a consistent font family throughout all sections. Typically, a professional document should use no more than two font families: one for headings and one for body text. Check for any instances where different fonts are used within the same section or where font styles are inconsistent.',
            'Verify that heading styles (H1, H2, H3, etc.) are properly applied and maintain consistent formatting. Each heading level should have its own distinct style while maintaining visual hierarchy. Check for proper font sizes, weights, and spacing between headings and body text.',
            'Ensure that all text elements (paragraphs, lists, tables, etc.) use the same font family and size unless specifically required to be different. Pay attention to any imported content or copied text that might have brought in different font styles.'
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
          check_id: 'content-1',
          check_short_name: 'Executive Summary',
          details: [
            'The executive summary should provide a comprehensive yet concise overview of the entire document, highlighting key findings, recommendations, and main points. It should be written in a clear, professional tone and be accessible to both technical and non-technical readers.',
            'Verify that the summary includes all critical information from the main document, including major conclusions, significant data points, and actionable recommendations. The summary should be self-contained and make sense even if read in isolation from the main document.',
            'Check that the executive summary maintains proper formatting and structure, with clear paragraph breaks and logical flow of information. It should be properly positioned at the beginning of the document and should not exceed 10% of the total document length.'
          ],
          check_status: 'pass'
        },
        {
          check_id: 'content-2',
          check_short_name: 'Financial Data',
          details: [
            'All financial figures, calculations, and data points must be accurate and properly formatted. This includes checking numerical values, currency symbols, decimal places, and date formats. Verify that all calculations are mathematically correct and that the data is presented in a clear, consistent manner throughout the document.',
            'Review all financial tables and charts for proper formatting, including column alignments, decimal point consistency, and proper use of currency symbols. Check that all tables are properly numbered, titled, and referenced in the text. Verify that any formulas or calculations are clearly explained and properly documented.',
            'Ensure that all financial data is properly sourced and that any assumptions or methodologies used in calculations are clearly stated. Check for proper handling of negative numbers, percentages, and any special financial notations or symbols.'
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
          check_id: 'legal-1',
          check_short_name: 'Regulatory Requirements',
          details: [
            'The document must comply with all relevant industry regulations and legal requirements. This includes checking for required legal disclaimers, proper citation of laws and regulations, and adherence to industry-specific compliance standards. Verify that all regulatory references are current and accurate.',
            'Review all legal statements, terms, and conditions for accuracy and completeness. Check that any required legal notices or disclaimers are properly formatted and positioned within the document. Verify that all legal citations follow the correct format and are properly referenced.',
            'Ensure that any data handling or privacy-related content complies with relevant data protection regulations (such as GDPR, CCPA, etc.). Check that all required consent statements and privacy notices are present and properly worded.'
          ],
          check_status: 'pass'
        },
        {
          check_id: 'legal-2',
          check_short_name: 'Data Privacy',
          details: [
            'All personal and sensitive data must be handled in accordance with applicable data protection regulations. This includes proper handling of personal information, appropriate data retention policies, and clear privacy statements. Verify that all data collection and processing activities are properly documented and justified.',
            'Check that all privacy notices and consent forms are present, properly formatted, and contain all required information. Review any data sharing or transfer arrangements to ensure they comply with relevant regulations. Verify that appropriate security measures for data protection are documented.',
            'Ensure that any third-party data processors or service providers are properly identified and that their roles and responsibilities are clearly defined. Check that all data subject rights are properly addressed and that procedures for handling data subject requests are documented.'
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
          check_id: 'tech-1',
          check_short_name: 'System Requirements',
          details: [
            'Verify minimum system requirements are listed',
            'Check for compatibility information',
            'Ensure all dependencies are documented'
          ],
          check_status: 'pass'
        },
        {
          check_id: 'tech-2',
          check_short_name: 'API Documentation',
          details: [
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
          check_id: 'qa-1',
          check_short_name: 'Testing Procedures',
          details: [
            'Review test coverage documentation',
            'Check for test case descriptions',
            'Verify test environment requirements'
          ],
          check_status: 'fail'
        },
        {
          check_id: 'qa-2',
          check_short_name: 'Performance Metrics',
          details: [
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