import { combineReducers } from 'redux'
import {
  SET_VISIBILITY_FILTER,
  VisibilityFilters,
  SET_ERROR,
  SET_SEARCH_BAR_REF,
  UPDATE_SEARCH_RESULTS,
  UPDATE_SEARCH_SUGGESTIONS,
  UPDATE_SEARCH_QUERY,
  SET_CURRENT_REALM,
  SET_CURRENT_FACTION,
  LOAD_SPINNER,
  MOBILE_NAV_EXPANDED,
  UPDATE_PAGE_NUM,
  ADD_SORT,
  UPDATE_GRAPH_DATA,
  OPEN_GRAPH_MODAL,
  HIDE_GRAPH_MODAL,
  SET_TIMESPAN,
  UPDATE_ITEM_PAGE_GRAPH_DATA,
  LOAD_GRAPH_SPINNER, SET_PAGE_CONTEXT, SEARCH_STATE, UPDATE_CHEAPEST_BO_ITEM_PAGE, LOAD_PAGE
} from '../actions/actions'
import {REALMS} from '../helpers/constants';
// import { connectRouter } from 'connected-react-router'
const { SHOW_ALL } = VisibilityFilters;

function visibilityReducer(state = SHOW_ALL, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return action.filter;
    case SET_SEARCH_BAR_REF:
      return {
        ...state,
        searchBarRef: action.ref
      };
    default:
      return state
  }
}

function pageReducer(state = {count: 0, realms: REALMS,suggestions: [], items: [], hasSearched: false, query: '', loading: false,
  sort: {}, pageLoading: false, mobileNavExpanded: false, graph: {item: null, prices: [], cheapestItems: [], timespan: 0}}, action)
{
  switch (action.type) {
    case SEARCH_STATE:
      return {
        ...state,
        hasSearched: action.searchState
      };
    case SET_PAGE_CONTEXT:
      return {
        ...state,
        itemPageContext: action.item
      };
    case UPDATE_SEARCH_RESULTS:
      const {items, page, queryMs, count} = action.results;
      return {
        ...state,
        items,
        count,
        page,
        queryMs,
        loading: false,
        hasSearched: true
      };
    case UPDATE_SEARCH_SUGGESTIONS:
      return {
        ...state,
        suggestions: action.suggestions
      };
    case UPDATE_SEARCH_QUERY:
      return {
        ...state,
        query: action.query
      };
    case UPDATE_ITEM_PAGE_GRAPH_DATA:
      return {
        ...state,
        graph: {
          ...state.graph,
          loading: false,
          itemPagePrices: action.data
        },
      };
    case LOAD_PAGE:
      return {
        ...state,
        pageLoading: true
      };
    case UPDATE_CHEAPEST_BO_ITEM_PAGE:
      return {
        ...state,
        pageLoading: false,
        graph: {
          ...state.graph,
          cheapestItems: action.results
        },
      };
    case UPDATE_GRAPH_DATA:
      const prices = action.data;
      return {
        ...state,
        graph: {
          ...state.graph,
          loading: false,
          prices,
        },
      };
    case SET_CURRENT_REALM:
      return {
        ...state,
        currentRealm: action.currentRealm
      };
    case SET_CURRENT_FACTION:
      return {
        ...state,
        currentFaction: action.currentFaction
      };
    case ADD_SORT:
      return {
        ...state,
        sort: {...state.sort,
          field: action.field,
          order: action.order
        }
      };
    case UPDATE_PAGE_NUM:
      return {
        ...state,
        page: action.page
      };
    case LOAD_SPINNER:
      return {
        ...state,
        loading: true,
      };
    case LOAD_GRAPH_SPINNER:
      return {
        ...state,
        graph: {
          ...state.graph,
          itemPagePrices: null,
          loading: true,
        }
      };
    case OPEN_GRAPH_MODAL:
      return {
        ...state,
        graph: {
          ...state.graph,
          loading: true,
          item: action.item,
          timespan: 0
        },
      };
    case HIDE_GRAPH_MODAL:
      return {
        ...state,
        graph: {
          ...state.graph,
          loading: false,
          item: null
        },
      };
    case SET_TIMESPAN:
      return {
        ...state,
        graph: {
          ...state.graph,
          loading: true,
          timespan: action.timespan
        },
      };
    case MOBILE_NAV_EXPANDED:
      return {
        ...state,
        mobileNavExpanded: action.expanded,
      };
    case SET_ERROR:
      return {
        ...state,
        errorTitle: action.title,
        errorMessage: action.message
      };
    default:
      return state
  }
}

const rootReducer = () => combineReducers({
  pageReducer,
  visibilityReducer
});

export default rootReducer;