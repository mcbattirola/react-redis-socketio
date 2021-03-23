module.exports = app => {
  const controller = require('../controller/articles')()

  app.route('/api/v1/article')
    .get(controller.listArticles)
    .post(controller.addArticle)

  app.route('/api/v1/article/:id')
    .get(controller.getArticle)
    .put(controller.updateArticle)
}
