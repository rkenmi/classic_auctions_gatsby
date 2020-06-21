import AuctionHouse from '../pages/index';
import {connect} from 'react-redux';
import {
  getAllMarketpriceData, setPageContext, getCheapestBuyout
} from '../actions/actions';
import {SORT_FIELDS, SORT_ORDERS, TIMESPAN_DISPLAY} from '../helpers/constants';
import {AuctionGraph} from '../widgets/graph/AuctionGraph';
import {getColorCode, hideSuggestionItemsTooltip} from '../helpers/searchHelpers';
import {WoWMoney} from '../widgets/WoWMoney';
import {Desktop, Mobile, Tablet} from '../helpers/mediaTypes';
import Layout from '../components/Layout';
import Container from 'react-bootstrap/Container';
import {getItemizedLink, getQuantityDOM, SPINNER_DOM} from '../helpers/domHelpers';
import moment from 'moment';
import {SOCKET} from '../helpers/endpoints';
const React = require('react');

class ItemTooltip extends React.Component {
  render() {
    const {item, tooltip} = this.props;

    let hasSubtype;
    if (tooltip.length > 4) {
      hasSubtype = tooltip[4].format === 'alignRight';
    }

    let mainTooltipDone = false;


    const tt = tooltip.filter(line => !line['label'].includes('Drop'));
    const tooltipDOM = tt.map((line, i) => {
      const {format} = line;
      let style = {display: 'block', fontSize: mainTooltipDone ? 12 : 15};

      if (hasSubtype && (i === 3 || i === 4)) {
        style['display'] = 'inline';
        if (i === 3) {
          return (
            <div style={{'display': 'flex'}} key={`tooltip-${item.id}-${i}`}>
              <span style={{width: '100%', justifyContent: 'flex-start'}}>{tt[i].label}</span>
              <span style={{justifyContent: 'flex-end'}}>{tt[i+1].label}</span>
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
        mainTooltipDone = true;
        style['paddingBottom'] = i === (tt.length - 1) ? 0 : 20;
        // Sell by
        return <span style={style} key={`tooltip-${item.id}-${i}`}><WoWMoney text={line['label']} money={item.sellPrice}/></span>
      } else if (line['label'].includes("Use:")) {
        style['color'] = getColorCode('Uncommon');
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
    this.props.setPageContext(item);
    if (currentFaction && currentRealm) {
      this.props.getCheapestItems(this.props.pageContext.item.name);
      this.props.loadAllGraphs(item, currentRealm, currentFaction);
    }
    hideSuggestionItemsTooltip();
  }

  componentWillUnmount() {
    this.props.setPageContext(null);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {currentRealm, currentFaction, query, items, pageContext: {item}} = this.props;
    if (prevProps.currentRealm !== currentRealm || prevProps.currentFaction !== currentFaction) {
      this.props.getCheapestItems(this.props.pageContext.item.name);
      this.props.loadAllGraphs(item, currentRealm, currentFaction);
    }
  }

  renderAllGraphs(itemPagePrices, graphItem) {
    const {currentRealm, currentFaction, graph: {loading}} = this.props;
    const flexDirection = 'column';

    const getGraphDOM = (content) => (
      <div style={{margin: 30}}>
        <h4 style={{color: 'turquoise', marginBottom: 15}}>Graphs</h4>
        <div style={{display: 'flex', flexDirection, alignItems: 'space-evenly'}}>
          {content}
        </div>
      </div>
    );

    if (!currentFaction || !currentRealm) {
      return getGraphDOM('Please select a realm and faction to view graph data');
    }

    if (loading || !itemPagePrices) {
      return getGraphDOM(SPINNER_DOM);
    }

    return getGraphDOM(
          [0,1,2].map((timespan, i) =>
            <div key={`graph-${timespan}-${i}`} style={{flex: 1}}>
              <h6 style={{color: getColorCode('Misc'), marginBottom: 10}}>{TIMESPAN_DISPLAY[timespan]}</h6>
              <AuctionGraph prices={itemPagePrices[timespan]} item={graphItem} timespan={timespan}/>
            </div>
          )
    );
  }

  _getViewElements() {
    const {currentRealm, currentFaction, pageLoading, graph: {cheapestItems}, pageContext: { item } } = this.props;
    const imgHref = 'https://render-classic-us.worldofwarcraft.com/icons/56/' + item.icon + '.jpg';
    const itemTitle = getItemizedLink(item, imgHref);

    let noPriceData;
    if (!currentFaction || !currentRealm) {
      noPriceData = <div style={{display: 'flex'}}>Please select a realm and faction to view pricing data</div>
    } else if (cheapestItems.length === 0) {
      noPriceData = <div style={{display: 'flex'}}>No items found!</div>
    }

    return {itemTitle, cheapestItems, noPriceData};
  }

  _renderCheapestItems(noPriceData, cheapestItems, isMobile=false) {
    const {pageLoading} = this.props;
    let dateDOM = null;

    if (pageLoading) {
      return SPINNER_DOM;
    }

    if (cheapestItems && cheapestItems.length > 0) {
      const dateStr = moment(new Date(cheapestItems[0].timestamp)).fromNow();
      dateDOM = <span style={{fontSize: 10, color: getColorCode('Misc')}}>{`Last scanned: ${dateStr}`}</span>;
    }

    const fImgHref = (metaItem) => 'https://render-classic-us.worldofwarcraft.com/icons/56/' + metaItem.icon + '.jpg';

    const style = {};
    if (isMobile) {
      style['margin'] = 30;
    } else {
      style['marginTop'] = 30;
    }

    return (
      <div style={style}>
        <h4 style={{color: 'turquoise', marginBottom: 15}}>Cheapest Buyouts</h4>
        {noPriceData ? noPriceData :
          cheapestItems.map(
            (cheapestItem, i) => {
              return <div key={`${cheapestItem.id}-${i}`} style={{display: 'flex', alignItems: 'center'}}>
                <span style={{backgroundImage: 'url("'+fImgHref(cheapestItem.metaItem)+'")'}}  className={'icon-wrapper'}>
                  {getQuantityDOM(cheapestItem.quantity)}
                  <img src={SOCKET} alt="suggestion icon" style={{height: 50, marginRight: 10}}/>
                </span>
                <span style={{marginLeft: 15}}>
                  {cheapestItem.seller}
                </span>
                <span style={{marginLeft: 15}}>
                  <WoWMoney key={`item$${i}-D`} text={''}
                            money={cheapestItem.buyout}/>
                </span>
              </div>
            }
          )}
        {dateDOM}
      </div>
    )
  }

  _renderTitle(itemTitle) {
    return (
      <div style={{marginLeft: 30, display: 'flex'}}>
        <h3>
          {itemTitle}
        </h3>
      </div>
    )
  }

  _renderDesktopView() {
    const {graph, pageContext: { item } } = this.props;
    const {item: graphItem, itemPagePrices} = graph;
    const {itemTitle, cheapestItems, noPriceData} = this._getViewElements();

    return (
      <Container style={{color: '#fff', paddingTop: 80, display: 'flex', flexDirection: 'column', alignItems: 'space-evenly'}}>
        {this._renderTitle(itemTitle)}
        <div style={{display: 'flex', flex: 1, alignItems: 'space-evenly'}}>
          <div style={{margin: 30, flex: 0.3}}>
            <h4 style={{color: 'turquoise', marginBottom: 15}}>Stats</h4>
            {<ItemTooltip item={item} tooltip={item.tooltip}/>}
            <a href={`https://classic.wowhead.com/item=${item.id}`} alt="wowhead">View on Wowhead</a>
            {this._renderCheapestItems(noPriceData, cheapestItems)}
          </div>
          <div style={{flex: 0.7}}>
            {this.renderAllGraphs(itemPagePrices, item)}
          </div>
        </div>
      </Container>
    )
  }

  _renderMobileView() {
    const {graph, pageContext: { item } } = this.props;
    const {item: graphItem, itemPagePrices} = graph;
    const {itemTitle, cheapestItems, noPriceData} = this._getViewElements();

    return (
      <Container style={{color: '#fff', paddingTop: 0, display: 'flex', flexDirection: 'column', alignItems: 'space-evenly'}}>
        {this._renderTitle(itemTitle)}
        <div style={{display: 'flex'}}>
          <div style={{flex: 1, margin: 30}}>
            <h4 style={{color: 'turquoise', marginBottom: 15}}>Stats</h4>
            {<ItemTooltip item={item} tooltip={item.tooltip}/>}
            <a href={`https://classic.wowhead.com/item=${item.id}`} alt="wowhead">View on Wowhead</a>
          </div>
        </div>
        {this._renderCheapestItems(noPriceData, cheapestItems, true)}
        {this.renderAllGraphs(itemPagePrices, item)}
      </Container>
    )
  }

  render() {
    const {location, currentRealm, currentFaction, realms, pageContext: { item } } = this.props;

    let subtitle = `Item - ${item.name}`;
    if (currentRealm && currentFaction) {
      subtitle = `Item - ${currentRealm} - ${currentFaction} | ${item.name}`
    }

    return (
      <Layout metaInfo={{subtitle, description: `Classic WoW item data for ${item.name}`}}>
        <AuctionHouse
          noLayout location={location}>
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
      </Layout>
    )
  }
}

function mapStateToProps(state) {
  return {
    searchBarRef: state.visibilityReducer.searchBarRef,
    loading: state.pageReducer.loading,
    pageLoading: state.pageReducer.pageLoading,
    graph: state.pageReducer.graph,
    items: state.pageReducer.items,
    realms: state.pageReducer.realms,
    query: state.pageReducer.query,
    currentRealm: state.pageReducer.currentRealm,
    currentFaction: state.pageReducer.currentFaction,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getCheapestItems: (query) => {
      dispatch(getCheapestBuyout(query));
    },
    loadAllGraphs: (item, realm, faction) => {
      dispatch(getAllMarketpriceData(item, realm, faction));
    },
    setPageContext: (item) => {
      dispatch(setPageContext(item));
    },
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ItemTemplate)
