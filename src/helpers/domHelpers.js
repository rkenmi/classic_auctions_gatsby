import React from 'react';
import {useMediaQuery} from 'react-responsive';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import {getColorCode} from './searchHelpers';
import {MISC_URL} from './endpoints';

const SOCKET = MISC_URL + 'socket-lg.png';
export const Logo = (props) => {
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-device-width: 1224px)'
  });

  if (props.isHomePage === true) {
    return (<h1>Classic <span>AH</span></h1>)
  } else if (isDesktopOrLaptop) {
    return (<h2>Classic <span>AH</span></h2>)
  } else {
    return (<h3>Classic <span>AH</span></h3>)
  }
};

export const SPINNER_DOM = (
  <Container style={{flex: 1, display: 'flex', marginTop: 35, justifyContent: 'center'}}>
    <Spinner variant='info' animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>
  </Container>
);

export const getQuantityDOM = (quantity) => {
  if (!quantity) {
    return null;
  }

  return <span style={{
    position: 'absolute',
    color: '#fff',
    fontWeight: 700,
    width: 45,
    textAlign: 'right',
    marginTop: 25,
  }}
  >{quantity}</span>
};

export const getItemizedLink = (item, imgHref, inverseColors=false) => {
  if (!item || !imgHref) {
    return null;
  }
  const {id, itemName, quality} = item;

  let color = getColorCode(quality);
  if (inverseColors) {
    color = '#000'
  }

  return (
    <a style={{textDecoration: 'none', color: color}} href={'https://classic.wowhead.com/item=' + id} target={'_blank'} rel={'noreferrer'} data-wowhead={'item=' + id + '&domain=classic'}>
      <span style={{backgroundImage: 'url("'+imgHref+'")'}}  className={'icon-wrapper'}>
              <img src={SOCKET} alt="suggestion icon" style={{height: 50, marginRight: 10}}/>
      </span>
      <span>{itemName || item.name}</span>
    </a>
  )
};
