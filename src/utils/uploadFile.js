//utils/uploadFile.js
import { createClient } from '@supabase/supabase-js';

// Configure Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY
);

const defaultConfig = {
  bucketName: 'documents',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  acceptedFileTypes: ["application/pdf", "pdf"], // Added "pdf" for broader compatibility
};

export const uploadFile = async (file, config = {}) => {
    console.log("at upload file")
  try {
    // Check if file exists
    if (!file) {
      throw new Error('No file provided');
    }

    // Merge default config with provided config
    const finalConfig = { ...defaultConfig, ...config };
    const {
      bucketName,
      folderPath,
      maxFileSize = defaultConfig.maxFileSize,
      acceptedFileTypes = defaultConfig.acceptedFileTypes
    } = finalConfig;

    // More flexible file type checking
    const fileType = file.type || `application/${file.name.split('.').pop()}`;
    const isAcceptedType = acceptedFileTypes.some(type => 
      fileType.includes(type) || file.name.toLowerCase().endsWith(`.${type}`)
    );

    if (!isAcceptedType) {
      return {
        success: false,
        error: `Invalid file type. Only PDF files are accepted.`
      };
    }

    // Validate file size
    if (file.size > maxFileSize) {
      return {
        success: false,
        error: `File too large. Maximum size: ${maxFileSize / (1024 * 1024)}MB`
      };
    }

    // Generate unique file name with original file name included
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    console.log(sanitizedFileName)
    const fileName = `${folderPath ? `${folderPath}/` : ''}${Date.now()}-${sanitizedFileName}`;

    // Upload file to Supabase
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'application/pdf'
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    return {
      success: true,
      url: publicUrl,
      fileName: sanitizedFileName
    };

  } catch (error) {
    console.error('Upload failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
};
