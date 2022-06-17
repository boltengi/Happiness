cube(`event_threat`, {
  sql: `select distinct sen.gid, ect.* from event_comp_threat as ect, sensor as sen where sen.sensor_id = ect.sensor_id and (category in (3,4,5,6,7))`,

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

    category: {
      sql: `category`,
      type: `number`
    },

    read_time: {
      sql: `read_time`,
      type: `time`
    },

    end_time: {
      sql: `end_time`,
      type: `time`
    },

    action: {
      sql: `action`,
      type: `string`
    },

    sensorId: {
      sql: `sensor_id`,
      type: `string`
    },

    severity: {
      sql: `severity`,
      type: `number`
    },

    asset_mac: {
      sql: `asset_mac`,
      type: `string`
    }
  },
  refreshKey: {
      sql: `SELECT FLOOR(EXTRACT(EPOCH FROM NOW()) / 10)`
  }
});
