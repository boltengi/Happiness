cube(`event_asset`, {
  sql: `select distinct sen.gid, eca.* from event_comp_asset as eca, sensor as sen, asset as ass where sen.sensor_id = eca.sensor_id and (eca.sensor_id = ass.sensor_id and eca.asset_mac = ass.mac or category = 2)`,

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

    action: {
        sql: `action`,
        type: `string`
    },

    readTime: {
      sql: `read_time`,
      type: `time`
    },

    end_time: {
      sql: `end_time`,
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
