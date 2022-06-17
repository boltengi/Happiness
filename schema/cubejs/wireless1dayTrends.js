cube(`wireless1dayTrends`, {
    sql: `
            SELECT
                sensor_id,
                dd.times AS connection_time,
                asset_type,
                asset_name,
                mac,
                power
              FROM(
                    SELECT
                        sensor_id,
                        'ap' AS asset_type,
                        essid AS asset_name,
                        s.bssid AS mac,
                        power,
                        date_trunc('hour',s.end_time) AS connection_time
                      FROM station s, (
                                        SELECT 
                                            bssid, 
                                            MAX(end_time) AS end_time 
                                        FROM station ss
                                        ${FILTER_PARAMS.wireless1dayTrends.sensor_id.filter((sensor_id) =>
                                        ` WHERE ss.sensor_id = ${sensor_id}`)}  
                                        GROUP BY bssid) rcnt
                    ${FILTER_PARAMS.wireless1dayTrends.sensor_id.filter((sensor_id) =>
                    ` WHERE sensor_id = ${sensor_id}`)} 
                        AND s.bssid = rcnt.bssid
                        AND s.end_time = rcnt.end_time
                    ${FILTER_PARAMS.wireless1dayTrends.connection_time.filter((from, to) =>
                        `AND rcnt.end_time::date >= ${from} AND rcnt.end_time::date <= ${to}`
                        )}  
                    UNION ALL
                    SELECT
                        sensor_id,
                        'stationary' AS asset_type,
                        (select MAX(name) from asset where mac = p.bssid ) AS asset_name,
                        p.bssid AS mac,
                        power,
                        date_trunc('hour',p.end_time) AS connection_time
                      FROM probe p, (
                                        SELECT 
                                            bssid, 
                                            MAX(end_time) AS end_time 
                                          FROM probe pp
                                        ${FILTER_PARAMS.wireless1dayTrends.sensor_id.filter((sensor_id) =>
                                        ` WHERE pp.sensor_id = ${sensor_id}`)}  
                                         GROUP BY bssid) rcnt
                    ${FILTER_PARAMS.wireless1dayTrends.sensor_id.filter((sensor_id) =>
                    ` WHERE sensor_id = ${sensor_id}`)} 
                       AND p.bssid = rcnt.bssid
                       AND p.end_time = rcnt.end_time
                    ${FILTER_PARAMS.wireless1dayTrends.connection_time.filter((from, to) =>
                    `  AND rcnt.end_time::date >= ${from} AND rcnt.end_time::date <= ${to}`
                    )}  
                    UNION ALL
                    SELECT
                        sensor_id,
                        'bluetooth' AS asset_type,
                        name AS asset_name,
                        b.address AS mac,
                        rssi AS power,
                        date_trunc('hour',b.timestamp::timestamp) AS connection_time
                      FROM bluetooth b,  (
                                            SELECT 
                                                address, 
                                                MAX(timestamp) AS end_time 
                                            FROM bluetooth bb
                                            ${FILTER_PARAMS.wireless1dayTrends.sensor_id.filter((sensor_id) =>
                                            ` WHERE bb.sensor_id = ${sensor_id}`)}  
                                            GROUP BY address) rcnt
                    ${FILTER_PARAMS.wireless1dayTrends.sensor_id.filter((sensor_id) =>
                    ` WHERE sensor_id = ${sensor_id}`)} 
                       AND b.address = rcnt.address
                       AND b.timestamp = rcnt.end_time
                    ${FILTER_PARAMS.wireless1dayTrends.connection_time.filter((from, to) =>
                    `  AND rcnt.end_time::date >= ${from} AND rcnt.end_time::date <= ${to}`
                        )}  
            ) tmp  RIGHT OUTER JOIN (
                ${FILTER_PARAMS.wireless1dayTrends.connection_time.filter((from, to) =>
                `select generate_series(${from}::timestamp, ${to}::timestamp, '1 hour'::interval)::timestamp as times`
                )}
            ) dd
            ON dd.times = tmp.connection_time
        `,
    joins: {

    },

    measures: {

    },

    dimensions: {
        power: {
            type: `number`,
            sql: `power`
        },
        connection_time: {
            sql: `connection_time`,
            type: `time`,
        },
        asset_type: {
            sql: `asset_type`,
            type: `string`
        },
        asset_name: {
            sql: `asset_name`,
            type: `string`
        },
        mac: {
            sql: `mac`,
            type: `string`
        },
        sensor_id: {
            sql: `sensor_id`,
            type: `string`
        }
    },

    refreshKey: {
        sql: `SELECT FLOOR(EXTRACT(EPOCH FROM NOW()) / 10)`
    }
});