const { triggerScript } = require("../config/VM_Trigger");
const AdminModel = require("../Models/AdminModel");
const { createDns } = require("./CloudflareController");
const axios = require('axios');


module.exports.accessRepos = async function accessRepos(req, res) {
    try {
        const { code, page = 1, per_page = 30 } = req.body;

        const params = `?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}`;
        const response = await axios.post(`https://github.com/login/oauth/access_token${params}`, null, {
            headers: {
                'Accept': 'application/json'
            }
        });

        let token = response.data.access_token;

        // let admin= await AdminModel.findOne({username:req.user.username});
        let admin= await AdminModel.findOne({username:'CCSisAdmin'});
        admin.gitToken=token;
        await admin.save();


        // Fetch user data
        const tokenData = await axios.get('https://api.github.com/user', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const repos = await axios.get(`https://api.github.com/user/repos?page=${page}&per_page=${per_page}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const repoData = repos.data.map(repo => ({
            name: repo.name,
            full_name: repo.full_name,
            git_url: repo.git_url,
            html_url: repo.html_url,
            description: repo.description,
            private: repo.private
        }));

        res.json({
            message: "Success",
            user: tokenData.data.login,
            repos: repoData,
            page: page,
            per_page: per_page
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: error.message
        });
    }
}


module.exports.deployGitUrl = async function deployGitUrl(req, res) {
    try {

        const { name, git_url, branch} = req.body;
        // const token=await AdminModel.findOne({username:req.user.username}).select('gitToken');
        const token=await AdminModel.findOne({username:'CCSisAdmin'}).select('gitToken');


        let path=`${process.env.CurrPath}Scripts/GitClone.sh`;
        let implementPath=`${process.env.UserPath}${process.env.Hybrid}`;
        let args=` ${implementPath} ${git_url} ${token.gitToken} ${branch}`;


        let scriptResult = await triggerScript(path,args);
        if (scriptResult === false) {
            throw new Error("Script Execution Failed");
        }



        if(req.body.backend.mode){

            const { port , subDir , subDom , envname, env , dockerfile , dockercompose } = req.body.backend;
    
            // Adding dockerfiles and docker-compose files 
            path=`${process.env.CurrPath}Scripts/PortDockerUp.sh`;
            
            implementPath=`${process.env.UserPath}${process.env.Hybrid}${name}/${subDir}`;
            
            args = ` ${implementPath} ${token.gitToken} '${dockerfile.replace(/\n/g, "\\n")}' '${dockercompose.replace(/\n/g, "\\n")}' '${envname}' '${env.replace(/\n/g, "\\n")}'`;

            console.log(path, args);


            scriptResult = await triggerScript(path,args);
            if (scriptResult === false) {
                throw new Error("Script Execution Failed");
            }

            
            // creating dns
            let dnsResult=await createDns(subDom);
            if(dnsResult==false){
              throw new Error('DNS Creation Failed');
            }
            
            
            
            // creating nginx conf
            path=`${process.env.CurrPath}Scripts/NginxConf.sh`;
            args=` ${port} ${dnsResult.name}`;        
            
            scriptResult = await triggerScript(path,args);
            if (scriptResult === false) {
                throw new Error("Script Execution Failed");
            }
            
        }

        if(req.body.frontend.mode){

            const { subDir , subDom  } = req.body.frontend;
            
        }
``
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