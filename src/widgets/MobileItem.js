import {TIME_REMAINING} from '../helpers/constants';
import {getColorCode} from '../helpers/searchHelpers';
import Swiper from 'react-id-swiper';
import 'swiper/css/swiper.css'
import {Link} from 'gatsby';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChartBar} from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';

const React = require('react');

export default class Item extends React.Component{
  renderMoney = (text, money) => {
    // For items with no buyout price
    if (money === '0') {
      return <td/>;
    }

    return (
      <span style={{display: 'flex'}}>
        <span style={{flex: 1, justifyContent: 'flex-start'}}>
          {text}
        </span>
        <span style={{justifyContent: 'flex-end'}}>
          {money > 9999 ?
            <span className={'money-gold'}>{Math.floor((money / 10000))}</span>
            : null}
          {money > 99 ?
            <span className={'money-silver'}>{Math.floor((money / 100) % 100)}</span>
            : null}
          <span className={'money-copper'}>{Math.floor(money % 100)}</span>
        </span>
      </span>
    )
  };

  renderMoneyColumn = (bid, buyout) => {
    return (
      <span style={{display: 'flex', justifyContent: 'space-between'}}>
        {this.renderMoney('Bid:', bid)}
        {this.renderMoney('Buyout:', buyout)}
      </span>
    )
  };

  renderSlideOne() {
    const {metaItem, id, itemName, bid, buyout, seller, timeRemaining, quantity} = this.props.features;
    const imgHref = 'https://render-classic-us.worldofwarcraft.com/icons/56/' + metaItem.icon + '.jpg';
    return (
      <div style={{padding: 10}}>
              <span style={{display: 'flex', flex: 1}}>
                <Link style={{color: getColorCode(metaItem.quality)}} to={'/item/' + id} target={'_blank'} data-wowhead={'item=' + id + '&domain=classic'}>
                  <span className={'table-row-search-icon'}
                        style={{display: 'flex', justifyContent: 'space-between', backgroundImage: 'url("'+imgHref+'")'}}>
                    <span style={{display: 'flex'}}>
                      <span style={{marginLeft: 50, display: 'flex', alignItems: 'center'}}>
                        {itemName}
                      </span>
                    </span>
                  </span>
                </Link>
                <span style={{color: '#fff', marginLeft: 5, display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'flex-start'}}> x {quantity}</span>
                <Button size='sm' style={{height: 30, marginTop: 3, marginRight: 3}} variant={'info'} onClick={this.props.onClickGraph}>
                  <FontAwesomeIcon icon={faChartBar} />
                </Button>
              </span>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <span>Duration: <span style={{fontWeight: 'bold'}}>{TIME_REMAINING[timeRemaining-1]}</span></span>
          <span>Seller: <span style={{fontWeight: 'bold'}}>{seller}</span></span>
        </div>
        {this.renderMoneyColumn(bid, buyout)}
      </div>
    )
  }

  renderSlideTwo(metaItem) {
    return (
      <div style={{padding: 10}}>
        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <span style={{fontWeight: 'bold'}}>{this.renderMoney('Vendor Sell: ', metaItem.sellPrice)}</span>
        </div>
        <span style={{display: 'flex', justifyContent: 'flex-end'}}>
          Item Type: {metaItem.classType}, {metaItem.subclassType}
        </span>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <span>Max Stackable: <span style={{fontWeight: 'bold'}}>{metaItem.maxStack}</span></span>
          <span>Slot: <span style={{fontWeight: 'bold'}}>{metaItem.slot}</span></span>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <span>iLvl: <span style={{fontWeight: 'bold'}}>{metaItem.itemLvl}</span></span>
          <span>Lvl Req: <span style={{fontWeight: 'bold'}}>{metaItem.minLvlRequired}</span></span>
        </div>
      </div>
    )
  }

  render() {
    const {metaItem} = this.props.features;

    const params = {
      Swiper,
      centeredSlides: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      }
    };

    const index = this.props.index ? this.props.index : 0;
    const colorByParity = index % 2 === 1 ? 'rgba(255,255,255,.05)' : 'inherit';

    return (
      <div style={{display: 'flex', alignItems: 'space-evenly', height: 135, backgroundColor: colorByParity}}>
          <Swiper {...params} shouldSwiperUpdate={true}>
            {this.renderSlideOne()}
            {this.renderSlideTwo(metaItem)}
          </Swiper>
      </div>
    );
  }
}

