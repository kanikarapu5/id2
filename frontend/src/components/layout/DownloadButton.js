import React from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';

const DownloadButton = () => {
  const downloadData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
        },
        responseType: 'blob', // Important
      };
      const res = await axios.get('/api/export', config);
      const blob = new Blob([res.data], { type: 'application/zip' });
      saveAs(blob, 'student-data.zip');
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <button onClick={downloadData}>
      Download Student Data
    </button>
  );
};

export default DownloadButton;
