import React from 'react';
import {Link} from 'gatsby';
import Navbar from 'react-bootstrap/Navbar';
import {Logo} from '../helpers/domHelpers';
import AuctionSearchBar from './AuctionSearchBar';
import RealmDropdown from '../components/RealmDropdown';
import {connect} from 'react-redux';
import {
  autocomplete,
  keysPressed,
  pickSuggestion,
  searchOnSetRealmAndFaction, setMobileNavExpanded,
  setSearchState,
  search, searchOnSetSort
} from '../actions/actions';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {SORT_FIELDS, SORT_ORDERS} from '../helpers/constants';
import {faArrowUp} from '@fortawesome/free-solid-svg-icons/faArrowUp';
import {faArrowDown} from '@fortawesome/free-solid-svg-icons/faArrowDown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import {capitalizeWord} from '../helpers/searchHelpers';

class MobileNavbar extends React.Component {
  getMobileSortedDropdownTitle = () => {
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
  };

  render() {
    const realms = this.props.realms || [];
    const {mobileNavExpanded, currentRealm, currentFaction} = this.props;

    return (
      <div id='mobileNavBar' style={{display: 'flex', flexDirection: 'column', marginTop: 75}}>
        <Navbar
          ref={(ref) => {this.navbarRef = ref}}
          fixed={'top'} style={{display: 'flex'}} bg={'dark'} variant={'dark'} expand={'lg'}
                onToggle={()=> {this.props.setMobileNavExpanded(!mobileNavExpanded)} }
                expanded={this.props.mobileNavExpanded}>
          <Navbar.Brand>
            <Link to={'/'} style={{textDecoration: 'none'}}>
              <Logo/>
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse style={{justifyContent: 'center', marginTop: 5}} id="basic-navbar-nav">
            <AuctionSearchBar
              onSearch={this.props.onSearch}
              options={this.props.suggestions.map(m => ({...m, name: m.name}))}
              onInputChange={this.props.onHandleAutoComplete}
              onChange={this.props.onPickSuggestion}
              onKeyDown={(e) => this.props.onKeyPressed(e, false)}
            />
            <div style={{display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'flex-start', marginTop: 15, marginBottom: 5}}>
              <RealmDropdown style={{marginLeft: 0}}
                             currentRealm={currentRealm}
                             currentFaction={currentFaction}
                             onSelectRealmAndFaction={this.props.setCurrentRealmAndFactionAndSearch}
                             realms={realms}/>
            </div>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    sort: state.pageReducer.sort,
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
    searchOnSort: (field, order) => {
      dispatch(searchOnSetSort(field, order, null, true));
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MobileNavbar);
