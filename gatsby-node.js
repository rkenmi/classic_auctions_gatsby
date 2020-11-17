exports.createPages = async ({ actions }) => {
  const itemDB = require('./src/json/item-db.json');

  const createPage = actions.createPage;
  createPage({
    path: `/`,
    component: require.resolve("./src/pages/index.js"),
    context: { items: itemDB },
  });

  createPage({
    path: `/items`,
    component: require.resolve("./src/templates/items.js"),
    context: { items: itemDB },
  });

  itemDB.forEach(item => {
    createPage({
      path: `/item/${item.id}/`,
      component: require.resolve("./src/templates/item.js"),
      context: { item },
    });
  })
};

exports.onCreatePage = ({ page, actions }) => {
  const itemDB = require('./src/json/item-db.json');
  const { createPage, deletePage } = actions
  if (page.path === '/') {
    deletePage(page);
    createPage({
      ...page,
      context: { items: itemDB },
    })
  }
}