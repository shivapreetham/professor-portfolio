import React from "react";

const MobilePreview = () => {
  return (
    <div className="p-2 md:fixed">
      {/* Mobile container styled to look like a mobile device */}
      <div className="border-[13px] min-w-[340px] w-full max-w-[400px] max-h-[650px] border-black h-screen rounded-[40px] m-2 shadow-md shadow-primary">
        {/* Replace the content below with your mobile preview content */}
        {/* <h2 className="text-center text-xl font-bold mt-4">Mobile Preview</h2>
        <p className="text-center text-gray-600 mt-2">
          Your mobile view will be rendered here.
        </p> */}
        <iframe title="Mobile Preview" src={process.env.NEXT_PUBLIC_BASE_URL } width="100%" height="100%" className="rounded-[40px]"/>
      </div>
    </div>
  );
};

export default MobilePreview;
