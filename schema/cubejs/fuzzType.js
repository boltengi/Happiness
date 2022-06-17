cube(`fuzzType`, {
  sql: `select fuzzType.response, fuzzType.idx, fuzzType.cve_name, read_time from fuzz as fuzzType
        where fuzztype.response is not null
        and fuzztype.response not like \'%Not%\'
        and fuzztype.response not like \'%method%\'
        and fuzztype.response not like \'%wifi%\'
        and fuzztype.response not like \'%Unknown%\'`,

  joins: {
    vulnerability: {
      relationship: `hasMany`,
      sql: `${vulnerability}.code = ${fuzzType}.cve_name `
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
      sql: `${fuzzType}.idx`,
      type: `number`,
      primaryKey: true
    },

    cve_name: {
      sql: `cve_name`,
      type: `string`
    },

    codeType: {
      sql: `${vulnerability}.codetype`,
      type: `string`
    },

    readTime: {
      sql: `${fuzzType}.read_time`,
      type: `time`
    },
  },
  refreshKey: {
      sql: `SELECT FLOOR(EXTRACT(EPOCH FROM NOW()) / 10)`
  }
});
