cube(`assetTrends`, {
    sql: `
            SELECT
                ${FILTER_PARAMS.assetTrends.idx.filter((asset_id) =>
                `COALESCE(main.idx,${asset_id}) idx,`)}
                dd.days AS detection_time,
                COALESCE(SUM(cnt),0) detection_count
              FROM (
                select idx, end_time, count(*) as cnt from (
                        SELECT
                            ${FILTER_PARAMS.assetTrends.idx.filter((asset_id) =>
                            `COALESCE(a.idx,${asset_id}) idx,`)}
                            end_time::date AS end_time
                        FROM fuzz f, asset a
                        WHERE f.mac = a.mac
                          and response notNULL
                          and response not LIKE '%Not%'
                          and response not LIKE '%Unknown%'
                          and response not LIKE '%method%'
                          and response not LIKE '%wifi%'
                          ${FILTER_PARAMS.assetTrends.idx.filter((asset_id) =>
                            `AND a.idx = ${asset_id}`)}
                        GROUP BY a.idx, end_time
                    )as fa GROUP BY idx, end_time) main
                RIGHT OUTER JOIN (
                        ${FILTER_PARAMS.assetTrends.detection_time.filter((from, to) =>
                            `select generate_series(${from}::date, ${to}::date, '1 day'::interval) as days`
                          )}
                    ) dd
                ON (dd.days = main.end_time)
            GROUP BY dd.days, main.idx
            ORDER BY dd.days
        `,

    joins: {

    },

    measures: {
        detection_count: {
            type: `sum`,
            sql: `detection_count`
        }
    },

    dimensions: {

        detection_time: {
            sql: `detection_time`,
            type: `time`,
            primaryKey: true,
            shown: true
        },

        idx: {
            sql: `idx`,
            type: `number`
        },

    },
    refreshKey: {
        sql: `SELECT FLOOR(EXTRACT(EPOCH FROM NOW()) / 10)`
    }
});
