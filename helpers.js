const axios = require('axios')

const makeBnetURL = (region) => {
  if (region === 'cn')
    return 'https://gateway.battlenet.com.cn'
  return 'https://' + region + '.api.blizzard.com'
}

const getAuthToken = async (client_id, client_secret) => {
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

module.exports = {
  makeBnetURL,
  getAuthToken,
}