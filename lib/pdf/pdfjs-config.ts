import * as pdfjs from "pdfjs-dist"

// Configure worker from npm package
// This uses the ESM build that's compatible with modern bundlers
if (typeof window !== "undefined") {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
    ).toString()
}

export { pdfjs }
