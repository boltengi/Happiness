cube(`vulnscangroup`, {
  sql: `select  grouptable.text as groupTable, count(vulnscan.idx) as scanCnt  from sensor, grouptable, vulnscan
where sensor.gid=grouptable.id and sensor.sensorid=vulnscan.sensorid
group by grouptable.text`,

  joins: {

  },

  measures: {
    count: {
      type: `count`,
      drillMembers: []
    }
  },

  dimensions: {

    grouptable: {
      sql: `groupTable`,
      type: `string`
    },

    scancnt: {
      sql: `scanCnt`,
      type: `number`
    }

  }
});
