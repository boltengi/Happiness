const apAlert = ['Safe', 'Normal', 'Danger'];
var statusStr = ['Disconnected', 'Connected'];
const textMap = new Map(
  [
    ["equal", " = "],
    ["not equal", " != "],
    ["like", " LIKE "],
    ["not like", " NOT LIKE "]
  ]
);

const numberMap = new Map(
  [
    ["equal", " = "],
    ["not equal", " != "],
    [">=", ">="],
    ["<=", "<="]
  ]
);

//Search--------------------------------------------------------------------------------
const probeInfo    = "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'probe' ORDER BY column_name;";
const stationInfo  = "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'station' ORDER BY column_name;";
const discoverInfo = "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'discover' ORDER BY column_name;";
const vulnscanInfo = "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'vulnscan' ORDER BY column_name;";
const deviceInfo   = 'SELECT * FROM grouptable ORDER BY id ASC;';
const sensorInfo   = 'SELECT sensorid,gid,name FROM sensor;';

// const probePage    = 'SELECT to_char(read_time,\'YYYY-MM-DD HH24:MI:SS\') AS read_time, ' +
//                      'to_char(firsttimeseen,\'YYYY-MM-DD HH24:MI:SS\') AS firsttimeseen, ' +
//                      'to_char(lasttimeseen,\'YYYY-MM-DD HH24:MI:SS\') AS lasttimeseen, ' +
//                      'sensorid, (SELECT name FROM sensor where sensorid = probe.sensorid) as sensorname, stationmac, power, packets, bssid, count(idx) OVER() FROM probe ' +
//                      'WHERE read_time BETWEEN to_timestamp($1, \'YYYY-MM-DDHH24:MI:SS\') AND to_timestamp($2, \'YYYY-MM-DDHH24:MI:SS\') ';

const searchCountWeek  = 'select count(*) from searchTable WHERE read_time >= $1::timestamp and read_time < $2::timestamp ';

const probePage    = 'SELECT read_time, ' +
                    'firsttimeseen, ' +
                    'lasttimeseen, ' +
                    'probe.sensorid, coalesce(sensorname.name, \'N/A\') as sensorname, stationmac, power, packets, bssid ' +
                    'FROM probe left outer join (SELECT sensorid, name FROM sensor) sensorname on (sensorname.sensorid = probe.sensorid) ' +
                    'WHERE read_time >= $1::timestamp and read_time < $2::timestamp ';

// const stationPage  = 'SELECT(CASE WHEN privacy like \'WPA2%\' THEN CASE WHEN ' +
//                      'authentication like \'%MGT\' THEN \'' + apAlert[0] + '\' ELSE \'' + apAlert[1] + '\' END ELSE \'' + apAlert[2] + '\' END) AS alert, ' +
//                      'to_char(read_time,\'YYYY-MM-DD HH24:MI:SS\') AS read_time, ' +
//                      'to_char(firsttimeseen,\'YYYY-MM-DD HH24:MI:SS\') AS firsttimeseen, ' +
//                      'to_char(lasttimeseen,\'YYYY-MM-DD HH24:MI:SS\') AS lasttimeseen, ' +
//                      'sensorid, (SELECT name FROM sensor where sensorid = station.sensorid) as sensorname, ' +
//                      'bssid, channel, speed, privacy, cipher, authentication, power, beacons, iv, lanip, idlength, essid, count(idx) OVER() ' +
//                      'FROM station ' +
//                      'WHERE read_time BETWEEN to_timestamp($1, \'YYYY-MM-DDHH24:MI:SS\') AND to_timestamp($2, \'YYYY-MM-DDHH24:MI:SS\') ';

const stationPage  = 'SELECT(CASE WHEN privacy like \'WPA2%\' THEN CASE WHEN ' +
                    'authentication like \'%MGT\' THEN \'' + apAlert[0] + '\' ELSE \'' + apAlert[1] + '\' END ELSE \'' + apAlert[2] + '\' END) AS alert, ' +
                    'read_time, ' +
                    'firsttimeseen, ' +
                    'lasttimeseen, ' +
                    'station.sensorid, coalesce(sensorname.name, \'N/A\') as sensorname, ' +
                    'bssid, channel, speed, privacy, cipher, authentication, power, beacons, iv, lanip, idlength, essid ' +
                    'FROM station left outer join (SELECT sensorid, name FROM sensor) sensorname on (sensorname.sensorid = station.sensorid) ' +
                    'WHERE read_time >= $1::timestamp and read_time < $2::timestamp ';

const discoverPage = 'SELECT read_time, ' +
                     'model, ip, mac, manufacturer, discover.sensorid, coalesce(sensorname.name, \'N/A\') as sensorname ' +
                     'FROM discover left outer join (SELECT sensorid, name FROM sensor) sensorname on (sensorname.sensorid = discover.sensorid) ' +
                     'WHERE read_time >= $1::timestamp and read_time < $2::timestamp ';

// const discoverPage = 'SELECT to_char(read_time,\'YYYY-MM-DD HH24:MI:SS\') AS read_time, ' +
//                      'model, ip, mac, manufacturer, sensorid, (SELECT name FROM sensor where sensorid = discover.sensorid) as sensorname, count(idx) OVER() FROM discover ' +
//                      'WHERE read_time BETWEEN to_timestamp($1, \'YYYY-MM-DDHH24:MI:SS\') AND to_timestamp($2, \'YYYY-MM-DDHH24:MI:SS\') ';

const searchCountVulnscan  = 'SELECT count(scan.idx) FROM (SELECT \'V\' as scantype, * FROM vulnscan union all SELECT \'D\', * FROM diffscan) scan ' +
                             'WHERE scan.read_time >= $1::timestamp and scan.read_time < $2::timestamp ';

const vulnscanPage = 'SELECT read_time, starttime, endtime, '+
                     'scan.sensorid, coalesce(sensorname.name, \'N/A\') as sensorname, ' +
                     'scan.ipaddr, scan.macaddr, ' +
                     'scan.hostname, scan.protocol, scan.portid, scan.servicename, scan.serviceproduct, scan.scriptid, ' +
                     '(CASE WHEN scan.scriptoutput=\'Unknown\' THEN false WHEN scan.scriptoutput is null THEN false ELSE true END) ' +
                     'as scriptoutput, scan.serviceversion, scan.idx, count(scan.idx) OVER() FROM ' +
                     '(SELECT \'V\' as scantype, * FROM vulnscan union all SELECT \'D\', * FROM diffscan) scan ' +
                     'left outer join (SELECT sensorid, name FROM sensor) sensorname on (sensorname.sensorid = scan.sensorid) ' +
                     'WHERE scan.read_time >= $1::timestamp and read_time < $2::timestamp ';

// const vulnscanPage = 'SELECT scan.scantype, to_char(scan.read_time,\'YYYY-MM-DD HH24:MI:SS\') AS read_time, ' +
//                     'to_char(scan.starttime,\'YYYY-MM-DD HH24:MI:SS\') AS starttime, ' +
//                     'to_char(scan.endtime,\'YYYY-MM-DD HH24:MI:SS\') AS endtime, scan.sensorid, (SELECT name FROM sensor where sensorid = scan.sensorid) as sensorname, ' +
//                     'scan.ipaddr, scan.macaddr, ' +
//                     'scan.hostname, scan.protocol, scan.portid, scan.servicename, scan.serviceproduct, scan.scriptid, ' +
//                     '(CASE WHEN scan.scriptoutput=\'Unknown\' THEN false WHEN scan.scriptoutput is null THEN false ELSE true END) ' +
//                     'as scriptoutput, scan.serviceversion, scan.idx, count(scan.idx) OVER() FROM ' +
//                     '(SELECT \'V\' as scantype, * FROM vulnscan union all SELECT \'D\', * FROM diffscan) scan ' +
//                     'WHERE scan.read_time BETWEEN to_timestamp($1, \'YYYY-MM-DDHH24:MI:SS\') AND to_timestamp($2, \'YYYY-MM-DDHH24:MI:SS\') ';

//Management--------------------------------------------------------------------------------
const mgmtSearch         = 'SELECT count(*) FROM grouptable;';
const mgmtInsert         = 'INSERT INTO grouptable values (default, 0, "IotCare");';

const mgmtSensorEdit     = 'UPDATE sensor SET name=$1, uid=$2, type=$4, include=$5, exclude=$6 WHERE _id=$3';

const mgmtSensorInsert   = 'INSERT INTO sensor (sensorId, gid, name, version, status, ' +
                           'uid, regDate, uptime, logCollection, discovery_schedule, wireless_schedule, ' +
                           'vulnerability_scantime, deauthentication, lastUpdate, apply, type, include, exclude, lastconnectedtime ) VALUES ( $1, $2, ' +
                           ' $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19); ';

const mgmtSensorDelete     = 'DELETE FROM sensor WHERE sensorid = any( $1::text[]);';

const mgmtDeviceDelete     = 'DELETE FROM device WHERE sensorid = any( $1::text[]);';

const mgmtGrouptableSensor = 'SELECT * FROM sensor WHERE gid=$1;';

const mgmtGrouptableDelete = 'DELETE FROM grouptable WHERE id=$1;';

const mgmtSensorGidDelete  = 'DELETE FROM sensor WHERE gid=$1;';

//Report--------------------------------------------------------------------------------
const reportIdList          = 'SELECT * FROM reportlist WHERE _id = $1;';

const reportDeviceCount     = 'SELECT count(distinct mac) FROM discover WHERE sensorid =  any( $1::text[]);';

const reportDeviceTypeCount = 'SELECT type, count(type) FROM device WHERE sensorid = any( $1::text[]) group by type ORDER BY count DESC;';

const reportVulnCve     = 'SELECT vuln.dateCnt, sum(vuln.cvecnt) FROM ' +
                          '( SELECT to_char(read_time, \'YYYY-MM-DD\') as dateCnt, ' +
                          'portid, servicename, protocol, serviceproduct, serviceversion, ' +
                          'macaddr, max(cvecnt) as cvecnt FROM vulnscan vuln WHERE read_time ' +
                          'BETWEEN to_timestamp($1, \'YYYY-MM-DD\') AND to_timestamp($2, \'YYYY-MM-DDHH24:MI:SS\') ' +
                          'AND protocol != \'Unknown\' AND cvecnt != 0 AND sensorid = any( $3::text[]) ' +
                          'GROUP BY to_char(read_time, \'YYYY-MM-DD\'), portid, servicename, protocol, ' +
                          'serviceproduct, serviceversion, macaddr) vuln group by vuln.dateCnt ' +
                          'ORDER BY vuln.dateCnt asc;';

const reportVulnService = 'SELECT vuln.portid, vuln.servicename, vuln.protocol, ' +
                          'vuln.serviceproduct, count(vuln.macaddr) as DeviceCount,' +
                          'sum(vuln.cvecnt) as vuln_cnt FROM (SELECT portid, servicename, ' +
                          'protocol, serviceproduct, macaddr, max(cvecnt) as cvecnt FROM vulnscan vuln ' +
                          'WHERE read_time BETWEEN to_timestamp($1, \'YYYY-MM-DD\') ' +
                          'AND to_timestamp($2, \'YYYY-MM-DDHH24:MI:SS\') AND protocol != \'Unknown\' ' +
                          'AND cvecnt != 0 AND sensorid=any( $3::text[]) GROUP BY portid, servicename, ' +
                          'protocol, serviceproduct, macaddr) vuln GROUP BY vuln.portid, vuln.servicename, ' +
                          'vuln.protocol, vuln.serviceproduct ORDER BY vuln_cnt DESC LIMIT 10;';

const reportVulnDevice  = 'SELECT vuln.sensorid, count(vuln.macaddr)  as devicecnt,' +
                          'sum(vuln.cvecnt) as cvecnt ,(SELECT text FROM grouptable WHERE ' +
                          'id in (SELECT gid FROM sensor WHERE sensorid = vuln.sensorid)  ) as group ' +
                          'FROM ( SELECT sensorid, portid, servicename, protocol, serviceproduct,' +
                          'macaddr, max(cvecnt) as cvecnt FROM vulnscan vuln WHERE read_time BETWEEN ' +
                          'to_timestamp($1, \'YYYY-MM-DD\') AND to_timestamp($2, \'YYYY-MM-DDHH24:MI:SS\') ' +
                          'AND protocol != \'Unknown\' AND cvecnt != 0 AND sensorid = any( $3::text[]) ' +
                          'GROUP BY sensorid, portid, servicename, protocol, serviceproduct, macaddr ) vuln ' +
                          'group by sensorid ORDER BY cvecnt DESC LIMIT 10;';

const reportZeroday     = 'SELECT  distinct vuln.macaddr as mac, portid, servicename, ' +
                          'protocol, sensorid, ipaddr ,\'CCTV RTSP Vulnerability\' as zeroday, 62 as zerodayid ' +
                          'FROM vulnscan vuln  ,(SELECT distinct macaddress FROM cctvscan WHERE ' +
                          'read_time BETWEEN to_timestamp($1, \'YYYY-MM-DDHH24:MI:SS\') AND ' +
                          'to_timestamp($2, \'YYYY-MM-DDHH24:MI:SS\') AND macaddress is not null) cctv_cve ' +
                          'WHERE (vuln.macaddr = cctv_cve.macaddress and  servicename = \'rtsp\') and ' +
                          'macaddress in (SELECT distinct macaddress FROM cctvscan WHERE read_time ' +
                          'BETWEEN to_timestamp($1, \'YYYY-MM-DDHH24:MI:SS\') AND ' +
                          'to_timestamp($2, \'YYYY-MM-DDHH24:MI:SS\') and macaddress is not null) ' +
                          'AND vuln.sensorid = any( $3::text[]) union all SELECT distinct macaddr, portid, ' +
                          'servicename, protocol, sensorid, ipaddr,\'AP lighttpd Service Vulnerability\' ' +
                          'as zeroday, 57 as zerodayid FROM vulnscan WHERE read_time BETWEEN to_timestamp($1, \'YYYY-MM-DDHH24:MI:SS\') ' +
                          'AND to_timestamp($2, \'YYYY-MM-DDHH24:MI:SS\') and portid = 80 and servicename = \'http\' ' +
                          'and protocol=\'tcp\'  and serviceversion=\'1.4.20\' and hostname =\'wevo.ralinktech.com\' ' +
                          'and serviceproduct =\'lighttpd\' AND sensorid=any( $3::text[]);';

const reportZerodayInfo = 'SELECT (case vuln.idx  when \'62\' then ' +
                          '\'CCTV RTSP Vulnerability\' when \'57\' then ' +
                          '\'AP lighttpd Service Vulnerability\' else vuln.code end) as zeroday, ' +
                          'vuln.desc, vuln.response FROM vulnerability vuln WHERE codetype =\'ZeroDay\' and idx= any( $1::int[]);';

const reportVisitor     = 'SELECT visitor.date as visitDay, visitor.visitor as totVisitor, ' +
                          'visitor.visitor-visitor.revisitor as newVisitor, visitor.revisitor as reVisitor, ' +
                          'visitor.revisitor*100/visitor.visitor as returnRate, ' +
                          'visitor.wifi*100/visitor.visitor as wifiRate FROM ' +
                          '(SELECT this.read_time as date, count(this.thisMAC) as visitor, ' +
                          'count(last.lastMAC) as revisitor, sum(case when bssid = 1 then 1 else 0 end) as wifi ' +
                          'FROM   (SELECT to_char(read_time, \'YYYY-MM-DD\') as read_time, stationmac as thisMAC, ' +
                          'case when sum(case when bssid != \'not associated\' then 1 else 0 end) > 0 then 1 else 0 end as bssid ' +
                          'FROM probe WHERE read_time BETWEEN to_timestamp($1, \'YYYY-MM-DDHH24:MI:SS\') ' +
                          'AND to_timestamp($2, \'YYYY-MM-DDHH24:MI:SS\') AND ' +
                          'sensorid = any( $3::text[]) group by to_char(read_time, \'YYYY-MM-DD\'), stationmac) as this ' +
                          'LEFT OUTER JOIN (SELECT distinct stationmac as lastMAC FROM probe ' +
                          'WHERE read_time BETWEEN to_timestamp($4, \'YYYY-MM-DDHH24:MI:SS\') ' +
                          'AND to_timestamp($5, \'YYYY-MM-DDHH24:MI:SS\')) as last ON this.thisMAC = last.lastMAC ' +
                          'group by this.read_time) as visitor ORDER BY visitor.date asc;';

const reportVisitorGroup = 'SELECT gt.text,visitor.sensorid, ' +
                           'count(visitor.stationmac) as visitors, ' +
                           'count(visitor.stationmac)/(to_date($2, \'YYYY-MM-DD\')-to_date($1, \'YYYY-MM-DD\')::date+1) as visitorAvg ' +
                           'FROM ( SELECT sensorid, to_char(read_time, \'YYYY-MM-DD\') as read_time,' +
                           'stationmac FROM probe WHERE read_time BETWEEN to_timestamp($1, \'YYYY-MM-DDHH24:MI:SS\') ' +
                           'AND to_timestamp($2, \'YYYY-MM-DDHH24:MI:SS\') AND sensorid =  any( $3::text[]) ' +
                           'group by sensorid, to_char(read_time, \'YYYY-MM-DD\'), stationmac) as visitor ' +
                           'inner join sensor sen on sen.sensorid = visitor.sensorid inner join grouptable gt ' +
                           'on gt.id = sen.gid group by visitor.sensorid, sen.gid, gt.text ORDER BY visitors desc;';

//Device--------------------------------------------------------------------------------
var deviceSelect = 'SELECT status, idx, sensorid, macaddr, ipaddr, manuf, "type",allowed, "desc" ' +
                   'FROM device as dev, (SELECT  distinct mac, (case when max(read_time) >= (now() - interval\'10 Minute\') ' +
                   'then \'' + statusStr[1] + '\' else \'' + statusStr[0] + '\' end ) as status FROM discover  WHERE sensorid = $1 group by mac) as dis ' +
                   'WHERE sensorid = $1 and dev.macaddr = dis.mac ORDER BY  cast(split_part(ipaddr,\'.\',1) as INT), ' +
                   'cast(split_part(ipaddr,\'.\',2) as INT),cast(split_part(ipaddr,\'.\',3) as INT), ' +
                   'cast(split_part(ipaddr,\'.\',4) as INT), macaddr;';
//analysis--------------------------------------------------------------------------------
var analysisInfo = 'SELECT count(CASE when category=\'0\' then 0 END) as zero,' +
                   ' count(CASE when category=\'1\' then 0 END) as cve,' +
                   ' count(CASE when category=\'2\' then 0 END) as conn, ' +
                   ' count(CASE when category=\'3\' then 0 END) as avbl, ' +
                   ' (SELECT idx FROM analysis ORDER BY idx DESC LIMIT 1) ' +
                   ' FROM analysis; ';

const analysisPage   = 'SELECT *, count(idx) OVER() as counts FROM analysis ' +
                       'WHERE title like $1 AND category like $2 AND CAST(status AS TEXT) LIKE $3 AND ' +
                       'event_time BETWEEN to_timestamp($4, \'YYYY-MM-DDHH24:MI:SS\') AND to_timestamp($5, \'YYYY-MM-DDHH24:MI:SS\') ' +
                       'ORDER BY event_time DESC LIMIT $6 OFFSET $7; ';

const analysisMaxnum = 'SELECT max(idx) as maxnum FROM analysis;';

//새로운 device 가 발견 되었을 경우 analysis 테이블 insert ( 알람 )
var analysisDevice = 'INSERT INTO analysis (category,severity,status, action,action_date,event_time,title,type, ' +
                     'sensorid, "desc",detaillog,response, mac) SELECT 3 as category,2 as severity,0 as status,null as action, ' +
                     'null as action_date, to_timestamp(to_char(NOW(),\'YYYY-MM-DD HH24:MI:SS\'), \'YYYY-MM-DD HH24:MI:SS\') ' +
                     'as event_time, \'[\'||sen.name||\'] New device discover.\' as title, 4 as "type", sen.name, ' +
                     '\'Time=\'||max(dis.read_time)||\', IP=\'||max(dis.ip)||\', MAC=\'||dis.mac||\', Manufacturer=\'||max(dis.manufacturer) as desc, ' +
                     'max(dis.idx) as detaillog, \'Please check the device.\' as response, dis.mac FROM discover dis left outer join ' +
                     '(SELECT sensorid, macaddr FROM device) dev on (dev.macaddr = dis.mac and dev.sensorid = dis.sensorid), ' +
                     '(SELECT sensorid, name FROM sensor) as sen ' +
                     'WHERE dis.read_time > now() - $1::interval and dev.macaddr is null AND sen.sensorid = dis.sensorid group by dis.sensorid, dis.mac, sen.name;';

//새로운 device 가 발견 되었을 경우 device 테이블 insert
var deviceInsert = 'INSERT INTO device (sensorid, macaddr, ipaddr, manuf, "type", allowed) ' +
                   'SELECT  dis.sensorid, dis.mac, max(dis.ip) as ip, max(dis.manufacturer) as manuf, ' +
                   '\'Unknown\' as "type", true as allowed FROM discover dis left outer join ' +
                   '(SELECT sensorid, macaddr FROM device) dev on (dev.macaddr = dis.mac and dev.sensorid = dis.sensorid), ' +
                   '(SELECT sensorid FROM sensor) as sen ' +
                   'WHERE dis.read_time > now() - $1::interval and dev.macaddr is  null AND sen.sensorid = dis.sensorid ' +
                   'group by dis.sensorid, dis.mac;';

// 탐지된 device 중 allowed 가 false 인 device analysis 테이블 isnert
var analysisDeviceDeny = 'INSERT INTO analysis (category,severity,status, action,action_date,event_time,title,type, ' +
                         'sensorid, "desc",detaillog,response, mac) SELECT 3 as category,2 as severity,0 as status, ' +
                         'null as action, null as action_date, to_timestamp(to_char(NOW(),\'YYYY-MM-DD HH24:MI:SS\'), ' +
                         '\'YYYY-MM-DD HH24:MI:SS\') as event_time, \'[\'||sen.name||\'] Unauthorized device found.\' as title, ' +
                         '\'4\' as type, sen.name, \'Time=\'||read_time||\', IP=\'||ip||\', MAC=\'||mac||\', Manufacturer=\'||Manufacturer as desc, ' +
                         'idx as detaillog, \'Please check the device.\' as response, mac FROM discover dis, (SELECT sensorid, name FROM sensor) as sen WHERE ' +
                         'read_time > now() - $1::interval and mac in (SELECT macaddr FROM device WHERE allowed = false) AND sen.sensorid = dis.sensorid;';

 // Discover 테이블에 인가된 Device 정보 미수집 analysis 테이블 select
 // var analysisDeviceSelect = 'SELECT  2 as category,2 as severity,0 as status,null as action, ' +
 //                            'null as action_date,  to_timestamp(to_char(NOW(),\'YYYY-MM-DD HH24:MI:SS\'), \'YYYY-MM-DD HH24:MI:SS\')  as event_time, ' +
 //                            '\'[\'||dev.sensorid||\'] Device Disconnected.\' as title,\'5\' as type, dev.sensorid, ' +
 //                            '\'IP=\'||dev.ipaddr||\', MAC=\'||dev.macaddr||\', Manufacturer=\'||dev.manuf||\', ' +
 //                            'Device Type=\'||dev.type as desc, (SELECT max(idx) FROM discover WHERE sensorid = dev.sensorid and ' +
 //                            'mac = dev.macaddr)as detaillog, \'Please check the device.\' as response, dev.macaddr FROM device as dev left outer ' +
 //                            'join  (SELECT distinct sensorid, mac FROM discover WHERE read_time > now() - $1::interval) dis ' +
 //                            'on (dev.macaddr = dis.mac and dev.sensorid = dis.sensorid) WHERE dev.allowed = true and dis.mac is null;';

 var analysisDeviceSelect = 'SELECT  dev.sensorid,  dev.macaddr FROM device as dev left outer ' +
                            'join  (SELECT distinct sensorid, mac FROM discover WHERE read_time > now() - $1::interval) dis ' +
                            'on (dev.macaddr = dis.mac and dev.sensorid = dis.sensorid) WHERE dev.allowed = true and dis.mac is null;';

// var analysisDeviceUpdate = 'UPDATE analysis SET count = ana.count+1 FROM (SELECT idx, count FROM analysis WHERE event_time > (now() - $1::interval) AND ( $2)) as ana ' +
//                            'WHERE analysis.idx = ana.idx;'
var analysisDeviceUpdate = 'UPDATE analysis SET count = ana.count+1, event_time = to_timestamp(to_char(NOW(),\'YYYY-MM-DD HH24:MI:SS\'), \'YYYY-MM-DD HH24:MI:SS\') FROM ' +
                           '(SELECT idx, count FROM analysis WHERE event_time > (now() - interval \'15 minute\') ' +
                           'AND mac = any( $1::text[])) as ana WHERE category=\'2\' AND analysis.idx = ana.idx; ';

// Discover 테이블에 인가된 Device 정보 미수집 analysis 테이블 insert
var analysisDeviceInsert = 'INSERT INTO analysis (category,severity,status, action,action_date,event_time,title,type, ' +
                         'sensorid, "desc",detaillog,response, mac, count) SELECT  2 as category,2 as severity,0 as status,null as action, ' +
                         'null as action_date,  to_timestamp(to_char(NOW(),\'YYYY-MM-DD HH24:MI:SS\'), \'YYYY-MM-DD HH24:MI:SS\')  as event_time, ' +
                         '\'[\'||sen.name||\'] Device Disconnected.\' as title,\'5\' as type, sen.name, ' +
                         '\'IP=\'||dev.ipaddr||\', MAC=\'||dev.macaddr||\', Manufacturer=\'||dev.manuf||\', ' +
                         'Device Type=\'||dev.type as desc, (SELECT max(idx) FROM discover WHERE sensorid = dev.sensorid and ' +
                         'mac = dev.macaddr)as detaillog, \'Please check the device.\' as response, dev.macaddr, 1 as count FROM device as dev left outer ' +
                         'join  (SELECT distinct sensorid, mac FROM discover WHERE read_time > now() - $1::interval) dis ' +
                         'on (dev.macaddr = dis.mac and dev.sensorid = dis.sensorid), (SELECT sensorid, name FROM sensor) as sen ' +
                         'WHERE macaddr = any( $2::text[]) AND dev.allowed = true and dis.mac is null AND sen.sensorid = dev.sensorid;';

// Discover 테이블에 인가된 Device 정보 미수집 analysis 테이블 insert
var analysisDeviceAllow = 'INSERT INTO analysis (category,severity,status, action,action_date,event_time,title,type, ' +
                          'sensorid, "desc",detaillog,response, mac, count) SELECT  2 as category,2 as severity,0 as status,null as action, ' +
                          'null as action_date,  to_timestamp(to_char(NOW(),\'YYYY-MM-DD HH24:MI:SS\'), \'YYYY-MM-DD HH24:MI:SS\')  as event_time, ' +
                          '\'[\'||dev.sensorid||\'] Device Disconnected.\' as title,\'5\' as type, dev.sensorid, ' +
                          '\'IP=\'||dev.ipaddr||\', MAC=\'||dev.macaddr||\', Manufacturer=\'||dev.manuf||\', ' +
                          'Device Type=\'||dev.type as desc, (SELECT max(idx) FROM discover WHERE sensorid = dev.sensorid and ' +
                          'mac = dev.macaddr)as detaillog, \'Please check the device.\' as response, dev.macaddr, 1 as count FROM device as dev left outer ' +
                          'join  (SELECT distinct sensorid, mac FROM discover WHERE read_time > now() - $1::interval) dis ' +
                          'on (dev.macaddr = dis.mac and dev.sensorid = dis.sensorid) WHERE dev.allowed = true and dis.mac is null;';

// Vulnerability 발견 시 analysis 테이블 insert
var analysisFuzz = 'INSERT INTO analysis (category,severity,status, action,action_date,event_time,title,type, sensorid, "desc",detaillog,response, mac, count) ' +
                   'SELECT CASE WHEN vuln.codetype=\'ZeroDay\' THEN \'0\' ' +
                   'WHEN vuln.codetype=\'CVE\' THEN \'1\' ' +
                   'WHEN vuln.codetype=\'Disconnected\' THEN \'2\' ' +
                   'WHEN vuln.codetype=\'Discover\' THEN \'3\' ' +
                   'WHEN vuln.codetype=\'OneDay\' THEN \'4\' ' +
                   'ELSE \'2\' ' +
                   'END as category, ' +
                   'vuln.severity as severity, 0 as status, null as action, null as action_date, to_timestamp(to_char(NOW(),\'YYYY-MM-DD HH24:MI:SS\'), \'YYYY-MM-DD HH24:MI:SS\')  as event_time, ' +
                   '\'[\'||sen.name||\'] Vulnerability Found\' as title, ' +
                   '\'3\' as type, sen.name, \'IP=\'||fuzz.ip||\', MAC=\'||fuzz.mac||\', Vulnerability Script=\'||fuzz.cvename as desc, ' +
                   'idx as detaillog, \'Please check the device.\' as response, fuzz.mac, 1 as count ' +
                   'FROM fuzz left outer join ' +
                   '(SELECT distinct sensorid, macaddr FROM device) dev on (fuzz.mac = dev.macaddr and fuzz.sensorid = dev.sensorid), ' +
                   '(SELECT sensorid, name FROM sensor) sen, ' +
                   '(SELECT code, codetype, severity FROM vulnerability) vuln ' +
                   'WHERE fuzz.read_time > now() - $1::interval AND fuzz.cvename IS NOT NULL AND fuzz.request IS NOT NULL AND fuzz.response NOT LIKE \'%Not%\' AND ' +
                   'fuzz.response NOT LIKE \'%Unknown%\' AND ' +
                   'sen.sensorid = fuzz.sensorid AND fuzz.cvename = vuln.code order by event_time desc; ';

//Phicomm K2 Wireless Router Vulnerability
 var analysisPhicomm = 'INSERT INTO analysis (category,severity,status, action,action_date,event_time,title,type,' +
                       'sensorid, "desc",detaillog,response, mac) SELECT 0 as category,0 as severity,0 as status,null as action, ' +
                       'null as action_date, to_timestamp(to_char(NOW(),\'YYYY-MM-DD HH24:MI:SS\'), \'YYYY-MM-DD HH24:MI:SS\') ' +
                       'as event_time, \'Phicomm K2 Wireless Router Vulnerability\' as title, 0 as type, sensorid, ' +
                       '(SELECT "desc" as desc FROM vulnerability WHERE code=\'NORMA-2019-005\'), idx as detaillog, ' +
                       '(SELECT response as response FROM vulnerability WHERE code=\'NORMA-2019-005\'), macaddr FROM vulnscan ' +
                       'WHERE portid=80 and hostname=\'wevo.ralinktech.com\' and serviceproduct=\'lighttpd\' and ' +
                       'serviceversion=\'1.4.20\' and ' +
                       'read_time > now() - $1::interval ORDER BY idx DESC;';

//CCTV RTSP Vulnerability
 var analysisCCTV = 'INSERT INTO analysis (category,severity,status, action,action_date,event_time,title,type, ' +
                    'sensorid, "desc",detaillog,response, mac) SELECT 0 as category,0 as severity,0 as status,null as action, ' +
                    'null as action_date, to_timestamp(to_char(NOW(),\'YYYY-MM-DD HH24:MI:SS\'), \'YYYY-MM-DD HH24:MI:SS\') ' +
                    'as event_time, \'CCTV RTSP Vulnerability\' as title, 1 as type, sensorid, ' +
                    '(SELECT "desc" FROM Vulnerability WHERE code = \'NORMA-2018-002\'), idx as detaillog, ' +
                    '(SELECT response FROM Vulnerability WHERE code = \'NORMA-2018-002\'), macaddress FROM cctvscan WHERE macaddress ' +
                    'is not null and ' +
                    'read_time >  now() - $1::interval ORDER BY idx DESC;';

//ipTIME Wireless Router Vulnerability   -- mac 컬럼이 없음.
 var analysisIPTime = 'INSERT INTO analysis (category,severity,status, action,action_date,event_time,title,type, ' +
                      'sensorid, "desc",detaillog,response) SELECT 0 as category,0 as severity,0 as status, ' +
                      'null as action, null as action_date, ' +
                      'to_timestamp(to_char(NOW(),\'YYYY-MM-DD HH24:MI:SS\'), \'YYYY-MM-DD HH24:MI:SS\') as event_time, ' +
                      '\'ipTIME Wireless Router Vulnerability\' as title,2 as type, sensorid,(SELECT "desc" ' +
                      'FROM vulnerability WHERE code = \'NORMA-2019-012\'),idx as detaillog, (SELECT response ' +
                      'FROM vulnerability WHERE code = \'NORMA-2019-012\') ' +
                      'FROM iptime WHERE read_time >now() - $1::interval ORDER BY idx DESC;';

//ollehKT GiGA WiFi Home Wireless Router Vulnerability   --
 var analysisOllehKT = 'INSERT INTO analysis (category,severity,status, action,action_date,event_time,title,type, ' +
                       'sensorid, "desc",detaillog,response, mac) SELECT 0 as category,0 as severity,0 as status, ' +
                       'null as action, null as action_date, ' +
                       'to_timestamp(to_char(NOW(),\'YYYY-MM-DD HH24:MI:SS\'), \'YYYY-MM-DD HH24:MI:SS\') as event_time, ' +
                       '\'ollehKT GiGA WiFi Home Wireless Router Vulnerability\' as title,6 as type, sensorid,(SELECT "desc" ' +
                       'FROM vulnerability WHERE code = \'NORMA-2019-027\'),idx as detaillog, (SELECT response ' +
                       'FROM vulnerability WHERE code = \'NORMA-2019-027\'), mac ' +
                       'FROM ollehkt WHERE read_time >now() - $1::interval ORDER BY idx DESC;';

//시연용
 var analysisCCTV_Test = 'INSERT INTO analysis (category,severity,status, action,action_date,event_time,title,type, ' +
                         'sensorid, "desc",detaillog,response, mac) SELECT 0 as category,0 as severity,0 as status,null as action, ' +
                         'null as action_date, to_timestamp(to_char(NOW(),\'YYYY-MM-DD HH24:MI:SS\'), \'YYYY-MM-DD HH24:MI:SS\') ' +
                         'as event_time, \'CCTV RTSP Vulnerability\' as title, 1 as type, sensorid, ' +
                         '(SELECT "desc" FROM Vulnerability WHERE code = \'NORMA-2019-12192\'), idx as detaillog, ' +
                         '(SELECT response FROM Vulnerability WHERE code = \'NORMA-2019-12192\'), macaddress FROM cctvscan WHERE macaddress ' +
                         'is not null and ' +
                         'read_time >  now() - $1::interval ORDER BY idx DESC;';

//Sensor Stat--------------------------------------------------------------------------------
var sensorStat         = "UPDATE sensor SET status=0, uptime=0 WHERE lastConnectedTime < (now() - $1::interval);";

//vulnerability--------------------------------------------------------------------------------
var vulnerabilityTotal    = 'SELECT COUNT(idx) FROM vulnerability;';

var vulnerabilityCodetype = 'SELECT COUNT(idx) FROM vulnerability WHERE codetype = $1;';

var vulnCode              = 'SELECT code FROM vulnerability WHERE code = $1;';

var vulnerabilityInsert   = 'INSERT INTO vulnerability (idx, code, codetype, severity, "desc", response, creationdate, pocscript, pocscript_name, binaryFile, binaryFile_name) ' +
                            'VALUES (default, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10);';

var vulnProductInsert     = 'INSERT INTO vulnProduct (idx, code, Type, firmware_version, Menuf) ' +
                            'VALUES (default, $1, $2, $3, $4);';

var vulnerabilityDelete   = 'DELETE FROM vulnerability WHERE code = ANY($1::text[]);';

var vulnProductDelete     = 'DELETE FROM vulnProduct WHERE code = ANY($1::text[]);';

var vulnPageSearch        = 'SELECT *, count(idx) OVER() FROM vulnerability where codetype like $1 AND code like $2 AND "desc" like $3 AND Severity=any($4::integer[]) ORDER BY idx DESC ' +
                            'LIMIT $5 OFFSET $6;';

var vulnProductSearch     = 'SELECT * FROM vulnproduct, (select code, count(idx) OVER()FROM vulnerability where codetype like $1 AND code like $2 AND "desc" like $3 AND Severity=any($4::integer[]) ' +
                            'ORDER BY idx DESC LIMIT $5 OFFSET $6) as vuln ' +
                            'WHERE vulnproduct.code = vuln.code ORDER BY vulnproduct.idx DESC;';

var vulnerabilityUpdate   = 'UPDATE vulnerability SET codetype=$1, severity=$2, "desc"=$3, response=$4, creationdate=$5, pocscript=$6, pocscript_name=$7, binaryFile=$8, binaryFile_name=$9 ' +
                            'WHERE code=$10;';

var vulnerabilitySelect   = 'SELECT pocscript, pocscript_name, binaryfile, binaryfile_name FROM vulnerability WHERE code = ANY($1::text[]);';

var vulnOriginCodeSearch  = 'SELECT origin_code FROM vulncodeset WHERE cve_code = $1';

//FCM--------------------------------------------------------------------------------
var FCManalysisSelect   = 'SELECT count(idx) OVER(), idx, title, response FROM analysis WHERE event_time > now() - $1::interval ORDER BY  idx desc LIMIT 1;';

//users--------------------------------------------------------------------------------
var userSite   = 'SELECT distinct site FROM users';
var userSelect = 'SELECT * FROM users where email = $1';
var userInsert = 'INSERT INTO users (email, password, salt, site) VALUES($1, $2, $3, $4);';

module.exports = {
  SQLSet: {
    probeInfo, stationInfo, discoverInfo, vulnscanInfo, deviceInfo, sensorInfo,
    probePage, stationPage, discoverPage, vulnscanPage, searchCountWeek, searchCountVulnscan,
    reportIdList, reportDeviceCount, reportDeviceTypeCount, reportVulnCve, reportVulnService, reportVulnDevice,
    reportZeroday, reportZerodayInfo, reportVisitor, reportVisitorGroup,
    mgmtSearch, mgmtInsert, mgmtSensorEdit, mgmtSensorInsert, mgmtSensorDelete, mgmtGrouptableSensor,
    mgmtGrouptableDelete, mgmtSensorGidDelete, mgmtDeviceDelete,
    deviceSelect,
    analysisDevice, deviceInsert, analysisDeviceDeny, analysisDeviceAllow, analysisDeviceInsert, analysisDeviceSelect,
    analysisDeviceUpdate, analysisInfo, analysisFuzz,
    analysisPhicomm, analysisCCTV, analysisIPTime, analysisOllehKT, analysisCCTV_Test,
    analysisPage, analysisMaxnum,
    vulnCode, vulnerabilityInsert, vulnerabilityDelete, vulnProductDelete, vulnProductInsert,
    vulnerabilityUpdate, vulnerabilitySelect, vulnerabilityTotal, vulnerabilityCodetype,
    vulnPageSearch, vulnProductSearch, vulnOriginCodeSearch,
    sensorStat, FCManalysisSelect, userSite, userSelect, userInsert
  },

  tableName: async function() {
    var strTable  = arguments[0];
    var strQuery  = arguments[1];

    strQuery = strQuery.replace('searchTable', strTable);
    return strQuery;
  },

  page: async function() {
    if(arguments.length < 4){
      //error
    }
    var perPage   = arguments[0];
    var page      = arguments[1];
    var jsonArray = arguments[2];
    var strTable  = arguments[3];
    var strQuery  = arguments[4];

    //데이터 가공 후 적용 할 변수
    var inputJsonString = '';
    //AND연산 또는 OR 연산 적용 할 변수
    var andToOr;
    //같은 object일때는 or 연산   다른오브젝트 끼리는 and 연산처리
    var cnt = -1;
    for (var i in jsonArray) {
      //keyword 가 여러개 일 경우 OR 연산 처리
      for (var j in jsonArray[i].keyword) {
        if (j == 0){
          andToOr = ' AND (';
        } else {
          andToOr = ' OR ';
        }

        //keyword가 없을 경우 되돌아가기
        if (jsonArray[i].keyword[j] == '') {
          continue;
        }

        //operator 변환
        var operator;
        if (jsonArray[i].datatype == 'text') {
          operator = textMap.get(jsonArray[i].operator);
        } else {
          operator = numberMap.get(jsonArray[i].operator);
        }

        var keyword = jsonArray[i].keyword[j];
        //like문 '%' 처리
        if (operator.indexOf('LIKE') != -1) {
          keyword = '%' + keyword + '%';
        }

        //text 경우 ''  처리
        if (jsonArray[i].datatype == 'text') {
          keyword = "'" + keyword + "'";
        }

        //가공 데이터 inputJsonString변수에 담기.
        inputJsonString += andToOr + strTable +'.'+ jsonArray[i].column + operator + keyword;
      }
      inputJsonString += ')';
    }

    strQuery += inputJsonString;
    strQuery += ' ORDER BY read_time DESC ';
    strQuery += 'LIMIT ' + perPage + ' OFFSET ' + ((page - 1) * perPage);

    return strQuery;
  },

  informationSchema: async function() {
  }
};
