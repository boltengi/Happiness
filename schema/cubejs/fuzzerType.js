cube(`fuzzerType`, {
    sql: `SELECT distinct on(fuzz.mac, fuzz.cve_name, fuzz.sensor_id) fuzz.cve_name, fuzz.mac, fuzz.sensor_id, sen.gid
            FROM (
            SELECT * FROM public.fuzz AS fuzz
            WHERE fuzz.response is not null
            AND fuzz.response not like '%Not%'
            AND fuzz.response not like '%Unknown%'
            AND fuzz.response not like '%method%'
            AND fuzz.response not like '%wifi%'
            AND fuzz.mac != 'Unknown'
        ) AS fuzz, sensor AS sen WHERE fuzz.sensor_id = sen.sensor_id
        `,

    joins: {

    },

    measures: {
        count: {
          type: `count`,
          drillMembers: []
        }
    },

    dimensions: {
        gid: {
            sql: `gid`,
            type: `number`
        },

        cve_name:{
            sql: `cve_name`,
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
