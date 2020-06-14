import React from 'react';
import {useMediaQuery} from 'react-responsive';

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

