var FCM = require('fcm-node');
var fadmin = require("firebase-admin");
var poolConnection = require('../schema/postgresql/connection_pg');
var mybatisMapper = require('mybatis-mapper');
mybatisMapper.createMapper(['./schema/query/SQLmapper.xml']);

module.exports = {
  //현재 시간
  today: function () {
    var d = new Date()
    return d.getFromFormat('yyyy-MM-dd hh:mm:ss')
  },

  //uptime: secConvert(obj.uptime),
  secConvert: function (sec) {
    var reslut = '';
    var numdays = Math.floor(sec / 86400);
    var numhours = Math.floor((sec % 86400) / 3600);
    var numminutes = Math.floor(((sec % 86400) % 3600) / 60);
    if (numdays > 0) reslut += numdays + "d ";
    if (numhours > 0) reslut += numhours + "h ";
    if (numminutes > 0) reslut += numminutes + "m ";
    return reslut;
  },

  /* 1주일전 */
  weekAgoOfDate: function (days) {
    var d = new Date(days);
    var dayOfMonth = d.getDate();
    d.setDate(dayOfMonth - 6);
    return d.getFromFormat('yyyy-MM-dd');
  },

  weekAgo: function () {
    var d = new Date()
    var dayOfMonth = d.getDate()
    d.setDate(dayOfMonth - 6)
    return d.getFromFormat('yyyy-MM-dd hh:mm:ss')
  },

  /* 1주일후 */
  weekLater: function (days) {
    var d = new Date(days)
    var dayOfMonth = d.getDate()
    d.setDate(dayOfMonth + 7)
    return d.getFromFormat('yyyy-MM-dd')
  },

  /* 30일 전 */
  _30DaysAgo: function (days) {
    var d = new Date(days);
    var dayOfMonth = d.getDate();
    d.setDate(dayOfMonth - 30);
    return d.getFromFormat('yyyy-MM-dd');
  },

  /* 하루전 */
  yesterdayAgo: function (days) {
    var d = new Date(days)
    var dayOfMonth = d.getDate(days)
    d.setDate(dayOfMonth - 1)
    return d.getFromFormat('yyyy-MM-dd')
  },

  /* 하루후 */
  tomorrowAgo: function (days) {
    var d = new Date(days)
    var dayOfMonth = d.getDate(days)
    d.setDate(dayOfMonth + 1)
    return d.getFromFormat('yyyy-MM-dd hh:mm:ss')
  },

  /* x 몇일 전 */
  dayAgo: function ( x) {
    var d = new Date();
    var dayOfMonth = d.getDate()
    d.setDate(dayOfMonth - x);
    return d.getFromFormat('yyyy-MM-dd hh:mm:ss');
  },

  /* x 시간 전 */
  hoursAgo: function (x) {
    var d = new Date();
    d.setHours(d.getHours() - x);
    return d.getFromFormat('yyyy-MM-dd hh:00:00');
  },

  //input : yyyymmddHHMMSS
  //ouuput : yyyy-MM-dd hh:mm:ss
  stringToDate: function(date_str)
  {
      var yyyyMMdd = String(date_str);
      var sYear = yyyyMMdd.substring(0,4);
      var sMonth = yyyyMMdd.substring(4,6);
      var sDate = yyyyMMdd.substring(6,8);

      var sHours = yyyyMMdd.substring(8,10);
      var sMin = yyyyMMdd.substring(10,12);
      var sSec = yyyyMMdd.substring(12,14);

      return new Date(Number(sYear), Number(sMonth)-1, Number(sDate), Number(sHours), Number(sMin), Number(sSec)).getFromFormat('yyyy-MM-dd hh:mm:ss');
  },

  isArray: function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  },

  //숫자
  isNumeric: function (num, opt) {
    // 좌우 trim(공백제거)을 해준다.
    num = String(num).replace(/^\s+|\s+$/g, "");

    if (typeof opt == "undefined" || opt == "1") {
      // 모든 10진수 (부호 선택, 자릿수구분기호 선택, 소수점 선택)
      var regex = /^[+\-]?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+){1}(\.[0-9]+)?$/g;
    } else if (opt == "2") {
      // 부호 미사용, 자릿수구분기호 선택, 소수점 선택
      var regex = /^(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+){1}(\.[0-9]+)?$/g;
    } else if (opt == "3") {
      // 부호 미사용, 자릿수구분기호 미사용, 소수점 선택
      var regex = /^[0-9]+(\.[0-9]+)?$/g;
    } else {
      // only 숫자만(부호 미사용, 자릿수구분기호 미사용, 소수점 미사용)
      var regex = /^[0-9]$/g;
    }

    if (regex.test(num)) {
      num = num.replace(/,/g, "");
      return isNaN(num) ? false : true;
    } else {
      return false;
    }
  },

  isDateTime: function (d) {
    var reg = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]/;
    return reg.test(d)
  },

  //filtering 할 Query 생성
  getFiteringQuery: function (obj, intKeys) {
    var filterArr = obj;
    var mappedQuery = '';
    for (var x = 0; x < filterArr.length; x++) {
      var vFilter = obj[x];
      var keyArr = Object.keys(obj[x]);

      for (var i = 0; i < keyArr.length; i++) {
        var key = keyArr[i];
        //빈값인 경우, '00'으로 대체함
        var value = (vFilter[key] == '0') ? '00' : vFilter[key];
        //html Tags 제거
        //value = this.removeTags(value);

        if (value && value != 'null') {
          mappedQuery += (x == 0 && i == 0) ? " AND ( " : " OR ";
          //00인 경우, Query 생성전 0으로 다시 대체
          value = (value == '00') ? 0 : value;
          mappedQuery += this.changeFormat(key, value, intKeys);
          if (x == filterArr.length - 1 && i == keyArr.length - 1) {
            mappedQuery += ")";
          }
        }
      }
    }

    return mappedQuery;
  },

  // int -  = 검색 /String - LIKE 검색
  changeFormat: function (vkey, value, intKeys) {
    if (vkey == 'vulnerability_type') {
      switch (value) {
        case 0:
          value = 'ZeroDay';
          break;
        case 1:
          value = 'CVE';
          break;
        case 2:
          value = 'OneDay';
          break;
      }
    }
    return (this.contains(intKeys, vkey)) ? vkey + " = '" + value + "' " : vkey + " LIKE '%'||'" + this.removeTags(value) + "'||'%' ";
  },

  //Array 포함 여부
  contains: function (arr, v) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === v) {
        return true;
      }
    }
    return false;
  },

  //오늘날짜
  Today: function () {
    var d = new Date()
    return d.getFromFormat('yyyy-MM-dd hh:mm:ss')
  },

  /* GMT 적용 */
  SetGMT: function (GMT, cest) {
    var splitGmt = GMT.split(':');
    var d = new Date(new Date().toUTCString())

    var dayOfHours = d.getHours();

    if(cest == true){
      d.setHours(dayOfHours + parseInt(splitGmt[0]) + 1);
    } else {
      d.setHours(dayOfHours + parseInt(splitGmt[0]));
    }

    var dayOfMinutes = d.getMinutes();
    d.setMinutes(dayOfMinutes + parseInt(splitGmt[1]));
    return d.toISOString().replace(/T/, ' ').replace(/\..+/, '');
  },

  //YYYY-MM-DDHH:MM:SS
  //Nov 11 2010 12:01:39
  getDateTime: function (day) {
    if (0 < day.indexOf("T") || day[3] == ' ' && day[7] == ' ') {
      var d = new Date(day)
      return d.getFromFormat('yyyy-MM-dd hh:mm:ss')
    } else {
      return day.substr(0, 10) + ' ' + day.substr(10, 8);
    }
  },

  TimeToZero: function (day) {
    return day.substr(0, 10) + ' 00:00:00';
  },

  TimeToLast: function (day) {
    return day.substr(0, 10) + ' 23:59:59';
  },

  TimeTo: function (day) {
    return day.substr(0, 10);
  },
  // Seconds format
  TimeToSetSeconds: function (day, oper) {
    let d = new Date(day);
    d.setSeconds(d.getSeconds() + oper);
    return d;
  },

  msToTime: function (duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
      seconds = parseInt((duration / 1000) % 60),
      minutes = parseInt((duration / (1000 * 60)) % 60),
      hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
  },

  //zero-day 판단하는 로직
  IsZeroDayAttack: function (
    hostname, protocol, portid, service_name,
    service_product, service_version) {
    //취약점 정보: { HostName: phicomm.me, Protocol: tcp, Port:80,
    //              ServiceName: http, Product: lighttpd, Version:1.4.35 }
    if (hostname = 'wevo.ralinktech.com' && protocol == 'tcp' && portid == 80 &&
      service_name == 'http' && service_product == 'lighttpd' &&
      service_version == '1.4.20')
      return true;
    return false;
  },

  fcmDBSelect: async function (userSite) {
    var resultJson = new Object();
    var db = fadmin.database();
    console.log("userSite : ", userSite);
    var ref = db.ref("/Push/" + userSite);
    await ref.once("value", function (snapshot) {
      resultJson = snapshot.val();
      console.log("fcmDBSelect : ", resultJson);
    });
    return JSON.stringify(resultJson);
  },

  fcmDBInsert: function (email, hashPassword, siteName, serverURL) {
    var db = fadmin.database();
    var ref = db.ref("/Account/");
    var ParseEmail = email.replaceAll('.', '_');

    if (serverURL[serverURL.length - 1] != '/') {
      serverURL = serverURL + '/';
    }
    var usersRef = ref.child("/" + siteName + "/" + ParseEmail);
    //set :  전체 등록
    //update : 동일한값 지워버림
    usersRef.update({
      PW: hashPassword,
      URL: serverURL
    });
    return true;
  },

  fcmSendMessage: function (title, response, count, fcmTo) {
    var serverKey = require('../privatekey.json') //put the generated private key path here
    var fcm = new FCM(serverKey.serverKey)
    var message = {
      to: fcmTo,

      notification: {
        title: title + ' 외 ' + count + '건',
        body: response
      },

      data: {
        name: 'test name',
        body: 'test body'
      }
    }

    fcm.send(message, function (err, response) {
      if (err) {
        console.log("Something has gone wrong!")
      } else {
        console.log("Successfully sent with response: ", response)
      }
    });
    return true;
  },

  jsonReplace: function (str) {
    var strstr = str.replace('{', '').replace('}', '').replace(/"/gi, "");;
    return strstr;
  },

  isNumeric: function (string) {
    return !isNaN(Number(string));
  },

  //remove html Tags
  removeTags: function (string) {
    if (!this.isNumeric(string)) {
      string = (string) ? string.replace(/(<([^>]+)>)/ig, "") : '';
    }
    return string;
  },

  getSensorIdx: async function (idx, uid, role) {
    var sensor_idx = JSON.stringify(idx);
    var treeList = await this.getTreeList(uid, role);
    var arr = [];
    //최초 로딩시, checked 값이 없는 경우,
    if (!sensor_idx || sensor_idx == 'null' || sensor_idx == '[]') {
      if (treeList.length > 0) {
        for (var i = 0; i < treeList.length; i++) {
          var sensor_id = treeList[i]['sensor_id'];
          if (treeList[i]['type'] == 'file') {
            arr.push(sensor_id);
          }
        }
      }
      //checked 값이 있는 경우, 권한 비교
    } else {
      for (var x = 0; x < treeList.length; x++) {
        var sensor_id = treeList[x]['sensor_id'];
        //req.body.sensor_id 값이 하나인 경우,
        if (typeof (idx) == 'string') {
          if (treeList[x]['type'] == "file" && sensor_id == idx) {
            arr.push(sensor_idx.replace(/"/gi, ""));
          }
        } else {
          for (var i = 0; i < idx.length; i++) {
            if (treeList[x]['type'] == "file" && sensor_id == idx[i]) {
              arr.push(sensor_id);
            }
          }
        }
      }
    } // end of if
    return arr;
  },

  sessionCheck: function (session, res) {
    if (!session.email) {
      return res.render('admin/login/login', {
        session: session,
        state: 200,
        layout:false
      });
    }
    return 1
  },

  getStringFromArray: function (arr) {
    var strQuery = ''
    var sensor_idx = (JSON.stringify(arr)).replace('[', '').replace(']', '').replace(/"/gi, "'");
    if (arr.length == 1) {
      strQuery = " AND sensor_id = " + sensor_idx.replace(/"/gi, "");
    } else if (arr.length > 1) {
      strQuery = ' AND sensor_id IN (' + sensor_idx.replace(/"/gi, "'") + ')';
    } else {
      strQuery = '';
    }
    return strQuery;
  },

  getFilter: function (filter, columnList) {
    var filterArr;
    var filterReplace;

    var strQuery = '';
    if (filter != null) {
      if (filter.length > 0)
        for (var i = 0; i < filter.length; i++) {
          filterKey = Object.keys(filter[i]);
          filterValue = Object.values(filter[i]);
          for (var j = 0; j < columnList.length; j++) {
            if (filterKey == columnList[j]) {
              if (i > 0) {
                strQuery += ' or ';
              }

              switch (columnList[j + 1]) {
                case "boolean":
                  if (filterValue[0] == null) {
                    strQuery += filterKey + ' is null ';
                    console.log('columnList boolean strQuery : ', strQuery);
                  } else {
                    strQuery += filterKey + ' = ' + filterValue;
                  }
                  console.log('columnList boolean : ', columnList[j]);
                  break;
                case "integer":
                  strQuery += filterKey + ' = ' + filterValue;
                  console.log('columnList integer : ', columnList[j]);
                  break;
                case "ARRAY":
                  filterValue++;
                  strQuery += filterKey + '['+filterValue+'] = \'1\'';
                  console.log('columnList ARRAY : ', columnList[j]);
                  break;
                default:
                  if(columnList[j] == 'desc'){
                    filterKey = '\"desc\"';
                  }
                  strQuery += filterKey + ' LIKE \'\%' + filterValue + '\%\'';
                  console.log('columnList string : ', columnList[j]);
                  break;
              }
            }
          }
        }
    }
    return strQuery;
  },

  getNotification: async function (email) {
    var notification = '';

    var paramUserSearch = {
      email : email,
      role : 1
    }
    let sqlUserSelect = await mybatisMapper.getStatement('admin', 'userSearch', paramUserSearch);
    let resultUserSelect = await poolConnection(sqlUserSelect);
    for (var obj of resultUserSelect.rows) {
      notification = obj.notification;
    }

    return notification;
  },

  getIpv4: async function (address) {
    var parseRegExp = /:(\d.*)/i;
    var regExpResults = await parseRegExp.exec(address);

    return regExpResults[1];
  },

  /**
   * string compare
   * @param {string} currStr 신규 문자
   * @param {string} compStr 기존 문자
   * @returns {string} currStr , null
   */
  strcmp: function (currStr, compStr) {
    if(currStr == compStr){
      return currStr;
    } else {
      return null;
    }
  },

  getFilterRename: function (filter, filterRename, columnList) {
    var filterArr;
    var filterReplace;

    var strQuery = '';
    if (filter != null) {
      if (filter.length > 0)
        for (var i = 0; i < filter.length; i++) {
          filterKey = Object.keys(filter[i]);
          filterValue = Object.values(filter[i]);
          for (var j = 0; j < columnList.length; j++) {
            if (filterKey == columnList[j]) {
              if (i > 0) {
                strQuery += ' or ';
              }

              switch (columnList[j + 1]) {
                case "boolean":
                  if (filterValue[0] == null) {
                    strQuery += filterKey + ' is null ';
                    console.log('columnList boolean strQuery : ', strQuery);
                  } else {
                    strQuery += filterKey + ' = ' + filterValue;
                  }
                  console.log('columnList boolean : ', columnList[j]);
                  break;
                case "integer":
                  strQuery += filterKey + ' = ' + filterValue;
                  console.log('columnList integer : ', columnList[j]);
                  break;
                default:
                  if(columnList[j] == 'asset_name'){
                    filterKey = filterRename;
                  }
                  strQuery += filterKey + ' LIKE \'\%' + filterValue + '\%\'';
                  console.log('columnList string : ', columnList[j]);
                  break;
              }
            }
          }
        }
    }
    return strQuery;
  },

  getTreeList: async function (uid, role) {
    //기본 그룹 없을 시 생성
    let sqlGroupList = await mybatisMapper.getStatement('admin', 'groupList');
    var resultGroupList = await poolConnection(sqlGroupList);
    if (resultGroupList == null || resultGroupList.rowCount == 0) {
      let sqlGroupInsert = await mybatisMapper.getStatement('admin', 'groupDefaultInsert');
      const resultGroupInsert = await poolConnection(sqlGroupInsert);
    }

    // sensor_group List
    var groupList = new Array();

    //gid 가져오기
    //role 별로 쿼리 분기
    var paramGroupList = {
      user_id: uid,
      role: role
    }
    sqlGroupList = await mybatisMapper.getStatement('admin', 'groupList', paramGroupList);
    resultGroupList = await poolConnection(sqlGroupList);

    var strIdxQuery = '';
    var strGidQuery = '';
    for (var obj of resultGroupList.rows) {
      strIdxQuery += 'or idx = ' + obj.idx + ' ';
      strGidQuery += 'or gid = ' + obj.idx + ' ';
    }

    //그룹 리스트
    var paramTreeGidList = {
      group_id: strIdxQuery
    }
    sqlTreeGidList = await mybatisMapper.getStatement('admin', 'treeGidList', paramTreeGidList);
    const resultTreeGidList = await poolConnection(sqlTreeGidList);
    for (var obj of resultTreeGidList.rows) {
      var sensorGroup = new Object();

      sensorGroup.gid = String(obj.idx);
      if (obj.parent == 0) {
        sensorGroup.parent = '#';
      } else {
        sensorGroup.parent = String(obj.parent);
      }
      sensorGroup.text = obj.group_name;
      sensorGroup.type = 'folder';
      groupList.push(sensorGroup);
    }

    //if(process.env.COMPANY != 'SK') {
      //센서 리스트
      var paramSensorList = {
        group_id: strGidQuery
      }
      let sqlSensorList = await mybatisMapper.getStatement('admin', 'sensorList', paramSensorList);
      const resultSensorList = await poolConnection(sqlSensorList);
      for (var obj of resultSensorList.rows) {
        var sensorGroup = new Object();

        sensorGroup.sid = obj.idx;
        sensorGroup.sensor_id = obj.sensor_id;
        sensorGroup.parent = String(obj.gid);
        sensorGroup.text = obj.sensor_name;
        sensorGroup.type = 'file';
        sensorGroup.status = obj.status;
        sensorGroup.unauthorised_block = obj.unauthorised_block;
        groupList.push(sensorGroup);
      }
    //}
    return groupList;
  },

  //type : 1 = Sensor_id, 2 = Asset_id
  deleteData: async function (type, id) {
    if(type == 0) {
      var sensor_id = id;

      var paramSensorDataDelete = {
        sensor_id: sensor_id
      }
      let sqlSensorDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteAsset', paramSensorDataDelete);
      var resultSensorDataDelete = await poolConnection(sqlSensorDataDelete);

      sqlSensorDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteAssetUrl', paramSensorDataDelete);
      resultSensorDataDelete = await poolConnection(sqlSensorDataDelete);

      sqlSensorDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteBlock', paramSensorDataDelete);
      resultSensorDataDelete = await poolConnection(sqlSensorDataDelete);

      sqlSensorDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteBlue', paramSensorDataDelete);
      resultSensorDataDelete = await poolConnection(sqlSensorDataDelete);

      sqlSensorDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteDiff', paramSensorDataDelete);
      resultSensorDataDelete = await poolConnection(sqlSensorDataDelete);

      sqlSensorDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteDis', paramSensorDataDelete);
      resultSensorDataDelete = await poolConnection(sqlSensorDataDelete);

      sqlSensorDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteEventAsset', paramSensorDataDelete);
      resultSensorDataDelete = await poolConnection(sqlSensorDataDelete);

      sqlSensorDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteEventThreat', paramSensorDataDelete);
      resultSensorDataDelete = await poolConnection(sqlSensorDataDelete);

      sqlSensorDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteEventVuln', paramSensorDataDelete);
      resultSensorDataDelete = await poolConnection(sqlSensorDataDelete);

      sqlSensorDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteCompAsset', paramSensorDataDelete);
      resultSensorDataDelete = await poolConnection(sqlSensorDataDelete);

      sqlSensorDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteCompThreat', paramSensorDataDelete);
      resultSensorDataDelete = await poolConnection(sqlSensorDataDelete);

      sqlSensorDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteCompVuln', paramSensorDataDelete);
      resultSensorDataDelete = await poolConnection(sqlSensorDataDelete);

      sqlSensorDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteFuzz', paramSensorDataDelete);
      resultSensorDataDelete = await poolConnection(sqlSensorDataDelete);

      sqlSensorDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteMal', paramSensorDataDelete);
      resultSensorDataDelete = await poolConnection(sqlSensorDataDelete);

      sqlSensorDataDelete = await mybatisMapper.getStatement('admin', 'dataDeletePro', paramSensorDataDelete);
      resultSensorDataDelete = await poolConnection(sqlSensorDataDelete);

      sqlSensorDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteSta', paramSensorDataDelete);
      resultSensorDataDelete = await poolConnection(sqlSensorDataDelete);

      sqlSensorDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteVuln', paramSensorDataDelete);
      resultSensorDataDelete = await poolConnection(sqlSensorDataDelete);

      return 1;
    } else if(type == 1) {
      var sensor_id = id;

      var paramSensorDataDelete = {
        sensor_id: sensor_id.join("','")
      }
      let sqlSensorDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteAsset', paramSensorDataDelete);
      var resultSensorDataDelete = await poolConnection(sqlSensorDataDelete);

      sqlSensorDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteAssetUrl', paramSensorDataDelete);
      resultSensorDataDelete = await poolConnection(sqlSensorDataDelete);

      sqlSensorDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteBlock', paramSensorDataDelete);
      resultSensorDataDelete = await poolConnection(sqlSensorDataDelete);

      // sqlSensorDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteBlue', paramSensorDataDelete);
      // resultSensorDataDelete = await poolConnection(sqlSensorDataDelete);
      //
      // sqlSensorDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteDiff', paramSensorDataDelete);
      // resultSensorDataDelete = await poolConnection(sqlSensorDataDelete);
      //
      // sqlSensorDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteDis', paramSensorDataDelete);
      // resultSensorDataDelete = await poolConnection(sqlSensorDataDelete);
      //
      // sqlSensorDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteEventAsset', paramSensorDataDelete);
      // resultSensorDataDelete = await poolConnection(sqlSensorDataDelete);
      //
      // sqlSensorDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteEventThreat', paramSensorDataDelete);
      // resultSensorDataDelete = await poolConnection(sqlSensorDataDelete);
      //
      // sqlSensorDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteEventVuln', paramSensorDataDelete);
      // resultSensorDataDelete = await poolConnection(sqlSensorDataDelete);
      //
      // sqlSensorDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteCompAsset', paramSensorDataDelete);
      // resultSensorDataDelete = await poolConnection(sqlSensorDataDelete);
      //
      // sqlSensorDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteCompThreat', paramSensorDataDelete);
      // resultSensorDataDelete = await poolConnection(sqlSensorDataDelete);
      //
      // sqlSensorDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteCompVuln', paramSensorDataDelete);
      // resultSensorDataDelete = await poolConnection(sqlSensorDataDelete);
      //
      // sqlSensorDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteFuzz', paramSensorDataDelete);
      // resultSensorDataDelete = await poolConnection(sqlSensorDataDelete);
      //
      // sqlSensorDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteMal', paramSensorDataDelete);
      // resultSensorDataDelete = await poolConnection(sqlSensorDataDelete);
      //
      // sqlSensorDataDelete = await mybatisMapper.getStatement('admin', 'dataDeletePro', paramSensorDataDelete);
      // resultSensorDataDelete = await poolConnection(sqlSensorDataDelete);
      //
      // sqlSensorDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteSta', paramSensorDataDelete);
      // resultSensorDataDelete = await poolConnection(sqlSensorDataDelete);
      //
      // sqlSensorDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteVuln', paramSensorDataDelete);
      // resultSensorDataDelete = await poolConnection(sqlSensorDataDelete);

      return 1;
    } else if(type == 2) {
      var asset_idx = id;

      var paramAssetDataDelete = {
        asset_idx: asset_idx.join("','")
      }
      let sqlAssetDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteAsset', paramAssetDataDelete);
      var resultAssetDataDelete = await poolConnection(sqlAssetDataDelete);

      sqlAssetDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteBlock', paramAssetDataDelete);
      resultAssetDataDelete = await poolConnection(sqlAssetDataDelete);

      // sqlAssetDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteDiff', paramAssetDataDelete);
      // resultAssetDataDelete = await poolConnection(sqlAssetDataDelete);
      //
      // sqlAssetDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteDis', paramAssetDataDelete);
      // resultAssetDataDelete = await poolConnection(sqlAssetDataDelete);
      //
      // sqlAssetDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteEventAsset', paramAssetDataDelete);
      // resultAssetDataDelete = await poolConnection(sqlAssetDataDelete);
      //
      // sqlAssetDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteEventThreat', paramAssetDataDelete);
      // resultAssetDataDelete = await poolConnection(sqlAssetDataDelete);
      //
      // sqlAssetDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteEventVuln', paramAssetDataDelete);
      // resultAssetDataDelete = await poolConnection(sqlAssetDataDelete);
      //
      // sqlAssetDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteCompAsset', paramAssetDataDelete);
      // resultAssetDataDelete = await poolConnection(sqlAssetDataDelete);
      //
      // sqlAssetDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteCompThreat', paramAssetDataDelete);
      // resultAssetDataDelete = await poolConnection(sqlAssetDataDelete);
      //
      // sqlAssetDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteCompVuln', paramAssetDataDelete);
      // resultAssetDataDelete = await poolConnection(sqlAssetDataDelete);
      //
      // sqlAssetDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteFuzz', paramAssetDataDelete);
      // resultAssetDataDelete = await poolConnection(sqlAssetDataDelete);
      //
      // sqlAssetDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteMal', paramAssetDataDelete);
      // resultAssetDataDelete = await poolConnection(sqlAssetDataDelete);
      //
      // sqlAssetDataDelete = await mybatisMapper.getStatement('admin', 'dataDeleteVuln', paramAssetDataDelete);
      // resultAssetDataDelete = await poolConnection(sqlAssetDataDelete);

      return 1;
    }
    return 0;
  },

};

Date.prototype.getFromFormat = function (format) {
  var yyyy = this.getFullYear().toString();
  format = format.replace(/yyyy/g, yyyy)
  var MM = (this.getMonth() + 1).toString();
  format = format.replace(/MM/g, (MM[1] ? MM : "0" + MM[0]));
  var dd = this.getDate().toString();
  format = format.replace(/dd/g, (dd[1] ? dd : "0" + dd[0]));
  var hh = this.getHours().toString();
  format = format.replace(/hh/g, (hh[1] ? hh : "0" + hh[0]));
  var mm = this.getMinutes().toString();
  format = format.replace(/mm/g, (mm[1] ? mm : "0" + mm[0]));
  var ss = this.getSeconds().toString();
  format = format.replace(/ss/g, (ss[1] ? ss : "0" + ss[0]));
  return format;
};
