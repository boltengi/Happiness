cube(`probe`, {
  sql: `SELECT * FROM public.probe`,

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
      sql: `sensorid`,
      type: `string`
    },

    stationmac: {
      sql: `stationmac`,
      type: `string`
    },

    bssid: {
      sql: `bssid`,
      type: `string`
    },

    power: {
      sql: `power`,
      type: `number`
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
