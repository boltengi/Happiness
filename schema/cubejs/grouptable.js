cube(`Grouptable`, {
  sql: `SELECT * FROM public.grouptable`,

  joins: {

  },

  measures: {
    count: {
      type: `count`,
      drillMembers: [id]
    }
  },

  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primaryKey: true
    },

    text: {
      sql: `text`,
      type: `string`
    }
  }
});
