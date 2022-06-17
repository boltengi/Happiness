cube(`fuzz`, {
    sql: `select * from public.fuzz AS fuzz
           where fuzz.response is not null
             and fuzz.response not like \'%Not%\'
             and fuzz.response not like \'%method%\'
             and fuzz.response not like \'%wifi%\'
             and fuzz.response not like \'%Unknown%\'
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
        },
    },

    refreshKey: {
        sql: `SELECT FLOOR(EXTRACT(EPOCH FROM NOW()) / 10)`
    }

});
