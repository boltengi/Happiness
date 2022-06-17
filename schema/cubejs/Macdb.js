cube(`macdb`, {
  sql: `SELECT * FROM public.macdb`,

  joins: {

  },

  measures: {
    count: {
      type: `count`,
      drillMembers: []
    }
  },

  dimensions: {
    mac: {
      sql: `mac`,
      type: `string`
    },

    manuf: {
      sql: `manuf`,
      type: `string`
    },

    model: {
      sql: `model`,
      type: `string`
    },

    type: {
      sql: `type`,
      type: `string`
    }
  }
});
