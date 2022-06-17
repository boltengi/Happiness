cube(`station`, {
  sql: `SELECT * FROM public.station`,

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

    privacy: {
      sql: `privacy`,
      type: `string`
    },

    bssid: {
      sql: `bssid`,
      type: `string`
    },

    sensorid: {
      sql: `sensorid`,
      type: `string`
    },

    cipher: {
      sql: `cipher`,
      type: `string`
    },

    channel: {
      sql: `channel`,
      type: `number`
    },

    speed: {
      sql: `speed`,
      type: `number`
    },

    power: {
      sql: `power`,
      type: `number`
    },

    beacons: {
      sql: `beacons`,
      type: `number`
    },

    authentication: {
      sql: `authentication`,
      type: `string`
    },

    lanip: {
      sql: `lanip`,
      type: `string`
    },

    essid: {
      sql: `essid`,
      type: `string`
    },

    readTime: {
      sql: `read_time`,
      type: `time`
    },

    firsttimeseen: {
      sql: `firsttimeseen`,
      type: `time`
    },

    lasttimeseen: {
      sql: `lasttimeseen`,
      type: `time`
    }
  }
});