const { exec } = require('child_process');

module.exports.extractZip = function extractZip(zipFilePath, extractionDir) {
    return new Promise((resolve, reject) => {
        const command = `unzip -o ${zipFilePath} -d ${extractionDir}`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Extraction error: ${error.message}`);
                reject(error);
                return;
            }
            if (stderr) {
                console.error(`Extraction stderr: ${stderr}`);
                reject(new Error(stderr));
                return;
            }
            console.log('Extraction complete');
            resolve();
        });
    });
};
