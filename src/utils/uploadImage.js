import { createClient } from '@supabase/supabase-js';

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
}

// Configure Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

const defaultConfig = {
  bucketName: 'images',
  maxFileSize: 5 * 1024 * 1024, // 5MB
  acceptedFileTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  timeout: 30000, // 30 seconds timeout
};

// Create a timeout promise helper
const withTimeout = (promise, ms) => {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms)
  );
  return Promise.race([promise, timeout]);
};

export const uploadImage = async (file, config = {}) => {
  try {
    // Merge default config with provided config
    const finalConfig = { ...defaultConfig, ...config };
    const {
      bucketName,
      folderPath,
      maxFileSize,
      acceptedFileTypes,
      timeout
    } = finalConfig;

    // Validate file type
    if (!acceptedFileTypes.includes(file.type)) {
      return {
        success: false,
        error: `Invalid file type. Accepted types: ${acceptedFileTypes.join(', ')}`
      };
    }

    // Validate file size
    if (file.size > maxFileSize) {
      return {
        success: false,
        error: `File too large. Maximum size: ${maxFileSize / (1024 * 1024)}MB`
      };
    }

    // Generate unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${folderPath ? `${folderPath}/` : ''}${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    // Upload file to Supabase with timeout
    const uploadPromise = supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    const { error: uploadError } = await withTimeout(uploadPromise, timeout);

    if (uploadError) throw uploadError;

    // Get public URL with timeout
    const urlPromise = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    const { data: { publicUrl } } = await withTimeout(Promise.resolve(urlPromise), 5000);

    return {
      success: true,
      url: publicUrl
    };

  } catch (error) {
    console.error('Upload failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
};

