cube(`asset`, {
    sql: `select * from public.asset`,

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

        type: {
            sql: `type`,
            type: `string`
        },

        status: {
            sql: `status`,
            type: `string`
        },

        allowed: {
            sql: `allowed`,
            type: `string`
        },

        sensorId: {
            sql: `sensor_id`,
            type: `string`
        },

        regtime: {
            sql: `to_timestamp(to_char(regtime,'YYYY-MM-DD'), 'YYYY-MM-DD')`,
            type: `time`
        },

        regtype: {
            sql: `regtype`,
            type: `number`
        }
    },

    refreshKey: {
        sql: `SELECT FLOOR(EXTRACT(EPOCH FROM NOW()) / 10)`
    }

});
