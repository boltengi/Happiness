var crypto = require('crypto');
var nodemailer = require('nodemailer');

//메일 전송시 암호화키
var key = 'crypto : IoTCare.www.norma.co.kr';
const IV_LENGTH = 16;

var subject = 'IoT Care System Email Alarm';
var forgotPassword = 'Password Reset. Please click the URL below to reset your password.';
var userLogin = 'User Login Notification';
var userLogout = 'User Logout Notification';
var userCreate = 'Your account is newly created.';
var userUpdate = 'Your account is updated.';
var userDelete = 'Your account is deleted.';
var userEventAsset = 'userEventAsset';
var userEventVuln = 'userEventVuln';
var userEventThreat = 'userEventThreat';

var defaultHtml = `<body>
            <table width="100%">
            <tr>
              <td style="height: 20px;">
              </td>
            </tr>
            <tr>
              <td style="color: #43425d; font-size: 32px; font-weight: bold; font-family: sans-serif; ">
                IoT Care System Email Alarm
              </td>
            </tr>
            <tr>
              <td style="height: 10px;">
              </td>
            </tr>
            <tr>
              <td style="text-align: center; background: #ececec; font-size: 13px; font-weight: bold; height: 58px; color: #43425d; font-family: sans-serif;">
              Change_Title
              </td>
            </tr>
            <tr>
              <td style="height: 52px; text-align: center; font-family: sans-serif; border-bottom: 1px solid #dedede; ">
                <b>Change_Text</b>
              </td>
            </tr>
            <tr>
              <td style="height: 100px;">
              </td>
            </tr>
            </table>
            </body>`;

// Email ID : no-reply@norma.kr
// Password : eiy0*mvGscnL
// SMTP : smtp.hostinger.com
// Port : 465 (SSL/TLS)

let transporter = nodemailer.createTransport({
    // service: 'gmail',
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
      user: 'no-reply@norma.kr',
      pass: 'eiy0*mvGscnL',
    },
  });

module.exports = {
  key,
  IV_LENGTH,
  /**
   * @param {string} noti 메일 전송 옵션
   * @param {string} to 받는 메일 주소
   * @param {string} text 메일 내용
   * @returns {integer} 성공 여부
   */
  sendMailCheck: async function(userNoti, routerNoti, to, text) {

    // console.log('to : ', to);
    if(userNoti == null) {
      return 0;
    }
    //forgot password
    if(userNoti == 'forgot') {
      var sendHtml = defaultHtml.replace('Change_Text', text);
      sendHtml = sendHtml.replace('Change_Title', forgotPassword);
      this.sendMail(to, text, sendHtml)
      return 1;
    }
    //Login
    if(userNoti[0] == 1 && routerNoti == 0) {
      var sendHtml = defaultHtml.replace('Change_Text', text);
      sendHtml = sendHtml.replace('Change_Title', userLogin);
      this.sendMail(to, text, sendHtml);
    }
    //Logout
    if(userNoti[1] == 1 && routerNoti == 1) {
      var sendHtml = defaultHtml.replace('Change_Text', text);
      sendHtml = sendHtml.replace('Change_Title', userLogout);
      this.sendMail(to, text, sendHtml);
    }
    //Create user
    if(userNoti[2] == 1 && routerNoti == 2) {
      var sendHtml = defaultHtml.replace('Change_Text', text);
      sendHtml = sendHtml.replace('Change_Title', userCreate);
      this.sendMail(to, text, sendHtml);
    }
    //Update user
    if(userNoti[3] == 1 && routerNoti == 3) {
      var sendHtml = defaultHtml.replace('Change_Text', text);
      sendHtml = sendHtml.replace('Change_Title', userUpdate);
      this.sendMail(to, text, sendHtml);
    }
    //Delete user
    if(userNoti[4] == 1 && routerNoti == 4) {
      var sendHtml = defaultHtml.replace('Change_Text', text);
      sendHtml = sendHtml.replace('Change_Title', userDelete);
      this.sendMail(to, text, sendHtml);
    }
    //Event Asset
    if(userNoti[5] == 1 && routerNoti == 5) {
      var sendHtml = defaultHtml.replace('Change_Text', text);
      sendHtml = sendHtml.replace('Change_Title', userEventAsset);
      this.sendMail(to, text, sendHtml);
    }
    //Event Vuln
    if(userNoti[6] == 1 && routerNoti == 6) {
      var sendHtml = defaultHtml.replace('Change_Text', text);
      sendHtml = sendHtml.replace('Change_Title', userEventVuln);
      this.sendMail(to, text, sendHtml);
    }
    //Event Threat
    if(userNoti[7] == 1 && routerNoti == 7) {
      var sendHtml = defaultHtml.replace('Change_Text', text);
      sendHtml = sendHtml.replace('Change_Title', userEventThreat);
      this.sendMail(to, text, sendHtml);
    }

    return 1;
  },

  sendMail: async function (to, text, html) {
      let info = await transporter.sendMail({
      from: `"IoT Care" no-reply@norma.kr`,
      to: to,
      subject: subject,
      text: text,
      html: html,
    });
  },
};
