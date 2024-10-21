const express = require('express');
const { isAdmin } = require('../Middlewares/AdminProtect');
const { deployGitUrl } = require('../Controllers/HybridServerController');

const HybridRouter = express.Router();

// Server
HybridRouter
.route('/server/deploy')
.post(deployGitUrl)

HybridRouter
.route('/test')
.get((req,res)=>{
	res.json({
		message:"Hybrid Router is working"
	})
})


// HybridRouter
// .route('/testing')
// .post((req,res)=>{
	
// 	let { port , subDir , subDom , envname, env , dockerfile , dockercompose } = req.body.backend;

// 	dockerfile=dockerfile.replace(/\n/g, "\\n");

// 	dockercompose=dockercompose.replace(/\n/g, "\\n") 
	
// 	env=env.replace(/\n/g, "\\n");

// 	console.log(dockerfile);
// 	console.log("------------------------------------------------");
// 	console.log(dockercompose);
// 	console.log("------------------------------------------------");
// 	console.log(env);
	


// 	function convertEscapedToMultiline(str) {
// 		return str
//         	.replace(/\\n/g, '\n')  // Replace escaped newlines with actual newlines
//         	.replace(/\\"/g, '"')    // Replace escaped quotes with actual quotes
//         	.split('\n')             // Split into lines
//         	.map(line => line.trimStart()) // Remove unnecessary leading spaces
//         	.join('\n')              // Join back into a string
//         	.trim();                 // Trim any leading/trailing whitespace
// 	}
	
// 	// Convert the escaped strings
// 	dockerfile = convertEscapedToMultiline(dockerfile);
// 	dockercompose = convertEscapedToMultiline(dockercompose);
// 	env = convertEscapedToMultiline(env);
	
// 	// Directory to store the files
// 	const outputDir = path.join(__dirname, 'config');
	
// 	// Function to save files
// 	function saveFile(fileName, content) {
// 		if (!fs.existsSync(outputDir)) {
// 			fs.mkdirSync(outputDir);
// 		}
// 		const filePath = path.join(outputDir, fileName);
// 		fs.writeFileSync(filePath, content, 'utf8');
// 		console.log(`${fileName} saved at ${filePath}`);
// 	}
	
// 	// Save the files with the converted content
// 	saveFile('Dockerfile', dockerfile);
// 	saveFile('docker-compose.yml', dockercompose);
// 	saveFile('.env', env);

// 	res.json({
// 		message:"Git Router is working"
// 	})
// })

module.exports = HybridRouter;