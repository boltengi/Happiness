cube(`vulnscan`, {
  sql: `SELECT * FROM public.vulnscan`,

  joins: {
	  Sensorgroup: {
        relationship: `hasMany`,
        sql: `${vulnscan}.sensorid = ${Sensorgroup}.sensorid`
        }
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
      type: `number`,
	    primaryKey: true
    },

    ipaddr: {
      sql: `ipaddr`,
      type: `string`
    },

    macaddr: {
      sql: `macaddr`,
      type: `string`
    },

    sensorid: {
      sql: `sensorid`,
      type: `string`
    },

    hostname: {
      sql: `hostname`,
      type: `string`
    },

    protocol: {
      sql: `protocol`,
      type: `string`
    },

    servicename: {
      sql: `servicename`,
      type: `string`
    },

    portid: {
      sql: `portid`,
      type: `number`
    },

    service: {
      sql: `servicename||':'||portid`,
      type: `string`
    },

    serviceproduct: {
      sql: `serviceproduct`,
      type: `string`
    },

    scriptid: {
      sql: `scriptid`,
      type: `string`
    },

    scriptoutput: {
      sql: `scriptoutput`,
      type: `string`
    },

    serviceversion: {
      sql: `serviceversion`,
      type: `string`
    },

    starttime: {
      sql: `starttime`,
      type: `time`
    },

    endtime: {
      sql: `endtime`,
      type: `time`
    },

    readTime: {
      sql: `read_time`,
      type: `time`
    },

    cvecnt: {
      sql: `cvecnt`,
      type: `number`
    }
  }
});
