import {connect} from 'react-redux';
import {Desktop, Mobile, Tablet} from '../helpers/mediaTypes';
import {
  autocomplete,
  getEmptyLabelString,
  keysPressed,
  pickSuggestion,
  setCurrentFaction,
  setCurrentRealm,
  setError,
  search,
  updateSearchQuery,
  setMobileNavExpanded,
  updatePageNum,
  loadFromURL,
  searchOnSetRealmAndFaction,
  searchOnSetSort,
  convertSortParamsToURLParams, getMarketpriceData, hideGraphModal, setTimespanOnGraph, setSearchState
} from '../actions/actions';
import AHSearchForm from '../components/AuctionHouseSearch';
import RealmDropdown from '../widgets/RealmDropdown';
import AuctionTable from '../widgets/AuctionTable';
import {capitalizeWord, getParamsFromURL, normalizeParam} from '../helpers/searchHelpers';
import {Logo, SPINNER_DOM} from '../helpers/domHelpers';
import {SORT_FIELDS, SORT_ORDERS} from '../helpers/constants';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowDown, faArrowUp} from '@fortawesome/free-solid-svg-icons';
import AuctionPagination from '../widgets/AuctionPagination';
import Layout from '../components/Layout';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
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
    })
  }

  getMobileSortedDropdownTitle() {
    const sort = this.props.sort;
    let fieldName = sort.field ? capitalizeWord(sort.field) : 'Order by';

    let SortIcon;
    if (sort.order === SORT_ORDERS.ASCENDING) {
      SortIcon = <FontAwesomeIcon style={{width: 20}} color={'blue'} icon={faArrowUp}/>
    } else if (sort.order ===SORT_ORDERS.DESCENDING) {
      SortIcon = <FontAwesomeIcon style={{width: 20}} color={'red'} icon={faArrowDown}/>
    } else {
      SortIcon = <span style={{width: 20}}/>;
    }

    return (
      <span>{fieldName} {SortIcon}</span>
    )
  }

  getPageHref(p) {
    const {query, currentFaction, currentRealm, sort} = this.props;
    const q = normalizeParam(query), f = normalizeParam(currentFaction), r = normalizeParam(currentRealm).replace(" ", "");
    const sp = convertSortParamsToURLParams(sort);
    return '/?q=' + q + '&p=' + p + '&realm=' + r + '&faction=' + f + sp;
  };

  renderDesktopView() {
    const realms = this.props.realms || [];
    const {currentRealm, currentFaction, overrideDropdown} = this.props;

    return (
      <Navbar variant="dark" style={{display: 'flex', paddingLeft: 0, paddingRight: 0}}>
        <Navbar.Brand href="/">
          <Logo/>
        </Navbar.Brand>
        <Nav style={{flex: 1, justifyContent: 'flex-end'}}>
          <AHSearchForm
            onSearch={this.props.onSearch}
            options={this.props.suggestions.map(m => ({...m, name: m.itemName}))}
            onInputChange={this.props.onHandleAutoComplete}
            onChange={this.props.onPickSuggestion}
            onKeyDown={this.props.onKeyPressed}
          />
          <RealmDropdown currentRealm={currentRealm}
                         currentFaction={currentFaction}
                         onSelectRealmAndFaction={this.props.setCurrentRealmAndFactionAndSearch}
                         realms={realms}/>
        </Nav>
      </Navbar>
    );
  }

  renderMobileView() {
    const realms = this.props.realms || [];
    const {mobileNavExpanded, currentRealm, currentFaction, overrideDropdown} = this.props;

    return (
      <div style={{display: 'flex', flexDirection: 'column', marginTop: 75}}>
        <Navbar ref={(ref) => {this.navbarRef = ref}} fixed={'top'} style={{display: 'flex'}} bg={'dark'} variant={'dark'} expand={'lg'}
                onToggle={()=> {this.props.setMobileNavExpanded(!mobileNavExpanded)} }
                expanded={this.props.mobileNavExpanded}>
          <Navbar.Brand>
            <Logo/>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse style={{justifyContent: 'center', marginTop: 5}} id="basic-navbar-nav">
            <AHSearchForm
              onSearch={this.props.onSearch}
              options={this.props.suggestions.map(m => ({...m, name: m.itemName}))}
              onInputChange={this.props.onHandleAutoComplete}
              onChange={this.props.onPickSuggestion}
              onKeyDown={(e) => this.props.onKeyPressed(e, false)}
            />
            <div style={{display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'flex-start', marginTop: 15, marginBottom: 5}}>
              <RealmDropdown currentRealm={currentRealm}
                             currentFaction={currentFaction}
                             onSelectRealmAndFaction={this.props.setCurrentRealmAndFactionAndSearch}
                             realms={realms}/>
              <DropdownButton
                style={{display: 'flex', marginLeft: 15}}
                id={'MobileSortDD'}
                variant={'info'}
                title={this.getMobileSortedDropdownTitle()}
              >
                <Dropdown.Header>Order by</Dropdown.Header>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => this.props.searchOnSort(SORT_FIELDS.QUANTITY, SORT_ORDERS.ASCENDING)}>Quantity: Low to High</Dropdown.Item>
                <Dropdown.Item onClick={() => this.props.searchOnSort(SORT_FIELDS.QUANTITY, SORT_ORDERS.DESCENDING)}>Quantity: High to Low</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => this.props.searchOnSort(SORT_FIELDS.BUYOUT, SORT_ORDERS.ASCENDING)}>Buyout: Low to High</Dropdown.Item>
                <Dropdown.Item onClick={() => this.props.searchOnSort(SORT_FIELDS.BID, SORT_ORDERS.ASCENDING)} eventKey="2">Bid: Low to High</Dropdown.Item>
                <Dropdown.Item onClick={() => this.props.searchOnSort(SORT_FIELDS.BUYOUT, SORT_ORDERS.DESCENDING)}>Buyout: High to Low</Dropdown.Item>
                <Dropdown.Item onClick={() => this.props.searchOnSort(SORT_FIELDS.BID, SORT_ORDERS.DESCENDING)}>Bid: High to Low</Dropdown.Item>
              </DropdownButton>
            </div>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }

  clearError = () => {
    this.props.setError(null, null);
  };

  render() {
    const {loading, items, page, count, graph, noLayout, children, location, query, currentRealm, currentFaction} = this.props;

    if (!this.state.loadPage) {
      return SPINNER_DOM;
    }

    const content = children && location.pathname ? children : (
      <Container style={{padding: 0}}>
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
        />
        <AuctionPagination count={count} items={items} loading={loading} page={page} getPageHref={this.getPageHref.bind(this)}/>
      </Container>
    );

    const searchDOM = (
      <Container style={{display: 'flex', flexDirection: 'column'}}>
        <Desktop>{this.renderDesktopView()}</Desktop>
        <Tablet>{this.renderMobileView()}</Tablet>
        <Mobile>{this.renderMobileView()}</Mobile>
        <Modal show={!!this.props.errorMessage} onHide={this.clearError}>
          <Modal.Header closeButton>
            <Modal.Body>{this.props.errorMessage}</Modal.Body>
          </Modal.Header>
        </Modal>
        {content}
      </Container>
    );

    if (noLayout) {
      return searchDOM;
    }

    let subtitle = 'Search', description = null;
    if (currentRealm && currentFaction) {
      subtitle = `Search - ${currentRealm} - ${currentFaction} | ${query}`;
      description = `Search results for ${query}`;
    }

    return (
      <Layout metaInfo={{subtitle, description}} location={this.props.location}>
        {searchDOM}
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
