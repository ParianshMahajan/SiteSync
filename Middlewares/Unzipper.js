const fs = require('fs');
const path = require('path');
const yauzl = require('yauzl');

module.exports.extractZip = async function extractZip(zipFilePath, extractionDir) {
    try {
        await new Promise((resolve, reject) => {
            yauzl.open(zipFilePath, { lazyEntries: true }, (err, zipfile) => {
                if (err) {
                    reject(err);
                    return;
                }

                zipfile.readEntry();

                zipfile.on('entry', entry => {
                    const outputPath = path.join(extractionDir, entry.fileName);

                    if (entry.fileName.endsWith('/')) {
                        // Directory entry, create directory
                        fs.mkdirSync(outputPath, { recursive: true });
                        zipfile.readEntry();
                    } else {
                        // File entry, extract file
                        zipfile.openReadStream(entry, (err, readStream) => {
                            if (err) {
                                reject(err);
                                return;
                            }

                            readStream.on('error', err => reject(err));

                            readStream.pipe(fs.createWriteStream(outputPath));
                            readStream.on('end', () => {
                                zipfile.readEntry();
                            });
                        });
                    }
                });

                zipfile.on('end', () => {
                    resolve();
                });

                zipfile.on('error', err => {
                    reject(err);
                });
            });
        });

        console.log('Extraction complete');
    } catch (error) {
        console.error('Extraction error:', error);
        throw error;
    }
};
