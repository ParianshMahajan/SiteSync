const axios = require('axios');
const url = process.env.dns_url.replace("<zone-id>", process.env.zone_id);

let headers = {
    'Authorization': `Bearer ${process.env.api_token}`,
    'Content-Type': 'application/json'
}


module.exports.createDns = async function createDns(fname) {    
    let data = {
        'type': "CNAME",
        'name': fname,
        'content': process.env.VMdomain,
        'proxied':true 
    }
    let response = await axios.post(url, data, { headers: headers });
    if (response.status === 200)
        return {
            id: response.data.result.id,
            name: response.data.result.name};
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


module.exports.isRecordExists = async function isRecordExists(fname) {
    const checkUrl = `${url}?name=${fname}.${process.env.domain}`;
    const response = await axios.get(checkUrl, { headers: headers });
    if (response.status === 200) {
        const records = response.data.result;
        if (records && records.length > 0) {
            return true; // Record with the name already exists
        } else {
            return false; // No record with the name exists
        }
    } else {
        console.error("Failed to check DNS records:", response.data.errors);
        throw new Error("Failed to check DNS records");
    }
};