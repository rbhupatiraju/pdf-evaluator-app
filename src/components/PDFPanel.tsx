import React, { useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { Box, Typography } from '@mui/material';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set up the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

interface PDFPageInfo {
  originalWidth: number;
}

interface PDFPanelProps {
  pdfFile: File | null;
  scale: number;
  pageNumber: number;
  numPages: number | null;
  onDocumentLoadSuccess: (pdf: PDFDocumentProxy) => void;
  onPageLoadSuccess: (page: PDFPageInfo) => void;
  onPanelResize: (sizes: number[]) => void;
}

const PDFPanel: React.FC<PDFPanelProps> = ({
  pdfFile,
  scale,
  pageNumber,
  numPages,
  onDocumentLoadSuccess,
  onPageLoadSuccess,
  onPanelResize
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pageNumber && panelRef.current) {
      const pageElement = panelRef.current.querySelector(`[data-page-number="${pageNumber}"]`);
      if (pageElement) {
        pageElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }
  }, [pageNumber]);

  return (
    <Box 
      ref={panelRef}
      sx={{ 
        height: '100%', 
        overflow: 'auto', 
        p: 2,
        bgcolor: 'white'
      }}
    >
      {!pdfFile ? (
        <Box sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2
        }}>
          <Typography variant="h6" gutterBottom>
            Upload a PDF file to view
          </Typography>
        </Box>
      ) : (
        <Document
          file={pdfFile}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<Typography>Loading PDF...</Typography>}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 4,
            alignItems: 'center',
            width: '100%',
            maxWidth: '100%',
            '& .react-pdf__Page': {
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              margin: '0 auto',
            }
          }}>
            {Array.from(new Array(numPages || 0), (el, index) => (
              <Box
                key={`page_${index + 1}`}
                id={`page-${index + 1}`}
                data-page-number={index + 1}
                sx={{
                  scrollMarginTop: '1rem'
                }}
              >
                <Page
                  pageNumber={index + 1}
                  scale={scale}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  onLoadSuccess={onPageLoadSuccess}
                />
              </Box>
            ))}
          </Box>
        </Document>
      )}
    </Box>
  );
};

export default PDFPanel; 