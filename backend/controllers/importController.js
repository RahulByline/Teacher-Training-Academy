import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { parse } from 'csv-parse';
import XLSX from 'xlsx';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.csv', '.xlsx', '.xls'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only CSV and Excel files are allowed'), false);
  }
};

export const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Parse CSV file
const parseCSVFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const headers = [];
    
    fs.createReadStream(filePath)
      .pipe(parse({ 
        skip_empty_lines: true,
        trim: true
      }))
      .on('data', (data) => {
        if (headers.length === 0) {
          headers.push(...data);
        } else {
          const row = {};
          headers.forEach((header, index) => {
            row[header] = data[index] || '';
          });
          results.push(row);
        }
      })
      .on('end', () => {
        resolve({
          headers,
          data: results,
          preview: results.slice(0, 5)
        });
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

// Parse Excel file
const parseExcelFile = (filePath) => {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (data.length === 0) {
      throw new Error('Empty file');
    }
    
    const headers = data[0];
    const rows = data.slice(1).map(row => {
      const rowObject = {};
      headers.forEach((header, index) => {
        rowObject[header] = row[index] || '';
      });
      return rowObject;
    });

    return {
      headers,
      data: rows,
      preview: rows.slice(0, 5)
    };
  } catch (error) {
    throw new Error(`Failed to parse Excel file: ${error.message}`);
  }
};

// Upload and preview files
export const uploadFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const fileDetails = [];

    for (const file of req.files) {
      try {
        const ext = path.extname(file.originalname).toLowerCase();
        let parsedData;

        if (ext === '.csv') {
          parsedData = await parseCSVFile(file.path);
        } else if (ext === '.xlsx' || ext === '.xls') {
          parsedData = await parseExcelFile(file.path);
        } else {
          throw new Error('Unsupported file type');
        }

        fileDetails.push({
          filename: file.originalname,
          path: file.path,
          headers: parsedData.headers,
          preview: parsedData.preview,
          totalRows: parsedData.data.length,
          data: parsedData.data // Include full data for import
        });

        // Clean up uploaded file after processing
        fs.unlinkSync(file.path);
      } catch (error) {
        console.error(`Error processing file ${file.originalname}:`, error);
        
        // Clean up file on error
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }

        fileDetails.push({
          filename: file.originalname,
          error: error.message
        });
      }
    }

    res.json({
      message: 'Files processed successfully',
      files: fileDetails
    });
  } catch (error) {
    console.error('Upload files error:', error);
    res.status(500).json({ error: 'Failed to process uploaded files' });
  }
};

// Get sample data for mapping preview
export const getSampleData = async (req, res) => {
  try {
    const { filename } = req.params;
    
    // This is a placeholder - in a real implementation, you might want to
    // temporarily store processed file data or re-process the file
    res.json({
      message: 'Sample data endpoint',
      filename,
      note: 'This endpoint can be used to retrieve sample data for a specific file if needed'
    });
  } catch (error) {
    console.error('Get sample data error:', error);
    res.status(500).json({ error: 'Failed to get sample data' });
  }
};