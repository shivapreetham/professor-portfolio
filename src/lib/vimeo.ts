import Vimeo from '@vimeo/vimeo';

const client = new Vimeo(
  process.env.VIMEO_CLIENT_ID!,
  process.env.VIMEO_CLIENT_SECRET!,
  process.env.VIMEO_ACCESS_TOKEN!
);

export const uploadVideo = async (file: File) => {
  return new Promise((resolve, reject) => {
    client.upload(
      file,
      {
        name: file.name,
        description: 'Uploaded via Next.js app'
      },
      function (uri) {
        resolve(uri);
      },
      function (bytesUploaded, bytesTotal) {
        const percentage = (bytesUploaded / bytesTotal * 100).toFixed(2);
        console.log(percentage + '% uploaded');
      },
      function (error) {
        reject(error);
      }
    );
  });
};

export const deleteVideo = async (videoId: string) => {
  return new Promise((resolve, reject) => {
    client.request({
      method: 'DELETE',
      path: `/videos/${videoId}`
    }, (error, response, statusCode) => {
      if (error) {
        reject(error);
      } else {
        resolve(statusCode);
      }
    });
  });
};

export const getVideo = async (videoId: string) => {
  return new Promise((resolve, reject) => {
    client.request({
      method: 'GET',
      path: `/videos/${videoId}`
    }, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
};
