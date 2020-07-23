import Item from '../components/Item';
import MobileItem from '../components/MobileItem';
import {Desktop, Mobile, Tablet} from '../helpers/mediaTypes';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowDown, faArrowUp} from '@fortawesome/free-solid-svg-icons';
import {SORT_FIELDS, SORT_FIELDS_DISPLAY_NAMES, SORT_ORDERS} from '../helpers/constants';
import {AuctionGraph} from '../components/graph/AuctionGraph';
import {getItemizedLink, SPINNER_DOM} from '../helpers/domHelpers';
import Modal from 'react-bootstrap/Modal';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import {BIG_ICON_ITEM_URL, FOUR_O_FOUR} from '../helpers/endpoints';
const React = require('react');

const TIMESPAN_RADIOS = [
  { name: '12 Hr', value: 0 },
  { name: '1 Wk', value: 1 },
  { name: '1 Mo', value: 2 },
];

export default class AuctionTable extends React.Component {
  renderGraphModal() {
    const {item, prices, loading, timespan} = this.props.graph;

    const show = item !== null;
    const hide = () => {this.props.onCloseModal()};
    const spinner = SPINNER_DOM;

    if (!item) {
      return null;
    }

    const {metaItem, id} = item;
    const imgHref = BIG_ICON_ITEM_URL + metaItem.icon + '.jpg';

    return (
      <Modal show={show} onHide={hide}>
        <Modal.Header closeButton>
          <Modal.Title><h4>
            {getItemizedLink(metaItem, imgHref, true)}
          </h4></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ButtonGroup toggle style={{flex: 1, marginBottom: 15}}>
              {TIMESPAN_RADIOS.map((radio, idx) => (
                <ToggleButton
                  key={idx}
                  type="radio"
                  variant="info"
                  name="radio"
                  value={radio.value}
                  checked={timespan === radio.value}
                  onChange={(e) => this.props.onSetTimespan(parseInt(e.currentTarget.value), item)}
                >
                  {radio.name}
                </ToggleButton>
              ))}
            </ButtonGroup>
          </div>
          {loading ? spinner : <AuctionGraph prices={prices} item={item} timespan={timespan}/>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="info" onClick={hide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  getDesktopItems(items, currentRealm, currentFaction) {
    return items.map(features =>
      <Item key={items.indexOf(features)} index={items.indexOf(features)}
            currentRealm={currentRealm} currentFaction={currentFaction}
            features={features} onClickGraph={() => this.props.onClickGraph(features)}
      />
    );
  }

  getMobileItems(items, currentRealm, currentFaction) {
    return items.map(features =>
      <MobileItem key={items.indexOf(features)} index={items.indexOf(features)}
                  currentRealm={currentRealm} currentFaction={currentFaction}
                  features={features} onClickGraph={() => this.props.onClickGraph(features)}
      />
    );
  }

  getColumnHeaderSortedTitle(field) {
    const sort = this.props.sortFilter;
    const matches = sort.field === field || (field === 'price' && ['bid', 'buyout'].includes(sort.field));
    let fieldName = SORT_FIELDS_DISPLAY_NAMES[field];
    if (sort.field && matches) {
      fieldName = SORT_FIELDS_DISPLAY_NAMES[sort.field];
    }

    let SortIcon;
    if (sort.order === SORT_ORDERS.ASCENDING && matches) {
      SortIcon = <FontAwesomeIcon style={{width: 20}} color={'turquoise'} icon={faArrowUp}/>
    } else if (sort.order ===SORT_ORDERS.DESCENDING && matches) {
      SortIcon = <FontAwesomeIcon style={{width: 20}} color={'turquoise'} icon={faArrowDown}/>
    } else {
      SortIcon = <span style={{width: 20}}/>;
    }

    return (
      <span>{fieldName} {SortIcon}</span>
    )
  }

  render() {
    let {items, currentRealm, currentFaction} = this.props;

    if (!items || this.props.loading) {
      return SPINNER_DOM;
    }

    if (this.props.hasSearched === false && items.length === 0) {
      return (
        <Container style={{flex: 1, display: 'flex', marginTop: 35, justifyContent: 'center', color: '#fff'}}>
          Welcome! Search for an item in the input box and select your realm/faction to get started.
        </Container>
      )
    } else if (items.length === 0) {
      return (
        <Container style={{flex: 1, flexDirection: 'column', display: 'flex', marginTop: 35, alignItems: 'center', color: '#fff'}}>
          No results! Try another query.
        </Container>
      )
    }

    return (
      <div>
        <Desktop>
          <Table responsive striped bordered hover size="xs" variant={"dark"}>
            <tbody>
            {this.renderGraphModal()}
            <tr>
              <th style={{width: '35%', alignItems: 'center'}}>
                <DropdownButton
                  style={{display: 'flex'}}
                  bsPrefix={'invis'}
                  size={'sm'}
                  id={'QtyDD'}
                  variant={'info'}
                  title={this.getColumnHeaderSortedTitle(SORT_FIELDS.QUANTITY)}
                >
                  <Dropdown.Header>Order by Quantity</Dropdown.Header>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={() => this.props.searchOnSort(SORT_FIELDS.QUANTITY, SORT_ORDERS.ASCENDING)}>Low to High</Dropdown.Item>
                  <Dropdown.Item onClick={() => this.props.searchOnSort(SORT_FIELDS.QUANTITY, SORT_ORDERS.DESCENDING)}>High to Low</Dropdown.Item>
                </DropdownButton>
              </th>
              <th style={{width: '5%'}}>Req</th>
              <th style={{width: '30%', justifyContent: 'space-between', alignItems: 'center'}}>
                <DropdownButton
                  style={{display: 'flex'}}
                  bsPrefix={'invis'}
                  size={'sm'}
                  id={`PriceDD`}
                  variant={'info'}
                  title={this.getColumnHeaderSortedTitle(SORT_FIELDS.PRICE)}>
                  <Dropdown.Header>Order by</Dropdown.Header>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={() => this.props.searchOnSort(SORT_FIELDS.BUYOUT, SORT_ORDERS.ASCENDING)}>Buyout: Low to High</Dropdown.Item>
                  <Dropdown.Item onClick={() => this.props.searchOnSort(SORT_FIELDS.BID, SORT_ORDERS.ASCENDING)} eventKey="2">Bid: Low to High</Dropdown.Item>
                  <Dropdown.Item onClick={() => this.props.searchOnSort(SORT_FIELDS.BUYOUT, SORT_ORDERS.DESCENDING)}>Buyout: High to Low</Dropdown.Item>
                  <Dropdown.Item onClick={() => this.props.searchOnSort(SORT_FIELDS.BID, SORT_ORDERS.DESCENDING)}>Bid: High to Low</Dropdown.Item>
                </DropdownButton>
              </th>
              <th style={{width: '20%'}}>Seller</th>
              <th style={{width: '10%'}}>Time Left</th>
            </tr>
            {this.getDesktopItems(items.slice(0, 15), currentRealm, currentFaction)}
            </tbody>
          </Table>
        </Desktop>
        <Mobile>
          <div style={{color: '#fff', marginBottom: 10}}>
            {this.renderGraphModal()}
            <div style={{backgroundColor: '#343a40'}}>
              {this.getMobileItems(items.slice(0, 15), currentRealm, currentFaction)}
            </div>
          </div>
        </Mobile>
        <Tablet>
          <div style={{color: '#fff', marginBottom: 10}}>
            <div style={{height: 25}}/>
            {this.renderGraphModal()}
            <div style={{backgroundColor: '#343a40'}}>
              {this.getMobileItems(items.slice(0, 15), currentRealm, currentFaction)}
            </div>
          </div>
        </Tablet>
      </div>
    )
  }
}

