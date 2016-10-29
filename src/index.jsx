import * as React from "react";
import * as ReactDOM from "react-dom";
import {SearchPage} from "./SearchPage";
import {App} from "./AppPage";
import { Router, Link, Route, browserHistory, IndexRoute } from 'react-router';


ReactDOM.render((
<Router history={browserHistory}>
  <Route path="/" component={SearchPage}>
  </Route>
</Router>
), document.getElementById('root'));
