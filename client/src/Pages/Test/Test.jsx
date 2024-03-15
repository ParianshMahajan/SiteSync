import React, { useState } from "react";
import JSZip from "jszip";
import axios from "axios";

const ZipFolder = () => {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUpload = (e) => {
    const uploadedFiles = e.target.files;
    setFiles(uploadedFiles);
  };

  const zipFolder = async () => {
    const zip = new JSZip();

    // Total size of files for progress calculation
    let totalSize = 0;
    for (const file of files) {
      const filePath = file.webkitRelativePath; // Get the relative path
      zip.file(filePath, file);
      totalSize += file.size;
    }

    const zipFile = await zip.generateAsync({ type: "blob" });

    const formData = new FormData();
    formData.append("file", zipFile);

    try {
      const response = await axios.post(
        "http://testing.pariansh.tech/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          // Progress handler
          onUploadProgress: (progressEvent) => {
            const progress = (progressEvent.loaded / totalSize) * 100;
            setUploadProgress(progress);
          },
        }
      );
      console.log("File uploaded successfully:", response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      // Reset progress after upload completion
      setUploadProgress(0);
    }
  };

  return (
    <div>
      <input
        type="file"
        directory=""
        webkitdirectory=""
        onChange={handleUpload}
        multiple
      />
      <button onClick={zipFolder}>Zip Folder</button>
      {uploadProgress > 0 && (
        <div>
          <p>Upload Progress: {uploadProgress.toFixed(2)}%</p>
          <progress value={uploadProgress} max="100"></progress>
        </div>
      )}
    </div>
  );
};

export default ZipFolder;
