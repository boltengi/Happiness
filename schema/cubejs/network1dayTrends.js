cube(`network1dayTrends`, {
    sql: `
            SELECT
                distinct
                sensor_id,
                (select distinct essid from station s
                    where s.bssid = ${FILTER_PARAMS.network1dayTrends.bssid.filter((bssid) => `${bssid}`)}
                    and s.sensor_id = ${FILTER_PARAMS.network1dayTrends.sensor_id.filter((sensor_id) => `${sensor_id}`)}
                    limit 1) AS ap_name,
                bssid,
                stationmac AS stationary_mac,
                date_trunc('hour',end_time) AS detection_time
              FROM probe p
             WHERE sensor_id = ${FILTER_PARAMS.network1dayTrends.sensor_id.filter((sensor_id) => `${sensor_id}`)}
               AND bssid IN (
                                    SELECT
                                        DISTINCT bssid
                                      FROM station
                                     WHERE bssid = ${FILTER_PARAMS.network1dayTrends.bssid.filter((bssid) => `${bssid}`)}
                                       AND sensor_id = ${FILTER_PARAMS.network1dayTrends.sensor_id.filter((sensor_id) => `${sensor_id}`)}
                                )
            ${FILTER_PARAMS.network1dayTrends.detection_time.filter((from,to) =>
                `AND end_time::timestamp >= ${from} AND end_time::timestamp <= ${to}`)} 
        `,
    joins: {

    },
    measures: {

    },
    dimensions: {
        detection_time: {
            type: `time`,
            sql: `detection_time`,
            shown: false
        },
        sensor_id: {
            type: `string`,
            sql: `sensor_id`
        },
        ap_name: {
            type: `string`,
            sql: `ap_name`
        },
        stationary_mac: {
            type: `string`,
            sql: `stationary_mac`,
            primaryKey: true,
            shown: true
        },
        bssid: {
            type: `string`,
            sql: `bssid`
        },
    },

    refreshKey: {
        sql: `SELECT FLOOR(EXTRACT(EPOCH FROM NOW()) / 10)`
    }
});
