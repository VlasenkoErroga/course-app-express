const variable = require('../var')
const nodemailer = require('nodemailer');
const { google } = require("googleapis");

async function sendMail(mailOptions) {
  try {

    const oAuth2Client = new google.auth.OAuth2(
        variable.GC_CLIENT_ID,
        variable.GC_SECRET_KEY,
        variable.REDIRECT_URI
    );
    
    oAuth2Client.setCredentials({ refresh_token: variable.GC_REFRESH_TOKEN });
    
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: variable.GC_EMAIL,
        clientId:  variable.GC_CLIENT_ID,
        clientSecret: variable.GC_SECRET_KEY,
        refreshToken: variable.GC_REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const transportHome = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: variable.GC_EMAIL,
          clientId:  variable.GC_CLIENT_ID,
          clientSecret: variable.GC_SECRET_KEY,
          refreshToken: variable.GC_REFRESH_TOKEN,
          accessToken: accessToken,
        },
      });


    const result = await transport.sendMail(mailOptions);
    
    return result;
  } catch (error) {
    return error;
  }
}

module.exports = sendMail