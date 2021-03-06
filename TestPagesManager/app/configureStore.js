'use strict'

import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger    from 'redux-logger'

import rootReducer     from './reducers'

const loggerMiddleware = createLogger()

// -- create a Redux store, attached to both thunk and logger middlewares
export default function configureStore(initialState) {
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(
      thunkMiddleware,
      loggerMiddleware
    )
  )
}
