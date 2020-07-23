import {connect} from 'react-redux';
import {Link} from 'gatsby';
import moment from 'moment';
import Container from 'react-bootstrap/Container';

const React = require('react');

const PageLinks = (props) => {
  const footerWidth = 300;

  return (
    <div id={'ah-footer'} style={{
      marginBottom: 5,
      display: 'flex',
      width: footerWidth,
      justifyContent: 'space-evenly',
      color: '#fff',
      fontSize: 11
    }}>
      <Link to={'/'}>Home</Link>
      <Link to={'/about'}>About</Link>
      <Link to={'/privacy'}>Privacy Policy</Link>
      <Link to={'/items'}>Items List</Link>
    </div>
  )
};

class Footer extends React.Component {
  state = {
    submenu: {}
  };

  render() {
    const {items, queryMs, location} = this.props;

    let dateDom, latencyDom;
    if (items && items.length > 0 && location && location.pathname === '/search') {
      const dateStr = moment(new Date(items[0].timestamp)).fromNow();
      dateDom = <div style={{color: '#fff', fontSize: 10}}>Last data refresh: {dateStr}</div>;
    }

    if (queryMs && location && location.pathname === '/search') {
      latencyDom = <div style={{color: '#fff', fontSize: 10}}>Query response time: {queryMs} ms</div>;
    }

    return (
      <Container style={{height: '10vh'}}>
        <Container style={{position: 'absolute', left: 0, right: 0,  bottom: '-5vh', marginBottom: '5vh', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <PageLinks/>
          {dateDom}
          {latencyDom}
        </Container>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    items: state.pageReducer.items,
    queryMs: state.pageReducer.queryMs,
  };
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Footer)
