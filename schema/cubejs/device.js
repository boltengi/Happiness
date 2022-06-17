cube(`device`, {
  sql: `SELECT * FROM public.device`,

  joins: {

  },

  measures: {
    count: {
      type: `count`,
      drillMembers: [sensorid]
    }
  },

  dimensions: {
    sensorid: {
      sql: `sensorid`,
      type: `string`
    },

    macaddr: {
      sql: `macaddr`,
      type: `string`
    },

    ipaddr: {
      sql: `ipaddr`,
      type: `string`
    },

    manuf: {
      sql: `manuf`,
      type: `string`
    },

    type: {
      sql: `type`,
      type: `string`
    },

    allowed: {
      sql: `allowed`,
      type: `string`
    },

    desc: {
      sql: `desc`,
      type: `string`
    }
  },
  refreshKey: {
      sql: `SELECT FLOOR(EXTRACT(EPOCH FROM NOW()) / 10)`
  }
});
