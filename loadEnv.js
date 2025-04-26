const AWS = require('aws-sdk');

const ssm = new AWS.SSM({ region: 'ap-south-1' });

const getParameter = async (Name, WithDecryption = false) => {
  const param = await ssm.getParameter({ Name, WithDecryption }).promise();
  return param.Parameter.Value;
};

const loadEnv = async () => {
  return {
    PORT: await getParameter('/blog/PORT'),
    DB_HOST: await getParameter('/blog/DB_HOST'),
    DB_USER: await getParameter('/blog/DB_USER'),
    DB_PASSWORD: await getParameter('/blog/DB_PASSWORD', true),
    DB_NAME: await getParameter('/blog/DB_NAME'),
    JWT_SECRET: await getParameter('/blog/JWT_SECRET', true),
  };
};


module.exports = loadEnv;
