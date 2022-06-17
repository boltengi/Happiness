cube(`discover`, {
  sql: `SELECT * FROM public.discover`,

  joins: {

  },

  measures: {
    count: {
      type: `count`,
      drillMembers: []
    }
  },

  dimensions: {
    idx: {
      sql: `idx`,
      type: `number`
    },

    sensorid: {
      sql: `sensor_id`,
      type: `string`
    },

    model: {
      sql: `model`,
      type: `string`
    },

    ip: {
      sql: `ip`,
      type: `string`
    },

    mac: {
      sql: `mac`,
      type: `string`
    },

    manufacturer: {
      sql: `manufacturer`,
      type: `string`
    },

    readTime: {
      sql: `read_time`,
      type: `time`
    },

    port: {
      sql: `port`,
      type: `number`
    }
  },
  refreshKey: {
      sql: `SELECT FLOOR(EXTRACT(EPOCH FROM NOW()) / 10)`
  }
});
