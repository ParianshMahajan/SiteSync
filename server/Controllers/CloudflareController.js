const axios = require('axios');
const url = process.env.dns_url.replace("<zone-id>", process.env.zone_id);

let headers = {
    'Authorization': `Bearer ${process.env.api_token}`,
    'Content-Type': 'application/json'
}


module.exports.createDns = async function createDns(fname) {    
    let data = {
        'type': "A",
        'name': fname,
        'content': process.env.VMip,
        'proxied':true 
    }
    let response = await axios.post(url, data, { headers: headers });
    if (response.status === 200)
        return response.data.result;
    else
        return false;
}


module.exports.deleteDns = async function deleteDns(id) {
    const deleteUrl = `${url}/${id}`;
    const deleteResponse = await axios.delete(deleteUrl, { headers: headers });
    if (deleteResponse.status === 200) {
        console.log("DNS record deleted successfully.");
        return true;
    } else {
        console.error("Failed to delete DNS record:", deleteResponse.data.errors);
        return false;
    }
}    


