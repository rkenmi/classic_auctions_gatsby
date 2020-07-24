import {connect} from 'react-redux';
import {
  autocomplete,
  keysPressed,
  pickSuggestion,
  setError,
  search,
  setMobileNavExpanded,
  loadFromURL,
  searchOnSetRealmAndFaction,
  searchOnSetSort,
  convertSortParamsToURLParams, getMarketpriceData, hideGraphModal, setTimespanOnGraph, setSearchState
} from '../actions/actions';
import AuctionTable from '../widgets/AuctionTable';
import {getParamsFromURL, normalizeParam} from '../helpers/searchHelpers';
import {SPINNER_DOM} from '../helpers/domHelpers';
import AuctionPagination from '../components/AuctionPagination';
import Layout from '../components/Layout';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import {Desktop, Mobile, Tablet} from '../helpers/mediaTypes';
const React = require('react');

class AuctionHouse extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loadPage: false
    };
    // Use URL parameters to perform search
    const args = getParamsFromURL(this.props.location.search);
    if (args[0] && args[1] && args[2] && args[3]) {
      this.props.loadFromURLParams(...args);
    }

  }

  componentDidMount() {
    this.setState({
      loadPage: true
    });
  }

  getPageHref(p) {
    const {query, currentFaction, currentRealm, sort} = this.props;
    const q = normalizeParam(query), f = normalizeParam(currentFaction), r = normalizeParam(currentRealm).replace(" ", "");
    const sp = convertSortParamsToURLParams(sort);
    return '/search/?q=' + q + '&p=' + p + '&realm=' + r + '&faction=' + f + sp;
  };

  clearError = () => {
    this.props.setError(null, null);
  };

  renderSearchResultsTitleMobile() {
    const {items, sourceQuery, count, sourceRealm, sourceFaction, page} = this.props;
    if (!items || !sourceQuery) {
      return null;
    }

    const itemCountSoFar = page * 15;
    const itemCountLeft = Math.min(15, items.length);
    const totalCount = count + itemCountSoFar + itemCountLeft;

    const factionColor = sourceFaction === 'Alliance' ? '#add8e6' : '#cd5c5c';

    return (
      <div>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <h5>
            <span>Search results for </span>
            <span style={{color: 'turquoise'}}>{sourceQuery}</span>
          </h5>
        </div>
        <h6>
          <span style={{color: factionColor}}>{sourceRealm} - {sourceFaction}</span>
        </h6>
        <h6>Viewing &nbsp;
          <span style={{color: 'turquoise'}}>
            {itemCountSoFar} - {itemCountSoFar + itemCountLeft}
          </span> &nbsp;
          items out of &nbsp;
          <span style={{color: 'turquoise'}}>
            {totalCount}
          </span> &nbsp;
          results
        </h6>
      </div>
    );
  }

  renderSearchResultsTitleDesktop() {
    const {items, sourceQuery, count, sourceRealm, sourceFaction, page} = this.props;
    if (!items || !sourceQuery) {
      return null;
    }
    const itemCountSoFar = page * 15;
    const itemCountLeft = Math.min(15, items.length);
    const totalCount = count + itemCountSoFar + itemCountLeft;

    const factionColor = sourceFaction === 'Alliance' ? '#add8e6' : '#cd5c5c';

    return (
      <div>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <h4 style={{display: 'inline'}}>
            <span>Search results for </span>
            <span style={{color: 'turquoise'}}>{sourceQuery}</span>
          </h4>
          <h4>
            <span style={{color: factionColor}}>{sourceRealm} - {sourceFaction}</span>
          </h4>
        </div>
        <h6>Viewing &nbsp;
          <span style={{color: 'turquoise'}}>
            {itemCountSoFar} - {itemCountSoFar + itemCountLeft}
          </span> &nbsp;
          items out of &nbsp;
          <span style={{color: 'turquoise'}}>
            {totalCount}
          </span> &nbsp;
          results
        </h6>
      </div>
    );
  }

  getSearchResultsTitle() {
    return (
      <div>
        <Desktop>{this.renderSearchResultsTitleDesktop()}</Desktop>
        <Mobile>{this.renderSearchResultsTitleMobile()}</Mobile>
        <Tablet>{this.renderSearchResultsTitleMobile()}</Tablet>
      </div>
    )
  }

  render() {
    const {loading, items, page, count, graph, query, currentRealm, currentFaction} = this.props;

    if (!this.state.loadPage) {
      return SPINNER_DOM;
    }

    let subtitle = 'Search', description = null;
    if (currentRealm && currentFaction) {
      subtitle = `Search - ${currentRealm} - ${currentFaction} | ${query}`;
      description = `Search results for ${query}`;
    }

    return (
      <Layout title={this.getSearchResultsTitle()} metaInfo={{subtitle, description}} location={this.props.location}>
        <Modal show={!!this.props.errorMessage} onHide={this.clearError}>
          <Modal.Header closeButton>
            <Modal.Body>{this.props.errorMessage}</Modal.Body>
          </Modal.Header>
        </Modal>
        <div>
          <Container>
            <AuctionTable
              loading={loading}
              page={page}
              hasSearched={this.props.hasSearched}
              items={items}
              onSetTimespan={this.props.onSetTimespan}
              graph={graph}
              onClickGraph={this.props.clickGraph}
              onCloseModal={this.props.hideGraph}
              sortFilter={this.props.sort}
              searchOnSort={this.props.searchOnSort}
              currentRealm={currentRealm}
              currentFaction={currentFaction}
            />
          </Container>
          <AuctionPagination count={count} items={items} loading={loading} page={page} getPageHref={this.getPageHref.bind(this)}/>
        </div>
      </Layout>
    )
  }
}

function mapStateToProps(state) {
  return {
    searchBarRef: state.visibilityReducer.searchBarRef,
    loading: state.pageReducer.loading,
    graph: state.pageReducer.graph,
    hasSearched: state.pageReducer.hasSearched,
    queryMs: state.pageReducer.queryMs,
    sort: state.pageReducer.sort,
    page: state.pageReducer.page,
    realms: state.pageReducer.realms,
    items: state.pageReducer.items,
    count: state.pageReducer.count,
    query: state.pageReducer.query,
    sourceQuery: state.pageReducer.sourceQuery,
    sourceRealm: state.pageReducer.sourceRealm,
    sourceFaction: state.pageReducer.sourceFaction,
    suggestions: state.pageReducer.suggestions,
    currentRealm: state.pageReducer.currentRealm,
    currentFaction: state.pageReducer.currentFaction,
    mobileNavExpanded: state.pageReducer.mobileNavExpanded,
    errorTitle: state.pageReducer.errorTitle,
    errorMessage: state.pageReducer.errorMessage
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setCurrentRealmAndFactionAndSearch: (realm, faction) => {
      dispatch(searchOnSetRealmAndFaction(realm, faction));
    },
    searchOnSort: (field, order) => {
      dispatch(searchOnSetSort(field, order, null, true));
    },
    clickGraph: (item, timestamp) => {
      dispatch(getMarketpriceData(item, 0));
    },
    hideGraph: () => {
      dispatch(hideGraphModal());
    },
    onHandleAutoComplete: (evt) => {
      dispatch(setSearchState(false));
      dispatch(autocomplete(evt));
    },
    onPickSuggestion: (evt) => {
      dispatch(pickSuggestion(evt))
    },
    onKeyPressed: (evt, isDesktop=true) => {
      dispatch(keysPressed(evt, isDesktop))
    },
    onSearch: (pageNum, overrideQuery=null) => {
      dispatch(search(pageNum, overrideQuery))
    },
    setMobileNavExpanded: (expanded) => {
      dispatch(setMobileNavExpanded(expanded))
    },
    onSetTimespan: (timespan, item) => {
      dispatch(setTimespanOnGraph(timespan, item));
    },
    setError: (title, message) => {
      dispatch(setError(title, message));
    },
    loadFromURLParams: (query, page, currentRealm, currentFaction, sortField, sortFieldOrder) => {
      dispatch(loadFromURL(query, page, currentRealm, currentFaction, sortField, sortFieldOrder));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuctionHouse)
