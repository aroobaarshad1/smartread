declare module 'pdf-parse/lib/pdf-parse' {
    import { Buffer } from 'buffer';
  
    interface PDFInfo {
      text: string;
      numpages: number;
      numrender: number;
      info: Record<string, any>;
      metadata: any;
      version: string;
    }
  
    function pdf(buffer: Buffer): Promise<PDFInfo>;
  
    export = pdf;
  }
  