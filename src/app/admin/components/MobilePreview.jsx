import React from "react";

const MobilePreview = () => {
  return (
    <div className="p-2">
      {/* Mobile container styled to look like a mobile device */}
      <div className="border-[13px] border-black h-screen rounded-[40px] m-2 shadow-md shadow-primary">
        {/* Replace the content below with your mobile preview content */}
        <h2 className="text-center text-xl font-bold mt-4">Mobile Preview</h2>
        <p className="text-center text-gray-600 mt-2">
          Your mobile view will be rendered here.
        </p>
      </div>
    </div>
  );
};

export default MobilePreview;
