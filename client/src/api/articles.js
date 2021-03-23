const HOST = process.env.REACT_APP_API_HOST || 'http://localhost'
const PORT = process.env.REACT_APP_API_PORT || 3000

const API_PATH = `${HOST}:${PORT}`

const getArticles = async () => {
  const data = await window.fetch(`${API_PATH}/api/v1/article`)
  const dataJson = await data.json()
  return dataJson
}

const getArticleById = async (id) => {
  const data = await window.fetch(`${API_PATH}/api/v1/article/${id}`)
  const dataJson = await data.json()
  return dataJson && dataJson.length > 0 ? dataJson[0] : null
}

const updateArticle = async (id, data) => {
  return await window.fetch(`${API_PATH}/api/v1/article/${id}`, {
    method: 'PUT',
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  })
}

export {
  getArticles,
  getArticleById,
  updateArticle
}
