import {Container} from 'react-bootstrap';
import Layout from '../components/Layout';
import {TextBlock} from '../components/TextBlock';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import {Link} from 'gatsby';
import {TINY_ICON_URL} from '../helpers/endpoints';
import {getColorCode, hideSuggestionItemsTooltip} from '../helpers/searchHelpers';
import LazyLoad from 'react-lazyload';
const React = require('react');
const Infinite = require('react-infinite');
const getItems = (items, currentInput) =>
  items.filter((item) => currentInput !== '' && item.name.toLowerCase().includes(currentInput.toLowerCase())).map((item) =>
    <div key={'item-list-' + item.id}>
      <LazyLoad overflow={true}>
        <Link to={`/item/${item.id}`}
              className={'search-anchor'}
              onClick={(e) => {
                e.currentTarget.dispatchEvent(new MouseEvent("mouseout"));
                hideSuggestionItemsTooltip()
              }}
              target={'_blank'}
              style={{
                textDecoration: 'none'
              }}
              rel={'item=' + item.id}
              data-wowhead={'item=' + item.id + '&domain=classic'}
        >
          <img src={TINY_ICON_URL + item.icon + '.png'} alt="suggestion icon" style={{height: 24, marginRight: 10}}/>
          <span style={{color: getColorCode(item.quality)}}>{item.name}</span>
        </Link>
      </LazyLoad>
    </div>
  );

class Items extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentInput: '',
    };
  }

  render() {
    const {pageContext: {items}} = this.props;
    const {currentInput} = this.state;
    return (
      <Layout title={'Items List'} metaInfo={{subtitle: 'Items List', description: 'List of all possible items to search for'}}>
        <Container style={{color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'space-evenly'}}>
          <TextBlock title={'Search for tradeable items'}>
            <div>
              To view statistics for any item in the database, please search through here.
            </div>
          </TextBlock>
          <TextBlock>
            <InputGroup>
              <FormControl type="text" placeholder={'Search for an item here'} onChange={
                (e) => this.setState({currentInput: e.target.value})
              } aria-label="With textarea" />
            </InputGroup>
          </TextBlock>
          <TextBlock>
            <div style={{padding: 15, minHeight: 300, backgroundColor: 'rgba(255, 255, 255, 0.05)'}}>
              <Infinite containerHeight={300} elementHeight={26}>
                {getItems(items, currentInput)}
              </Infinite>
            </div>
          </TextBlock>
        </Container>
      </Layout>
    )
  }
}

export default Items;
