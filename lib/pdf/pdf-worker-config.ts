import { pdfjs } from "react-pdf"

// Configure PDF.js worker from public directory
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf-worker/pdf.worker.min.mjs"

export { pdfjs } from "react-pdf"
