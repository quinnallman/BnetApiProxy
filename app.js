const axios = require('axios')
const cors = require('cors')
const express = require('express')
const helpers = require('./helpers')

const app = express()
const port = 3000

app.use(cors())

const client = axios.create({
  baseURL: helpers.makeBnetURL(process.env.BNET_REGION),
})

let authResponse = {};
let authExpiry = Date.now()

client.interceptors.request.use(async config => {
  const now = Date.now()

  if (!authResponse.access_token || now > authExpiry) {
    authResponse = await helpers.getAuthToken(process.env.BNET_CLIENT_ID, process.env.BNET_CLIENT_SECRET)
    authExpiry = now + (authResponse.expires_in - 60) * 1000
  }

  config.headers['Authorization'] = "Bearer " + authResponse.access_token
  return config
}, error => {
  return Promise.reject(error)
})

app.get('/achievements', async (_req, res) => {
  return await client.get('/data/wow/achievement/index?namespace=static-us&locale=en_US')
    .then(resp => {
      res.send(resp.data)
      return resp.data
    })
})

app.get('/transmog/sets/:tsid', async (req, res) => {
  return await client.get('/data/wow/item-appearance/set/' + req.params.tsid + '?namespace=static-us&locale=en_US')
    .then(resp => {
      res.send(resp.data)
      return resp.data
    })
})

app.get('/transmog/item/:iid', async (req, res) => {
  return await client.get('/data/wow/item-appearance/' + req.params.iid + '?namespace=static-us&locale=en_US')
    .then(resp => {
      res.send(resp.data)
      return resp.data
    })
})

app.listen(port, () => {
  console.log('MogMePls server listening on port ' + port)
})
