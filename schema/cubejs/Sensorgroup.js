cube(`Sensorgroup`, {
  sql: `select sensor.sensorid, grouptable.text from grouptable, sensor where sensor.gid = grouptable.id`,

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
      type: `string`,
	    primaryKey: true
    },

    text: {
      sql: `text`,
      type: `string`
    }
  }
});
