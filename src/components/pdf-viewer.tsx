'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Configure the worker to load pdfs.
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.mjs',
//   import.meta.url,
// ).toString();
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;


interface PdfViewerProps {
  file: string;
}

export function PdfViewer({ file }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset: number) {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  function previousPage() {
    if (pageNumber > 1) {
      changePage(-1);
    }
  }

  function nextPage() {
    if (numPages && pageNumber < numPages) {
      changePage(1);
    }
  }

  return (
    <div className="flex flex-col items-center h-full">
      <div className="overflow-y-auto flex-grow w-full">
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          className="flex justify-center"
        >
          <Page pageNumber={pageNumber} />
        </Document>
      </div>
      {numPages && (
        <div className="flex items-center justify-center gap-4 mt-4">
          <Button onClick={previousPage} disabled={pageNumber <= 1} variant="outline" size="icon">
            <ChevronLeft />
          </Button>
          <span>
            Page {pageNumber} of {numPages}
          </span>
          <Button onClick={nextPage} disabled={pageNumber >= numPages} variant="outline" size="icon">
            <ChevronRight />
          </Button>
        </div>
      )}
    </div>
  );
}
