import React, { useState, useRef } from 'react';
import { Camera } from 'lucide-react';

const BasicDetail = ({ userInfo }) => {
  const [details, setDetails] = useState({
    name: userInfo?.name || '',
    email: userInfo?.email || '',
    profileImage: userInfo?.profileImage || '',
    bio: userInfo?.bio || ''
  });
  
  const timeoutRef = useRef(null);

  const onInputChange = (event, fieldName) => {
    const { value } = event.target;
    setDetails((prev) => ({ ...prev, [fieldName]: value }));
    
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      try {
        // Simulated db update - replace with your actual implementation
        console.log('Saving:', fieldName, value);
      } catch (error) {
        console.error('Error saving changes:', error);
      }
    }, 1000);
  };

  return (
    <div className="card w-full max-w-3xl mx-auto bg-base-300 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-base mb-4 text-base-content/80">Personal Information</h2>
        
        <form className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="avatar">
              <div className="w-16 rounded-full ring ring-primary/30 ring-offset-base-100 ring-offset-2">
                {details.profileImage ? (
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
            
            <div className="flex-1">
              <label className="label">
                <span className="label-text text-xs text-base-content/70">Profile Image URL</span>
              </label>
              <input
                type="text"
                placeholder="Enter image URL"
                className="input input-bordered input-sm w-full bg-base-100 text-base-content/80"
                value={details.profileImage}
                onChange={(e) => onInputChange(e, 'profileImage')}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="label">
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default BasicDetail;