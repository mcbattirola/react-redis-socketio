const knex = require('./db')()
const ARTICLES_TABLE = 'articles'

const getArticles = () => {
    return knex.select().table(ARTICLES_TABLE);
}

const getArticleById = id => {
    return knex(ARTICLES_TABLE).where({ id }).select();
}

const insertArticle = ({name, content}) => {
    return knex(ARTICLES_TABLE).insert({name, content})
}

const updateArticle = (id, {name, content}) => {
    return knex(ARTICLES_TABLE).where({ id }).update({name, content})
}

module.exports = {
    getArticles,
    getArticleById,
    insertArticle,
    updateArticle
}