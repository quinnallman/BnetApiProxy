const axios = require('axios')
const cors = require('cors')
const express = require('express')
const makeBnetURL = require('./helpers')

const app = express()
const port = 3000

app.use(cors())

const client = axios.create({
  baseURL: makeBnetURL(process.env.BNET_REGION),
})

let authResponse = {};
let authExpiry = Date.now()

client.interceptors.request.use(async config => {
  const now = Date.now()

  if (!authResponse.access_token || now > authExpiry) {
    authResponse = await getAuthToken()
    authExpiry = now + (authResponse.expires_in - 60) * 1000
  }

  config.headers['Authorization'] = "Bearer " + authResponse.access_token
  return config
}, error => {
  return Promise.reject(error)
})

getAuthToken = async () => {
  const basic_auth = 'Basic ' + Buffer.from(process.env.BNET_CLIENT_ID + ':' + process.env.BNET_CLIENT_SECRET).toString('base64')

  return axios({
    url: 'https://oauth.battle.net/token?grant_type=client_credentials',
    method: 'POST',
    headers: {
      'Authorization': basic_auth,
    },
  })
  .then(resp => resp.data)
}

app.get('/achievements', async (_req, res) => {
  return await client.get('/data/wow/achievement/index?namespace=static-us&locale=en_US')
    .then(resp => {
      res.send(resp.data)
      return resp.data
    })
})

app.listen(port, () => {
  console.log('MogMePls server listening on port ' + port)
})
