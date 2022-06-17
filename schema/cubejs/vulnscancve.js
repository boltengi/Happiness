cube(`vulnscancve`, {
        sql: `select sensorid, sum(cvecnt)as cvecnt from vulnscan group by sensorid`,

  joins: {

  },

  measures: {
    count: {
      type: `count`,
      drillMembers: []
    }
  },

  dimensions: {

    sensorid: {
      sql: `sensorid`,
      type: `string`
    },

    cvecnt: {
      sql: `cvecnt`,
      type: `number`
    }

  }
});
