import React, { useState } from "react";
import axios from "axios";

const Home = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    console.log(e.target.files[0]);
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('myfile', file);

    console.log(formData);

    axios.post("http://localhost:8000/upload", formData)
      .then(res => {
        console.log(res.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", width: "100%" }}>
      <form onSubmit={handleSubmit}>
        <label htmlFor="myfile">Select a file:</label>
        <br /><br /><br /><br />
        <input
          type="file"
          id="myfile"
          name="myfile"
          onChange={handleFileChange}
        />
        <br /><br /><br /><br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Home;
