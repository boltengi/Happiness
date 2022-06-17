cube(`discoverTrends`, {
  sql: `
  SELECT
      ${FILTER_PARAMS.discoverTrends.mac.filter((asset_mac) =>
      `COALESCE(main.mac,${asset_mac}) mac,`)}
    dd.days AS end_time,
    COALESCE(SUM(cnt),0) count
    FROM (
      SELECT
      ${FILTER_PARAMS.discoverTrends.mac.filter((asset_mac) =>
      `COALESCE(dis_cnt.mac,${asset_mac}) mac,`)}
      end_time,  sum(count) as cnt from (
      SELECT to_timestamp(to_char(end_time,'YYYY-MM-DD'), 'YYYY-MM-DD') AS end_time, mac, count(*) from (
      SELECT
       to_timestamp(to_char(end_time,'YYYY-MM-DD'), 'YYYY-MM-DD') AS end_time, dis.mac, count(dis.*)
      FROM discover as dis, asset as a
      WHERE dis.mac = a.mac AND dis.sensor_id = a.sensor_id
        ${FILTER_PARAMS.discoverTrends.mac.filter((asset_mac) =>
        `AND a.mac = ${asset_mac}`)}
        ${FILTER_PARAMS.discoverTrends.end_time.filter((from, to) =>
        `AND end_time >= ${from}::date AND end_time <= ${to}::date`
        )}
        GROUP BY dis.mac, end_time
        	ORDER BY end_time DESC
        ) as dis_ass
        GROUP BY mac, end_time ORDER BY end_time DESC
      ) as dis_cnt  GROUP BY mac, end_time

    ) main
    RIGHT OUTER JOIN (
      ${FILTER_PARAMS.discoverTrends.end_time.filter((from, to) =>
      `select generate_series(${from}::date, ${to}::date, '1 day'::interval) as days`
      )}
    ) dd
    ON (dd.days = main.end_time)
    GROUP BY dd.days, main.mac
    ORDER BY dd.days
      `,

  joins: {

  },

  measures: {
    count: {
        type: `sum`,
        sql: `count`
    }
  },

  dimensions: {
    idx: {
      sql: `idx`,
      type: `number`
    },

    sensor_id: {
      sql: `sensor_id`,
      type: `string`
    },

    model: {
      sql: `model`,
      type: `string`
    },

    ip: {
      sql: `ip`,
      type: `string`
    },

    mac: {
      sql: `mac`,
      type: `string`
    },

    manufacturer: {
      sql: `manufacturer`,
      type: `string`
    },

    read_time: {
      sql: `read_time`,
      type: `time`
    },

    end_time: {
      sql: `end_time`,
      type: `time`
    },

    port: {
      sql: `port`,
      type: `number`
    }
  },
  refreshKey: {
      sql: `SELECT FLOOR(EXTRACT(EPOCH FROM NOW()) / 10)`
  }
});
