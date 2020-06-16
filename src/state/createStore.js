import { applyMiddleware, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import loggerMiddleware from '../../middleware/logger'
import rootReducer from '../reducers/rootReducer';

export default function configureStore(preloadedState) {
  const middlewares = [thunkMiddleware];

  if (process.env.NODE_ENV !== 'production') {
    middlewares.push(loggerMiddleware);
  }
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhancers = [middlewareEnhancer];
  const composedEnhancers = composeWithDevTools(...enhancers);

  const store = createStore(rootReducer(), preloadedState, composedEnhancers);

  return store
}