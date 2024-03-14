import React, { useState } from "react";
import JSZip from "jszip";
import axios from "axios";

const ZipFolder = () => {
  const [files, setFiles] = useState([]);

  const handleUpload = (e) => {
    const uploadedFiles = e.target.files;
    setFiles(uploadedFiles);
  };

  const zipFolder = async () => {
    const zip = new JSZip();

    for (const file of files) {
      const filePath = file.webkitRelativePath; // Get the relative path
      zip.file(filePath, file);
    }

    const zipFile = await zip.generateAsync({ type: "blob" });

    const formData = new FormData();
    formData.append('file', zipFile);
  
    try {
      const response = await axios.post("http://localhost:8000/api/upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('File uploaded successfully:', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  
   
  };

  return (
    <div>
      <input type="file" directory="" webkitdirectory="" onChange={handleUpload} />
      <button onClick={zipFolder}>Zip Folder</button>
    </div>
  );
};

export default ZipFolder;
