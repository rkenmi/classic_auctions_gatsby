import React, {useEffect, useState} from 'react';
import Footer from '../widgets/Footer';
import SEO from './seo';
import {Desktop, Mobile, Tablet} from '../helpers/mediaTypes';
import DesktopNavbar from '../widgets/DesktopNavbar';
import MobileNavbar from '../widgets/MobileNavbar';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import {hideSuggestionItemsTooltip} from '../helpers/searchHelpers';

function renderTitle(title, small=false) {
  if (!title) {
    return null;
  }

  let element = title;
  if (typeof title === 'string') {
    element = small ? <h4>{title}</h4> : <h3>{title}</h3>;
  }

  return (
    <Jumbotron fluid style={{backgroundColor: 'rgba(255, 255, 255, 0.05)'}}>
      <Container>{element}</Container>
    </Jumbotron>
  )
}

export default function Layout({ metaInfo, title, children, location }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true, []);
    hideSuggestionItemsTooltip();
  });

  if (!show) {
    return null;
  }

  let footer;
  if (location) {
    footer = <Footer location={location}/>
  } else {
    footer = <Footer/>
  }

  const {subtitle, description} = metaInfo;

  return (
    <div style={{position: 'relative', minHeight: '80vh'}}>
      <SEO title={`Classic AH WoW`}
           subtitle={subtitle}
           description={description}
      />
      <div>
        <Desktop><DesktopNavbar/></Desktop>
        <Tablet><MobileNavbar/></Tablet>
        <Mobile><MobileNavbar/></Mobile>
        {renderTitle(title)}
        {children}
        {footer}
      </div>
    </div>
  )
};