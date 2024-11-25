const { triggerScript } = require("../config/VM_Trigger");
const AdminModel = require("../Models/AdminModel");
const { createDns } = require("./CloudflareController");
const axios = require('axios');

async function cloneRepo(name, git_url, token, branch) {
	try {
		const path=`${process.env.CurrPath}Scripts/GitClone.sh`;
        const implementPath=`${process.env.UserPath}${process.env.Hybrid}`;
        const args=` ${implementPath} ${git_url} ${token.gitToken} ${branch}`;


        const scriptResult = await triggerScript(path,args);
        if (scriptResult === false) {
            throw new Error("Script Execution Failed");
        }

		return true;
	} catch (error) {
		console.error(error.message);
		return false;
	}

}




function convertMultilineToSingleLine(multilineString) {
    if(multilineString==='') return multilineString;
	return multilineString
		.replace(/\n/g, "\\n")  
		.replace(/'/g, "'\\''"); 
}

async function addDockerFiles(dockerfile, dockercompose, envname, env, name, subDir, token){
	try{
		
        
		dockerfile = convertMultilineToSingleLine(dockerfile);
		dockercompose = convertMultilineToSingleLine(dockercompose);
		env = convertMultilineToSingleLine(env);

		// Adding dockerfiles and docker-compose files 
		const path=`${process.env.CurrPath}Scripts/server/AddFiles.sh`;
		const implementPath=`${process.env.UserPath}${process.env.Hybrid}${name}/${subDir}`;
		const args = ` ${implementPath} ${token.gitToken} '${dockerfile}' '${dockercompose}' '${envname}' '${env}'`;


		const scriptResult = await triggerScript(path,args);
		if (scriptResult === false) {
			throw new Error("Script Execution Failed");
		}

		return true;
	} catch (error) {
		console.error(error.message);
		return false;
	}

}

async function SiteDown(port, confname){
	try{
        
        const path=`${process.env.CurrPath}Scripts/server/ShutDown.sh`;
        const args=` ${port} ${confname}`;

        const scriptResult = await triggerScript(path,args);
        if (scriptResult === false) {
            throw new Error("Script Execution Failed");
        }

		return true;
	} catch (error) {
		console.error(error.message);
		return false;
	}

}

async function SiteUp(name,subDir, confname){
	try{
        
        const path=`${process.env.CurrPath}Scripts/server/UpSite.sh`;
        const implementPath=`${process.env.UserPath}${process.env.Hybrid}${name}/${subDir}`;
        const args=` ${implementPath} ${confname}`;

        const scriptResult = await triggerScript(path,args);
        if (scriptResult === false) {
            throw new Error("Script Execution Failed");
        }

		return true;
	} catch (error) {
		console.error(error.message);
		return false;
	}

}






module.exports.deployGitUrl = async function deployGitUrl(req, res) {
    try {

        const { name, git_url, branch} = req.body;
        // const token=await AdminModel.findOne({username:req.user.username}).select('gitToken');
        const token=await AdminModel.findOne({username:'CCSisAdmin'}).select('gitToken');


		const cloneStatus = await cloneRepo(name, git_url, token, branch);
		if (cloneStatus === false) {
			throw new Error("Repo Clone Failed");
		}
       



        if(req.body.backend.mode){

            const { port , subDir , subDom , envname, env , dockerfile , dockercompose } = req.body.backend;

           
			const dockerStatus = await addDockerFiles(dockerfile, dockercompose, envname, env, name, subDir, token);
			if (dockerStatus === false) {
				throw new Error("Docker Files Addition Failed");
			}

            
            // creating dns
            const dnsResult=await createDns(subDom);
            if(dnsResult==false){
              throw new Error('DNS Creation Failed');
            }
            
            
            
            // creating nginx conf
            const path=`${process.env.CurrPath}Scripts/server/NginxConf.sh`;
            const args=` ${port} ${dnsResult.name} ${subDom}-api`;        
            
            const scriptResult = await triggerScript(path,args);
            if (scriptResult === false) {
                throw new Error("Script Execution Failed");
            }
            
        }

        if(req.body.frontend.mode){

            const { subDir , subDom  } = req.body.frontend;
            
        }
        
        res.status(200).json({
            status: true,
            message: "Site Deployed Successfully"
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
}



module.exports.shutDown = async function shutDown(req, res) {
    try {

        const { port,confname} = req.body;

        const downStatus = await SiteDown(port, confname);
        if (downStatus === false) {
            throw new Error("Site Down Failed");
        }

        res.status(200).json({
            status: true,
            message: "Site Down Successfully"
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
}

module.exports.dockerUp = async function dockerUp(req, res) {
    try {

        const { name,subDir,confname} = req.body;

        const upStatus = await SiteUp(name ,subDir, confname);
        if (upStatus === false) {
            throw new Error("Site Start Failed");
        }

        res.status(200).json({
            status: true,
            message: "Site Up again Successfully"
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
}



