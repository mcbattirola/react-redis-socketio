module.exports = () => {
  const { getArticles, getArticleById, insertArticle, updateArticle } = require('../db/articles')
  const controller = {}

  controller.listArticles = async (req, res) => {
    const articles = await getArticles()
    res.status(200).json(articles)
  }

  controller.addArticle = async (req, res) => {
    try {
      await insertArticle(req.body)
      res.status(200).json({ status: 'ok' })
    } catch (e) {
      res.status(503).json({ error: e })
    }
  }

  controller.updateArticle = async (req, res) => {
    try {
      await updateArticle(req.params.id, req.body)
      res.status(200).json({ status: 'ok' })
    } catch (e) {
      res.status(503).json({ error: e })
    }
  }

  controller.getArticle = async (req, res) => {
    try {
      const article = await getArticleById(req.params.id)
      res.status(200).json(article)
    } catch (e) {
      res.status(500).json({ error: e })
    }
  }

  return controller
}
