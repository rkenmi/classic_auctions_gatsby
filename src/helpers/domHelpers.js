import React from 'react';
import {useMediaQuery} from 'react-responsive';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';

export const Logo = (props) => {
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-device-width: 1224px)'
  })

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

