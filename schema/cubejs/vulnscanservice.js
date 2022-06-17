cube(`vulnscanservice`, {
        sql: `select servicename ||':'||portid as service, count(portid)as servicecount from vulnscan group by service`,

  joins: {

  },

  measures: {
    count: {
      type: `count`,
      drillMembers: []
    }
  },

  dimensions: {

    service: {
      sql: `service`,
      type: `string`
    },

    servicecount: {
      sql: `servicecount`,
      type: `number`
    }

  }
});
