import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import wallet from 'reducers/wallet'

const reducer = combineReducers({
  routing: routerReducer,
  wallet,
})

export default reducer
