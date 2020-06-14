import {Container, Spinner} from 'react-bootstrap';
import AuctionHouse from '../pages/search';
import {connect} from 'react-redux';
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
  convertSortParamsToURLParams, getMarketpriceData, hideGraphModal, setTimespanOnGraph, getAllMarketpriceData
} from '../actions/actions';
import {SORT_FIELDS, SORT_ORDERS, TIMESPAN_DISPLAY} from '../helpers/constants';
import {AuctionGraph} from '../widgets/graph/AuctionGraph';
import {getColorCode} from '../helpers/searchHelpers';
import {WoWMoney} from '../widgets/WoWMoney';
import {Desktop, Mobile, Tablet} from '../helpers/mediaTypes';
const React = require('react');

const SPINNER_DOM = (
  <Container style={{flex: 1, display: 'flex', marginTop: 35, justifyContent: 'center'}}>
    <Spinner variant='info' animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>
  </Container>
);

class ItemTooltip extends React.Component {
  render() {
    const {item, tooltip} = this.props;

    let hasSubtype;
    if (tooltip.length > 4) {
      hasSubtype = tooltip[4].format === 'alignRight';
    }

    const tooltipDOM = tooltip.map((line, i) => {
      const {format} = line;
      let style={display: 'block'};
      if (line['label'].includes("Dropped")) {
        return null;
      } else if (hasSubtype && (i === 3 || i === 4)) {
        style['display'] = 'inline';
        if (i === 3) {
          return (
            <div style={{'display': 'flex'}} key={`tooltip-${item.id}-${i}`}>
              <span style={{width: '100%', justifyContent: 'flex-start'}}>{tooltip[i].label}</span>
              <span style={{justifyContent: 'flex-end'}}>{tooltip[i+1].label}</span>
            </div>
          )
        } else {
          return null;
        }
      } else if (format === 'indent') {
        style['marginLeft'] = 10;
      } else if (format === 'Uncommon' || format === 'Epic' || format === 'Misc' || format === 'Poor' || format === 'Rare') {
        style['color'] = getColorCode(format);
      } else if (line['label'].includes("Sell Price")) {
        // Sell by
        return <span style={style} key={`tooltip-${item.id}-${i}`}><WoWMoney text={line['label']} money={item.sellPrice}/></span>
      }

      return (
        <span style={style} key={`tooltip-${item.id}-${i}`}>{line['label']}</span>
      )
    });

    return (
      <div style={{width: 300, padding: 10, borderRadius: 6, borderColor: 'rgb(204, 204, 204)', border: 'solid 1px', backgroundColor: '#212529'}}>
        {tooltipDOM}
      </div>
    )
  }
}

class ItemTemplate extends React.Component {
  componentDidMount() {
    const {currentRealm, currentFaction, pageContext: {item}} = this.props;
    if (currentRealm && currentFaction) {
      this.props.searchOnSort(SORT_FIELDS.BUYOUT, SORT_ORDERS.ASCENDING, this.props.pageContext.item.name);
      this.props.loadAllGraphs(item, currentRealm, currentFaction);
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {currentRealm, currentFaction, query, items, pageContext: {item}} = this.props;
    if (prevProps.currentRealm !== currentRealm || prevProps.currentFaction !== currentFaction) {
      this.props.searchOnSort(SORT_FIELDS.BUYOUT, SORT_ORDERS.ASCENDING, this.props.pageContext.item.name);
      this.props.loadAllGraphs(item, currentRealm, currentFaction);
    }
  }

  renderAllGraphs(itemPagePrices, graphItem, isMobile=false) {
    const {currentRealm, currentFaction, graph: {loading}} = this.props;

    if (!currentFaction || !currentRealm) {
      return <div style={{display: 'flex', margin: 30, justifyContent: 'center'}}>Please select a realm and faction to view graph data</div>
    }

    if (loading || !itemPagePrices) {
      return SPINNER_DOM;
    }

    if (isMobile) {
      return (
        <div style={{margin: 30}}>
          {[0,1,2].map((timespan, i) =>
            <div key={`graph-${timespan}`} style={{flex: 1}}>
              <h4 style={{color: 'turquoise', marginBottom: 10}}>{TIMESPAN_DISPLAY[timespan]} View </h4>
              <AuctionGraph prices={itemPagePrices[timespan]} item={graphItem} timespan={timespan}/>
            </div>
          )}
        </div>
      )
    }

    return (
      <div style={{display: 'flex', alignItems: 'space-evenly', margin: 30}}>
        {[0,1,2].map((timespan, i) =>
          <div key={`graph-${timespan}`} style={{flex: 1}}>
            <h4 style={{color: 'turquoise', marginBottom: 15}}>{TIMESPAN_DISPLAY[timespan]} View </h4>
            <AuctionGraph prices={itemPagePrices[timespan]} item={graphItem} timespan={timespan}/>
          </div>
        )}
      </div>
    )
  }

  _getViewElements() {
    const {location, currentRealm, currentFaction, graph, loading, items, pageContext: { item } } = this.props;
    const {item: graphItem, prices, itemPagePrices, loading: graphLoading} = graph;
    const imgHref = 'https://render-classic-us.worldofwarcraft.com/icons/56/' + item.icon + '.jpg';
    const itemTitle = <span className={'table-row-search-icon'}
                            style={{display: 'flex', justifyContent: 'space-between', backgroundImage: 'url("'+imgHref+'")'}}>
              <span style={{display: 'flex'}}>
                <span style={{marginLeft: 50, display: 'flex', alignItems: 'center'}}>
                  {item.name}
                </span>
              </span>
            </span>;

    const filteredItems = items.filter(row => row.buyout > 0);
    const cheapestItems = filteredItems.map((i) => {
      const ratio = i.buyout / i.quantity;
      return {
        ...i,
        ratio
      }
    }).sort((a, b) => a.ratio - b.ratio).slice(0, 5);

    let noPriceData;
    if (!currentFaction || !currentRealm) {
      noPriceData = <div style={{display: 'flex'}}>Please select a realm and faction to view pricing data</div>
    }

    return {itemTitle, cheapestItems, noPriceData};
  }

  _renderDesktopView() {
    const {location, currentRealm, currentFaction, graph, loading, items, pageContext: { item } } = this.props;
    const {item: graphItem, prices, itemPagePrices, loading: graphLoading} = graph;
    const {itemTitle, cheapestItems, noPriceData} = this._getViewElements();

    return (
      <Container style={{color: '#fff', paddingTop: 80, display: 'flex', flexDirection: 'column', alignItems: 'space-evenly'}}>
        <div style={{marginLeft: 30, marginRight: 30, display: 'flex'}}>
          <h3>
            {itemTitle}
          </h3>
        </div>
        <div style={{display: 'flex', alignItems: 'space-evenly'}}>
          <div style={{flex: 1, margin: 30}}>
            <h4 style={{color: 'turquoise', marginBottom: 15}}>Stats</h4>
            {<ItemTooltip item={item} tooltip={item.tooltip}/>}
            <a href={`https://classic.wowhead.com/item=${item.id}`} alt="wowhead">View on Wowhead</a>
          </div>
          <div style={{flex: 1, margin: 30}}>
            <h4 style={{color: 'turquoise', marginBottom: 15}}>Cheapest Buyouts</h4>
            {noPriceData ? noPriceData :
              cheapestItems.map(
                (cheapestItem) => <WoWMoney text={`${cheapestItem.seller}: x${cheapestItem.quantity}`} money={cheapestItem.buyout}/>
              )}
          </div>
        </div>
        {this.renderAllGraphs(itemPagePrices, graphItem)}
      </Container>
    )
  }

  _renderMobileView() {
    const {location, currentRealm, currentFaction, graph, loading, items, pageContext: { item } } = this.props;
    const {item: graphItem, prices, itemPagePrices, loading: graphLoading} = graph;
    const {itemTitle, cheapestItems, noPriceData} = this._getViewElements();

    return (
      <Container style={{color: '#fff', paddingTop: 60, display: 'flex', flexDirection: 'column', alignItems: 'space-evenly'}}>
        <div style={{margin: 30, display: 'flex'}}>
          <h3>
            {itemTitle}
          </h3>
        </div>
        <div style={{display: 'flex'}}>
          <div style={{flex: 1, margin: 30}}>
            <h4 style={{color: 'turquoise', marginBottom: 15}}>Stats</h4>
            {<ItemTooltip item={item} tooltip={item.tooltip}/>}
            <a href={`https://classic.wowhead.com/item=${item.id}`} alt="wowhead">View on Wowhead</a>
          </div>
        </div>
        <div style={{flex: 1, margin: 30}}>
          <h4 style={{color: 'turquoise', marginBottom: 15}}>Cheapest Buyouts</h4>
          {noPriceData ? noPriceData :
            cheapestItems.map(
              (cheapestItem) => <WoWMoney text={`${cheapestItem.seller}: x${cheapestItem.quantity}`} money={cheapestItem.buyout}/>
            )}
        </div>
        {this.renderAllGraphs(itemPagePrices, graphItem, true)}
      </Container>
    )
  }

  render() {
    const {location} = this.props;

    return (
      <AuctionHouse location={location}>
        <Desktop>
          {this._renderDesktopView()}
        </Desktop>
        <Mobile>
          {this._renderMobileView()}
        </Mobile>
        <Tablet>
          {this._renderMobileView()}
        </Tablet>
      </AuctionHouse>
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
    setCurrentRealm: (realm) => {
      dispatch(setCurrentRealm(realm));
    },
    setCurrentFaction: (faction) => {
      dispatch(setCurrentFaction(faction));
    },
    searchOnSort: (field, order, query, pushHistory=false) => {
      dispatch(searchOnSetSort(field, order, query, pushHistory));
    },
    loadAllGraphs: (item, realm, faction) => {
      dispatch(getAllMarketpriceData(item, realm, faction));
    },
    hideGraph: () => {
      dispatch(hideGraphModal());
    },
    getEmptyLabelString: () => {
      dispatch(getEmptyLabelString())
    },
    updateQuery: (q) => {
      dispatch(updateSearchQuery(q))
    },
    updatePageNum: (p) => {
      dispatch(updatePageNum(p))
    },
    onHandleAutoComplete: (evt) => {
      dispatch(autocomplete(evt))
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

export default connect(mapStateToProps, mapDispatchToProps)(ItemTemplate)
