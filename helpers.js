const makeBnetURL = (region) => {
  if (region === 'cn')
    return 'https://gateway.battlenet.com.cn'
  return 'https://' + region + '.api.blizzard.com'
}

module.exports = makeBnetURL