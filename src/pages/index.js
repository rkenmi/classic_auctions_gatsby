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
  convertSortParamsToURLParams,
  getMarketpriceData,
  hideGraphModal,
  setTimespanOnGraph,
  setSearchState,
  setPageContextAllItems
} from '../actions/actions';
import {getParamsFromURL, normalizeParam} from '../helpers/searchHelpers';
import {SPINNER_DOM} from '../helpers/domHelpers';
import Layout from '../components/Layout';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Carousel from 'react-bootstrap/Carousel';
import AH_banner1 from '../images/AH-mx.webp';
import AH_banner2 from '../images/AH3-mx.webp';
import AH_banner3 from '../images/AH4-mx.webp';
import AppleStoreLogo from '../images/Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917.svg'
import PlayStoreLogo from '../images/google-play-badge.png'
import {TextBlock} from '../components/TextBlock';
import Image from 'react-bootstrap/Image';
const React = require('react');
let Parser = require('rss-parser');
let parser = new Parser();
const CORS_PROXY = "https://cors-anywhere.herokuapp.com/"

class HomePage extends React.Component{
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
    this.props.setPageContextAllItems(this.props.pageContext.items);
    let self = this;
    parser.parseURL(CORS_PROXY + 'https://classic.wowhead.com/news/rss/classic', function(err, feed) {
      if (err) throw err;
      self.setState({
        feed:
          <TextBlock title={'News'}>
            {feed.items.slice(0, 5).map(item =>
              <TextBlock titleColor={'lightblue'} title={item.title} sm>
                <span dangerouslySetInnerHTML={{__html: item.content}}/>
              </TextBlock>
            )}
          </TextBlock>
      });
    });
    this.setState({
      loadPage: true
    });
  }

  getPageHref(p) {
    const {query, currentFaction, currentRealm, sort} = this.props;
    const q = normalizeParam(query), f = normalizeParam(currentFaction), r = normalizeParam(currentRealm).replace(" ", "");
    const sp = convertSortParamsToURLParams(sort);
    return '/?q=' + q + '&p=' + p + '&realm=' + r + '&faction=' + f + sp;
  };

  clearError = () => {
    this.props.setError(null, null);
  };

  renderHomepageCarousel() {
    return (
      <Carousel interval={10000}>
        <Carousel.Item style={{height: '30vh', zIndex: -1, width: '100%', backgroundSize: 'cover', backgroundImage: `url('${AH_banner1}')`}}>
          <Carousel.Caption>
            <h3>Recent Auctions</h3>
            <h6>Get up-to-date auction house listings by realm and faction on World of Warcraft: Classic.</h6>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item style={{height: '30vh', zIndex: -1, width: '100%', backgroundSize: 'cover', backgroundImage: `url('${AH_banner2}')`}}>
          <Carousel.Caption>
            <h3>Price History</h3>
            <h6>View pricing graphs for recent auction house buyouts.</h6>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item style={{height: '30vh', zIndex: -1, width: '100%', backgroundSize: 'cover', backgroundImage: `url('${AH_banner3}')`}}>
          <Carousel.Caption>
            <h3>Price Alarms</h3>
            <h6>Get push notifications on your phone when an item is above or below a threshold.</h6>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    )
  }

  render() {
    const {query, currentRealm, currentFaction} = this.props;

    if (!this.state.loadPage) {
      return SPINNER_DOM;
    }

    let feedBlock = null;
    if (this.state.feed) {
      feedBlock = this.state.feed;
    }

    let subtitle = 'Home', description = null;
    if (currentRealm && currentFaction) {
      subtitle = `Search - ${currentRealm} - ${currentFaction} | ${query}`;
      description = `WoW Classic Search Engine for recent auction house data`;
    }

    return (
      <Layout metaInfo={{subtitle, description}} location={this.props.location}>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          {this.renderHomepageCarousel()}
          <Modal show={!!this.props.errorMessage} onHide={this.clearError}>
            <Modal.Header closeButton>
              <Modal.Body>{this.props.errorMessage}</Modal.Body>
            </Modal.Header>
          </Modal>
          <Container style={{marginTop: 30, color: '#fff'}}>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <a href='https://play.google.com/store/apps/details?id=com.classic_ah&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'>
                <Image width={240} alt='Get it on Google Play' src={PlayStoreLogo}/>
              </a>
              <a href={'https://apps.apple.com/us/app/classic-ah/id1567718370'}>
                <Image width={180} src={AppleStoreLogo}/>
              </a>
            </div>
            {feedBlock}
          </Container>
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
    setPageContextAllItems: (items) => {
      dispatch(setPageContextAllItems(items));
    },
    loadFromURLParams: (query, page, currentRealm, currentFaction, sortField, sortFieldOrder) => {
      dispatch(loadFromURL(query, page, currentRealm, currentFaction, sortField, sortFieldOrder));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)
