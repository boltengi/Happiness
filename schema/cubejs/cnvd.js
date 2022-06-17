cube(`cnvd`, {
  sql: `select code.origin_code, cve.read_time from
(select * from vulncodeset) as code,
(select unnest(string_to_array(cveOutput,',' ,'')) as cve_code, read_time from cve) as cve
where code.cve_code = cve.cve_code`,

  joins: {
  },

  measures: {
    count: {
      type: `count`,
      drillMembers: []
    }
  },

  dimensions: {
    origin_code: {
      sql: `origin_code`,
      type: `string`
    },

    cve_code: {
      sql: `cve_code`,
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
