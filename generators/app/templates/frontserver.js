switch (process.env.ENV) {
  case 'LOCAL':
    console.log('starting local...')
    require('./frontserver.local.js')
    break
  case 'DEV':
    console.log('starting dev...')
    require('./frontserver.dev.js')
    break
  case 'QA':
    console.log('starting qa...')
    require('./frontserver.qa.js')
    break
  case 'REAL':
    console.log('starting real...')
    require('./frontserver.real.js')
    break
}
