cube(`cve`, {
  sql: `select * from CVE`,

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

    cveoutput: {
      sql: `unnest(string_to_array(cveOutput,',' ,''))`,
      type: `string`
    },

    readTime: {
      sql: `read_time`,
      type: `time`
    }
  },
  refreshKey: {
      sql: `SELECT FLOOR(EXTRACT(EPOCH FROM NOW()) / 10)`
  }
});
