import React from 'react';
import {Link} from 'gatsby';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import {Logo} from '../helpers/domHelpers';
import Nav from 'react-bootstrap/Nav';
import AuctionSearchBar from './AuctionSearchBar';
import RealmDropdown from '../components/RealmDropdown';
import {connect} from 'react-redux';
import {
  autocomplete,
  keysPressed,
  pickSuggestion,
  searchOnSetRealmAndFaction,
  setSearchState,
  search
} from '../actions/actions';

class DesktopNavbar extends React.Component {
  render() {
    const {currentRealm, currentFaction, realms} = this.props;

    return (
      <Container id={'desktopNavbar'}>
        <Navbar variant="dark" style={{display: 'flex', paddingLeft: 0, paddingRight: 0}}>
          <Navbar.Brand>
            <Link to={'/'} style={{textDecoration: 'none'}}>
              <Logo/>
            </Link>
          </Navbar.Brand>
          <Nav style={{flex: 1, justifyContent: 'flex-end'}}>
            <AuctionSearchBar
              onSearch={this.props.onSearch}
              options={this.props.suggestions.map(m => ({...m, name: m.name}))}
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
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    suggestions: state.pageReducer.suggestions,
    searchBarRef: state.visibilityReducer.searchBarRef,
    query: state.pageReducer.query,
    realms: state.pageReducer.realms,
    currentRealm: state.pageReducer.currentRealm,
    currentFaction: state.pageReducer.currentFaction
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setCurrentRealmAndFactionAndSearch: (realm, faction) => {
      dispatch(searchOnSetRealmAndFaction(realm, faction));
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DesktopNavbar);
