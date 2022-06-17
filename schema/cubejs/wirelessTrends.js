cube(`wirelessTrends`, {
    sql: `
            SELECT
                ${FILTER_PARAMS.wirelessTrends.sensor_id.filter((sensor_id) =>
                `COALESCE(sensor_id,${sensor_id}) AS sensor_id, `)}
                dd.days AS connection_time,
                CASE WHEN asset_type = 'ap' THEN COALESCE(COUNT(mac),0)  END AS ap_cnt,
                CASE WHEN asset_type = 'wifi' THEN COALESCE(COUNT(mac),0) END AS wifi_cnt,
                CASE WHEN asset_type = 'bluetooth' THEN COALESCE(COUNT(mac),0) END AS bluetooth_cnt
                FROM(
                    SELECT
                        DISTINCT
                        'ap' AS asset_type,
                        sensor_id,
                        bssid AS mac,
                        end_time::date AS end_time
                        FROM station tmp
                        ${FILTER_PARAMS.wirelessTrends.sensor_id.filter((sensor_id) =>
                    ` WHERE sensor_id = ${sensor_id}`)}
                        ${FILTER_PARAMS.wirelessTrends.connection_time.filter((from, to) =>
                        `AND end_time::date >= ${from} AND end_time::date <= ${to}`
                        )}
                UNION ALL
                    SELECT
                        DISTINCT
                        'wifi' AS asset_type,
                        sensor_id,
                        bssid AS mac,
                        end_time::date AS end_time
                        FROM probe tmp
                        ${FILTER_PARAMS.wirelessTrends.sensor_id.filter((sensor_id) =>
                    ` WHERE sensor_id = ${sensor_id}`)}
                        ${FILTER_PARAMS.wirelessTrends.connection_time.filter((from, to) =>
                        `AND end_time::date >= ${from} AND end_time::date <= ${to}`
                        )}
                UNION ALL
                    SELECT
                        DISTINCT
                        'bluetooth' AS asset_type,
                        sensor_id,
                        address AS mac,
                        timestamp::date AS end_time
                        FROM bluetooth tmp
                        ${FILTER_PARAMS.wirelessTrends.sensor_id.filter((sensor_id) =>
                        ` WHERE sensor_id = ${sensor_id}`)}
                        ${FILTER_PARAMS.wirelessTrends.connection_time.filter((from, to) =>
                        `AND timestamp::date >= ${from} AND timestamp::date <= ${to}`
                        )}
                ) tmp
                RIGHT OUTER JOIN (
                    ${FILTER_PARAMS.wirelessTrends.connection_time.filter((from, to) =>
                        `select generate_series(${from}::date, ${to}::date, '1 day'::interval) as days`
                        )}
                ) dd
                ON dd.days = tmp.end_time
            GROUP BY sensor_id, asset_type, days
        `,

    joins: {

    },

    measures: {
        ap_cnt: {
            type: `sum`,
            sql: `COALESCE(ap_cnt,0)`
        },
        wifi_cnt: {
            type: `sum`,
            sql: `COALESCE(wifi_cnt,0)`
        },
        bluetooth_cnt: {
            type: `sum`,
            sql: `COALESCE(bluetooth_cnt,0)`
        }

    },

    dimensions: {

        connection_time: {
            sql: `connection_time`,
            type: `time`,
            primaryKey: true,
            shown: true
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
