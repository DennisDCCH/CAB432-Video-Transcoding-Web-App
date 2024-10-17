require("dotenv").config();
SSM = require("@aws-sdk/client-ssm");

const client = new SSM.SSMClient({ region: "ap-southeast-2" });

async function parameters(name) {
    try {
        response = await client.send(
           new SSM.GetParameterCommand({
              Name: name
           })
        );
  
        return response.Parameter.Value
     } catch (error) {
        throw error
     }
}

module.exports = {
    parameters,
};