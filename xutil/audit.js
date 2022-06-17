var poolConnection = require('../schema/postgresql/connection_pg');
var mybatisMapper = require('mybatis-mapper');
mybatisMapper.createMapper(['./schema/query/SQLmapper.xml']);

var success      = 1
var fail         = 0
// var userModify   = "%s의 %s가 변경 됐습니다."
// var userFailed   = "%s의 %s가 실패 했습니다. 원인 : %s"
// var userModify   = "%s to %s Change."
var userModifyMail   = "Your account with user ID ( %s ) has been updated.<br>Updated contents: %s"
var userModify   = "%s was (were) updated."

var auditSuccess1   = "%s Success"

var auditFail1   = "Login ID not found."
var auditFail2   = "Wrong password."
var auditFail3   = "%s to %s fails. cause : %s"
var auditFail4   = "The email address doesn't exist."
var auditUserEmailSendFail   = "The email address doesn't exist."

var auditUserDelete   = "%s was deleted."
var auditUserCreate   = "%s was created."
var auditUserResetPassword   = "The password has been successfully reset."
var auditUserEmailSend   = "The email alarm has been sent."



//20210514 - 감사로그 insert 추가
//20210524 - 감사로그 스키마 수정
module.exports = {
  userModify,
  userModifyMail,
  success, fail,
  auditSuccess1,
  auditFail1, auditFail2, auditFail3, auditFail4,
  auditUserEmailSendFail,
  auditUserDelete,
  auditUserCreate,
  auditUserResetPassword,
  auditUserEmailSend,

  /**
   * 감사로그 DB Insert
   * @param {string} url (ex /admin/user/login)
   * @param {integer} result
   * @param {string} email
   * @param {string} ip
   * @param {string} note (실패 원인)
   * @returns {integer} 성공 여부
   */
  insertAudit: async function() {
    var d = new Date();
    var today = d.getFromFormat('yyyy-MM-dd hh:mm:ss');

    var url = null;
    var title = null;
    var subtitle = null;
    var action = null;
    var email = null;
    var ip = null;
    var result = null;
    var note = null;

    for(var i = 0; i < arguments.length; i++)
    {
      url = arguments[0].split('/');
      // title = url[1] || null;
      // subtitle = url[2] || null;
      action = url[1] || null;
      result = arguments[1];
      email = arguments[2];
      ip = arguments[3];
      note = arguments[4];
    }

    var paramAudit = {
      today : today,
      title : title,
      subtitle : subtitle,
      action : action,
      email : email,
      ip : ip,
      result : result,
      note : note
    }
    let sqlAudit = await mybatisMapper.getStatement('audit', 'audit_history', paramAudit);
    const resultAudit = await poolConnection(sqlAudit);
    if (resultAudit.rowCount > 0) {
      return 0;
    }
    return 1;
  }
};
