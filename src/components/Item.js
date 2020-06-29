import {TIME_REMAINING} from '../helpers/constants';
import {getColorCode, hideSuggestionItemsTooltip} from '../helpers/searchHelpers';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChartBar} from '@fortawesome/free-solid-svg-icons';
import {Link} from 'gatsby';
import {WoWMoney} from './WoWMoney';
import Button from 'react-bootstrap/Button';
import {BIG_ICON_ITEM_URL, SOCKET} from '../helpers/endpoints';
import {getQuantityDOM} from '../helpers/domHelpers';

const React = require('react');

export default class Item extends React.Component {
  renderMoneyColumn = (bid, buyout) => {
    return (
      <td className={'align-middle'}>
        <div style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'row'}}>
          <div style={{flex: 0.85}}>
            <WoWMoney text={'Bid: '} money={bid}/>
            <WoWMoney text={'Buyout: '} money={buyout}/>
          </div>
          <div style={{display: 'flex', flex: 0.15, justifyContent: 'flex-end', alignItems: 'center'}}>
            <Button alt='Click to view market trend' size='sm' style={{height: 30}} variant={'info'} onClick={this.props.onClickGraph}>
              <FontAwesomeIcon icon={faChartBar} />
            </Button>
          </div>
        </div>
      </td>
    )
  };

  render() {
    const {metaItem, id, itemName, bid, buyout, seller, timeRemaining, quantity} = this.props.features;
    const imgHref = BIG_ICON_ITEM_URL + metaItem.icon + '.jpg';

    const quantityDOM = getQuantityDOM(quantity);

    return (
      <tr className={'align-middle'}>
        <td className={'align-middle'} style={{ height: '75px'}}>
          <Link onClick={(e) => {hideSuggestionItemsTooltip()}} className={'auction-table-item'} style={{alignItems: 'center', color: getColorCode(metaItem.quality)}} to={'/item/' + id} target={'_blank'} data-wowhead={'item=' + id + '&domain=classic'}>
            <span style={{backgroundImage: 'url("'+imgHref+'")'}}  className={'icon-wrapper'}>
              {quantityDOM}
              <img src={SOCKET} alt="suggestion icon" style={{height: 50, marginRight: 10}}/>
            </span>
            <span style={{alignItems: 'center'}}>
              {itemName}
            </span>
          </Link>
        </td>
        <td className={'align-middle'}>{metaItem.minLvlRequired}</td>
        {this.renderMoneyColumn(bid, buyout)}
        <td className={'align-middle'}>{seller}</td>
        <td className={'align-middle'}>{TIME_REMAINING[timeRemaining-1]}</td>
      </tr>
    );
  }
}

