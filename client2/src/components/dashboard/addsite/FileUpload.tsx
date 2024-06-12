'use client';

import * as React from 'react';
import { useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';

interface FileWithRelativePath {
  file: File;
  relativePath: string;
}

interface FileUploadProps {
  files: File[];
  setFiles: (files: File[]) => void;
}

export default function FileUpload({ files, setFiles }: FileUploadProps): React.JSX.Element {
  const [dragging, setDragging] = useState(false);
  const [dirName, setDirName] = useState('');

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    const droppedItems = Array.from(e.dataTransfer.items);
    const allFiles: FileWithRelativePath[] = [];

    const traverseFileTree = (item: FileSystemEntry, path = ''): void => {
      if (item.isFile) {
        (item as FileSystemFileEntry).file((file) => {
          setDirName(path.split('/')[0]);
          allFiles.push({ file, relativePath: path + file.name });
          if (allFiles.length === droppedItems.length) {
            setFiles(allFiles);
          }
        });
      } else if (item.isDirectory) {
        const dirReader = (item as FileSystemDirectoryEntry).createReader();
        dirReader.readEntries((entries) => {
          entries.forEach((entry) => traverseFileTree(entry, path + item.name + '/'));
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

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const inputFiles = e.target.files;
    if (inputFiles) {
      const selectedFiles = Array.from(inputFiles);
      setDirName(selectedFiles[0].webkitRelativePath.split('/')[0]);
      setFiles(selectedFiles);
    }
  };

  return (
    <Paper elevation={10} sx={{ padding: '1%', width: 1 }}>
      <form>
        <label htmlFor="file-input">
          <Box
            className={`file-uploader ${dragging ? 'dragging' : ''}`}
            sx={{
              border: '2px dashed var(--mui-palette-neutral-400)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '35vh',
              cursor: 'pointer',
              px: 6,
              backgroundColor: dragging ? '#080808' : '',
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
            <Typography variant="h6">
              {files.length > 0 ? dirName : 'Drag and drop files here or click to select files'}
            </Typography>
          </Box>
        </label>
      </form>
    </Paper>
  );
}
