cube(`apWithStationaryTrends`, {
    sql: `
        SELECT
            ${FILTER_PARAMS.apWithStationaryTrends.sensor_id.filter((sensor_id) =>
            `COALESCE(sensor_id,${sensor_id}) AS sensor_id, `
            )}
            ${FILTER_PARAMS.apWithStationaryTrends.bssid.filter((bssid) =>
            `COALESCE(bssid,${bssid}) AS bssid, `
            )}
            days AS connection_time,
            COALESCE(count(bssid),0) AS connection_count
          FROM (
                SELECT
                    sensor_id,
                    bssid,
                    end_time::date AS end_time
                  FROM station s
                ${FILTER_PARAMS.apWithStationaryTrends.sensor_id.filter((sensor_id) =>
                `WHERE sensor_id = ${sensor_id}`
                )}
                ${FILTER_PARAMS.apWithStationaryTrends.bssid.filter((bssid) =>
                ` AND bssid = ${bssid}`
                )}
                ${FILTER_PARAMS.apWithStationaryTrends.connection_time.filter((from, to) =>
                ` AND end_time >= ${from}::date AND end_time <= ${to}`
                )}
                 GROUP BY sensor_id, bssid, end_time
        ) tmp  RIGHT OUTER JOIN (
            ${FILTER_PARAMS.apWithStationaryTrends.connection_time.filter((from, to) =>
                `select generate_series(${from}::date, ${to}, '1 day'::interval) as days`
            )}
        ) dd
            ON dd.days = tmp.end_time
         GROUP BY sensor_id, days, bssid
        `,
    joins: {

    },

    measures: {

    },

    dimensions: {
        sensor_id: {
            sql: `sensor_id`,
            type: `string`

        },

        bssid: {
            sql: `bssid`,
            type: `string`
        },

        connection_time: {
            sql: `connection_time`,
            type: `time`
        },

        connection_count: {
            sql: `connection_count`,
            type: `number`
        },


    },
    refreshKey: {
        sql: `SELECT FLOOR(EXTRACT(EPOCH FROM NOW()) / 10)`
    }
});
