import {
  Menu,
  menuItemContainer,
  Typeahead,
  TypeaheadInputSingle
} from 'react-bootstrap-typeahead';
import {getColorCode, hideSuggestionItemsTooltip} from '../helpers/searchHelpers';
import {connect} from 'react-redux';
import {setSearchBarRef, setSearchState} from '../actions/actions';
import React from 'react';
import {Desktop, Mobile, Tablet} from '../helpers/mediaTypes';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSearch} from '@fortawesome/free-solid-svg-icons';
import {TINY_ICON_URL} from '../helpers/endpoints';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import DropdownItem from 'react-bootstrap/DropdownItem';
import {Link} from 'gatsby';

class AuctionSearchBar extends React.Component {

  componentWillUnmount() {
    this.props.setRef(null);
  }

  renderSuggestionRow(result, index) {
    const TypeaheadMenuItem = menuItemContainer(DropdownItem);
    const iconUrl = TINY_ICON_URL + result.icon + '.png';

    return (
      <div key={'search-anchor-' + index}>
            <TypeaheadMenuItem as={'span'} bsPrefix='suggestion-dropdown-item'
                               position={index}
                               style={{cursor: 'pointer'}}
                               option={result} active={result.name === this.props.query}>
              <Link to={'#'}
                    className={'search-anchor'}
                    onClick={(e) => {
                      e.preventDefault();
                      e.currentTarget.dispatchEvent(new MouseEvent("mouseout"));
                      hideSuggestionItemsTooltip()
                    }}
                    target={'_blank'}
                    style={{
                      textDecoration: 'none'
                    }}
                    rel={'item=' + result.id}
                    data-wowhead={'item=' + result.id + '&domain=classic'}
              >
                <img src={iconUrl} alt="suggestion icon" style={{height: 24, marginRight: 10}}/>
                <span style={{color: getColorCode(result.quality)}}>{result.name}</span>
                <span style={{color: getColorCode('Misc'), marginLeft: 10, fontSize: 10}}>
                  {result.classType}
                </span>
              </Link>
            </TypeaheadMenuItem>
      </div>
    );
  }

  getTypeahead() {
    let styling = {flex: 1};

    if (this.props.typeaheadStyle) {
      styling = this.props.typeaheadStyle;
    }

    return (
      <Typeahead
        ref={this.setTypeaheadRef}
        id={'ah-typeahead'}
        renderMenu={(results, menuProps) => (
          <Menu {...menuProps}>{results.map((r, i) => this.renderSuggestionRow(r, i))}</Menu>
        )}
        style={styling}
        defaultInputValue={this.props.query}
        labelKey="name"
        renderInput={(inputProps) => (
          <TypeaheadInputSingle {...inputProps} ref={inputProps.ref} value={this.props.query}/>
        )}
        open={this.shouldOpenSuggestions()}
        options={this.props.options}
        placeholder="Search for an item"
        onInputChange={this.props.onInputChange}
        onChange={this.props.onChange}
        onKeyDown={this.onKeyDown}
      />
    )
  }

  shouldOpenSuggestions = () => {
    // undefined means the Typeahead component controls when to open/close. false means it will never open.
    // Suggestions should never be open if the realm and faction isn't specified
    return this.props.currentRealm && this.props.currentFaction ? undefined : false
  };

  onKeyDown = (e) => {
    this.props.onKeyDown(e);
    hideSuggestionItemsTooltip();
  };

  setTypeaheadRef = (ref) => {
    if (this.props.searchBarRef) {
      return;
    }

    this.props.setRef(ref);
  };

  renderMobileOrTablet() {
    return (
      <InputGroup style={{flex: 1}}>
        {this.getTypeahead()}
        <InputGroup.Append>
          <Button onClick={() => {this.props.onSearch()}}>
            <FontAwesomeIcon icon={faSearch} inverse/>
          </Button>
        </InputGroup.Append>
      </InputGroup>
    )
  }

  render() {
    if (this.props.pureTypeahead) {
      return this.getTypeahead();
    }

    let button = <Button style={{marginLeft: 10}} variant="outline-info"
                         onClick={() => this.props.onSearch()}>Search</Button>;
    if (this.props.useIconAsButton) {
      button = <Button onClick={() => {this.props.onSearch()}}>
          <FontAwesomeIcon icon={faSearch} inverse/>
        </Button>
    }

    let formWidth = {};
    if (this.props.formWidth) {
      formWidth['width'] = this.props.formWidth;
    }

    return (
      <Form inline onSubmit={this.props.onSearch} style={{flex: 1, justifyContent: 'flex-start', ...formWidth}}>
        <Desktop>
          {this.getTypeahead()}
          {button}
        </Desktop>
        <Mobile>
          {this.renderMobileOrTablet()}
        </Mobile>
        <Tablet>
          {this.renderMobileOrTablet()}
        </Tablet>
      </Form>
    )
  }
}

function mapStateToProps(state) {
  return {
    searchBarRef: state.visibilityReducer.searchBarRef,
    query: state.pageReducer.query,
    currentRealm: state.pageReducer.currentRealm,
    currentFaction: state.pageReducer.currentFaction
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setRef: (ref) => {
      dispatch(setSearchBarRef(ref));
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuctionSearchBar);
