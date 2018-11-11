import React from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

import Count from 'components/Count'

const renderRoutes = rootComponent => (
  <Router history={browserHistory}>
    <Route path="/" component={rootComponent}>
      <IndexRoute component={Count} />
    </Route>
  </Router>
)

export default renderRoutes
