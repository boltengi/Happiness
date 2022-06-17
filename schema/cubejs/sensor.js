cube(`sensor`, {
sql: 'SELECT * FROM public.sensor',

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

    status: {
        sql: `status`,
        type: `number`
    },

    sensorId: {
      sql: `sensor_id`,
      type: `string`
    },

    regtime: {
        sql: `to_timestamp(to_char(regtime,'YYYY-MM-DD'), 'YYYY-MM-DD')`,
        type: `time`
    }
  },

  refreshKey: {
      sql: `SELECT FLOOR(EXTRACT(EPOCH FROM NOW()) / 10)`
  }

});
