exports.createPages = async ({ actions: { createPage } }) => {
  const itemDB = require('./src/json/item-db.json');

  itemDB.forEach(item => {
    createPage({
      path: `/item/${item.id}/`,
      component: require.resolve("./src/templates/item.js"),
      context: { item },
    })
  })
};