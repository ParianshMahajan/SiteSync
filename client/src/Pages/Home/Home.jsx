import React, { useState } from "react";
import JSZip from "jszip";
import axios from "axios";
import config from "../../config";

const Home = () => {


  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [data, setData] = useState({
    fname: "",
  });

  const url=config.apiUrl+'/api/upload';


  const handleUpload = (e) => {
    const uploadedFiles = e.target.files;
    setFiles(uploadedFiles);
  };

  const zipFolder = async () => {
    const zip = new JSZip();
  
    let totalSize = 0;  
    const selectedDirectory = files[0].webkitRelativePath.split("/")[0];
  
    for (const file of files) {
      const filePath = file.webkitRelativePath;
      if (filePath.startsWith(selectedDirectory + '/')) {
        zip.file(filePath.substring(selectedDirectory.length + 1), file);
        totalSize += file.size;
      }
    }
  
    const zipFile = await zip.generateAsync({ type: "blob" });
  
    const formData = new FormData();
    formData.append("file", zipFile);

    formData.append("data", JSON.stringify(data));

  
    try {
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        // Progress handler
        onUploadProgress: (progressEvent) => {
          const progress = (progressEvent.loaded / totalSize) * 100;
          setUploadProgress(progress);
        },
      });
  
      console.log("File uploaded successfully:", response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploadProgress(0);
    }
  };

  
  function handleChange(e) {
    const newdata = { ...data };
    newdata[e.target.id] = e.target.value;
    setData(newdata);
  }

  return (
    <div>
      <input
        type="file"
        directory=""
        webkitdirectory=""
        onChange={handleUpload}
        multiple
      />

      <input
        type="text"
        id="fname"
        value={data.fname}
        placeholder="File Name"
        onChange={(e)=>handleChange(e)}
        required={true}
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

export default Home;
