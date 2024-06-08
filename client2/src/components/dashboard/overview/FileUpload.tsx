'use client';

import * as React from 'react';
import { useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';



interface FileWithRelativePath {
  file: File;
  relativePath: string;
}

interface FileUploadProps {
  setFiles: (files: File[]) => void;
}



export default function FileUpload({setFiles}:FileUploadProps): React.JSX.Element {
  const [dragging, setDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>):void => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>):void => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>):void => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    const droppedItems = Array.from(e.dataTransfer.items);
    const allFiles: FileWithRelativePath[] = [];

    const traverseFileTree = (item: FileSystemEntry, path = ""): void => {
      if (item.isFile) {
        (item as FileSystemFileEntry).file((file) => {
          allFiles.push({ file, relativePath: path + file.name });
          if (allFiles.length === droppedItems.length) {
            setFiles(allFiles );
          }
        });
      } else if (item.isDirectory) {
        const dirReader = (item as FileSystemDirectoryEntry).createReader();
        dirReader.readEntries((entries) => {
          entries.forEach((entry) => traverseFileTree(entry, path + item.name + "/"));
        });
      }
    };

    droppedItems.forEach((item) => {
      const entry = item.webkitGetAsEntry();
      if (entry) {
        traverseFileTree(entry);
      }
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>):void => {
    const inputFiles = e.target.files;
    if (inputFiles) {
      const selectedFiles = Array.from(inputFiles);
      setFiles(selectedFiles);
    }
  };

  return (
    <Paper elevation={10} sx={{ padding: '1%' }}>
      <form>

      <label htmlFor="file-input">
        <Box
          className={`file-uploader ${dragging ? 'dragging' : ''}`}
          sx={{
            border: '2px dashed var(--mui-palette-neutral-400)',
            borderRadius: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '40vh',
            cursor: 'pointer',
            px:6,
            backgroundColor: dragging ? '#f2f2f2' : 'white',
            }}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            id="file-input"
            type="file"
            webkitdirectory=""
            style={{ display: 'none' }}
            onChange={handleFileInputChange}
            multiple
          />
          <Typography variant="h6">Drag and drop files here or click to select files</Typography> 
        </Box>
      </label>
    </form>
    </Paper>
  );
}
