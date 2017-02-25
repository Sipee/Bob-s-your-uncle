import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk';
import persistState from 'redux-localstorage'
import { Router, Route, Redirect, browserHistory } from 'react-router'
import { routerMiddleware, syncHistoryWithStore, push } from 'react-router-redux'
import { fromJS } from 'immutable'

import MainReducer from './reducers'
import AppContainer from './app/AppContainer'
import HomeContainer from './home/HomeContainer'
import GameContainer from './game/GameContainer'
import WorksheetCreator from './creator/worksheet/WorksheetCreator'
import WorksheetEditor from './editor/worksheet/WorksheetEditor'
import WordEditor from './editor/word/WordEditor'
import AccountContainer from './account/AccountContainer'

import { notifError } from './app/duck'
import { updateUser } from './firebase/duck'

import { getCurrentUser } from './services/firebase'
import { localConfig } from './services/localStorage'
import { registerServiceWorker } from './services/serviceWorker'

registerServiceWorker()

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
    MainReducer,
    composeEnhancers(
        applyMiddleware(
            routerMiddleware(browserHistory),
            thunk
        ),
        persistState(null, localConfig)
    )
)

const history = syncHistoryWithStore(browserHistory, store)

const fetchUser = (nextState, replace) => {
    getCurrentUser()
    .map(u => (u ? {email: u.email, emailVerified: u.emailVerified, role: u.role} : null))
    .subscribe(
        u => store.dispatch(updateUser(fromJS(u)))
    )
}

const isConnected = (nextState, replace) => {
    const  { firebase } = store.getState()
    const u = firebase.get("user")

    if (!u) {
        store.dispatch(notifError("You are not connected"))
        return store.dispatch(push("/account"))
    }

    if (!u.get("emailVerified")) {
        store.dispatch(notifError("Your email has not been verified"))
        return store.dispatch(push("/"))
    }

    if (!u.get("role")) {
        store.dispatch(notifError("You are not accredited by the administrator"))
        return store.dispatch(push("/"))
    }
}

const isNotConnected = (nextState, replace) => {
    const  { firebase } = store.getState()
    const u = firebase.get("user")

    if (u) store.dispatch(push("/"))
}

render(
    <Provider store={store}>
        <Router history={history}>
            <Route component={AppContainer} onEnter={fetchUser}>
                <Route path="/" title="home" initial={true} component={HomeContainer} />
                <Route path="/game/:id" title="game" component={GameContainer} />
                <Route path="/create/worksheet" title="create-worksheet" component={WorksheetCreator} onEnter={isConnected} />
                <Route path="/edit/worksheet/:id" title="edit-worksheet" component={WorksheetEditor} onEnter={isConnected} />
                <Route path="/edit/word/:id" title="edit-word" component={WordEditor} onEnter={isConnected} />
                <Route path="/account" title="account" component={AccountContainer} onEnter={isNotConnected} />
                <Redirect from="*" to="/" />
            </Route>
        </Router>
    </Provider>,
    document.getElementById("root")
)
