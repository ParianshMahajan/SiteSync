const fs = require('fs');
const path = require('path');
const StreamZip = require('node-stream-zip');

module.exports.extractZip = function extractZip(zipFilePath, extractionDir) {
    return new Promise((resolve, reject) => {
        const zip = new StreamZip({
            file: zipFilePath,
            storeEntries: true // Ensures that the zip entries are stored in memory for easy access
        });

        zip.on('error', err => {
            console.error('Extraction error:', err);
            reject(err);
        });

        zip.on('ready', () => {
            // Extract all entries to the specified directory
            zip.extract(null, extractionDir, err => {
                if (err) {
                    console.error('Extraction error:', err);
                    reject(err);
                } else {
                    console.log('Extraction complete');
                    resolve();
                }
                // Close the zip file
                zip.close();
            });
        });
    });
};
