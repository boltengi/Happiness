cube(`riskAsset`, {
    sql: `select distinct
                a.type,
                f.mac,
                f.cve_name,
                f.sensor_id,
                s.gid
            from public.fuzz f, public.asset a, public.sensor s
           where a.mac = f.mac
             and f.response is not null
             and f.response not like \'%Not%\'
             and f.response not like \'%Unknown%\'
             and f.response not like '%method%'
             and f.response not like '%wifi%'
             and f.mac != \'Unknown\'
             and f.sensor_id = s.sensor_id`,

    joins: {

    },

    measures: {
        count: {
            type: `count`,
            drillMembers: [cve_name]
        }
    },

    dimensions: {
        gid: {
            sql: `gid`,
            type: `number`
        },
        
        type: {
            sql: `type`,
            type: `string`
        },

        cve_name: {
            sql: `cve_name`,
            type: `string`
        },

        read_time: {
            sql: `read_time`,
            type: `time`
        },

        sensorId: {
            sql: `sensor_id`,
            type: `string`
        }
    },

    refreshKey: {
        sql: `SELECT FLOOR(EXTRACT(EPOCH FROM NOW()) / 10)`
    }

});
