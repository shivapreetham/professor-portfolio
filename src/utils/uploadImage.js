import { createClient } from '@supabase/supabase-js';

// Configure Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY
);

const defaultConfig = {
  bucketName: 'images',
  maxFileSize: 5 * 1024 * 1024, // 5MB
  acceptedFileTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
};

export const uploadImage = async (file, config = {}) => {
  try {
    // Merge default config with provided config
    const finalConfig = { ...defaultConfig, ...config };
    const {
      bucketName,
      folderPath,
      maxFileSize,
      acceptedFileTypes
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

    // Upload file to Supabase
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

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