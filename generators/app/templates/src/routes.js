import React from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'

import store from './store'

const history = syncHistoryWithStore(browserHistory, store)

import Example from 'components/Example'

if (DEV) {
  window.browserHistory = browserHistory
}

const renderRoutes = rootComponent => (
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={rootComponent}>
        <Route path="/example" component={Example} />
      </Route>
    </Router>
  </Provider>
)

export default renderRoutes
