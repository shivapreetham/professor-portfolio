import React, { useState, useRef } from 'react';
import { Camera } from 'lucide-react';
import { eq } from 'drizzle-orm';
import { db } from '@/utils/db';
import { user } from '@/utils/schema';
import { toast } from 'react-hot-toast';
import { uploadImage } from '@/utils/uploadImage'; // Import the uploadImage function

const BasicDetail = ({ userInfo }) => {
  const [details, setDetails] = useState({
    name: userInfo?.name || '',
    email: userInfo?.email || '',
    profileImage: userInfo?.profileImage || '',
    bio: userInfo?.bio || '',
    location: userInfo?.location || '',
    linkedIn: userInfo?.linkedIn || ''
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const timeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  const onInputChange = (event, fieldName) => {
    const { value } = event.target;
    setDetails((prev) => ({ ...prev, [fieldName]: value }));
    
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      try {
        const result = await db.update(user)
          .set({ [fieldName]: value })
          .where(eq(user.id, "1"));
        toast.success('Changes saved successfully!');
        console.log('Updated:', fieldName, result);
      } catch (error) {
        console.error('Error saving changes:', error);
        toast.error('Failed to save changes');
      }
    }, 2000);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const result = await uploadImage(file, {
        bucketName: 'profile-images',
        folderPath: 'avatars'
      });

      if (result.success) {
        // Update state and database with new image URL
        setDetails(prev => ({ ...prev, profileImage: result.url }));
        await db.update(user)
          .set({ profileImage: result.url })
          .where(eq(user.id, "1"));
        toast.success('Profile image updated successfully!');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="card w-full max-w-3xl mx-auto bg-base-300 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-base mb-4 text-base-content/80">Personal Information</h2>
        
        <form className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="avatar">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
                accept="image/jpeg,image/png,image/webp"
                disabled={isUploading}
              />
              <div 
                className="w-16 rounded-full ring ring-primary/30 ring-offset-base-100 ring-offset-2 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {isUploading ? (
                  <div className="bg-base-200 w-full h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : details.profileImage ? (
                  <img 
                    src={details.profileImage} 
                    alt="Profile"
                  />
                ) : (
                  <div className="bg-base-200 w-full h-full flex items-center justify-center">
                    <Camera className="h-8 w-8 opacity-40" />
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label className="label flex-1">
                <span className="label-text text-xs text-base-content/70">Full Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="input input-bordered input-sm w-full bg-base-100 text-base-content/80"
                value={details.name}
                onChange={(e) => onInputChange(e, 'name')}
              />
            </div>
          </div>

          <div className="space-y-4">
            

            <div>
              <label className="label">
                <span className="label-text text-xs text-base-content/70">Email Address</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="input input-bordered input-sm w-full bg-base-100 text-base-content/80"
                value={details.email}
                onChange={(e) => onInputChange(e, 'email')}
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text text-xs text-base-content/70">Bio</span>
              </label>
              <textarea
                placeholder="Tell us about yourself"
                className="textarea textarea-bordered w-full text-sm h-24 bg-base-100 text-base-content/80"
                value={details.bio}
                onChange={(e) => onInputChange(e, 'bio')}
              />
            </div>
            <div>
          <label className="label">
            <span className="label-text text-xs text-base-content/70">Location</span>
          </label>
          <input
            type="text"
            placeholder="Enter your location"
            className="input input-bordered input-sm w-full bg-base-100 text-base-content/80"
            value={details.location}
            onChange={(e) => onInputChange(e, 'location')}
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text text-xs text-base-content/70">LinkedIn Profile</span>
          </label>
          <input
            type="url"
            placeholder="Enter your LinkedIn URL"
            className="input input-bordered input-sm w-full bg-base-100 text-base-content/80"
            value={details.linkedIn}
            onChange={(e) => onInputChange(e, 'linkedIn')}
          />
        </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BasicDetail;