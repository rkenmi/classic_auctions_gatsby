import React from 'react';
import Footer from '../widgets/Footer';
import SEO from './seo';

export default function Layout({ metaInfo, children, location }) {
  let footer;
  if (location) {
    footer = <Footer location={location}/>
  } else {
    footer = <Footer/>
  }

  const {subtitle, description} = metaInfo;

  return (
    <div style={{position: 'relative', minHeight: '85vh'}}>
      <SEO title={`Classic AH WoW`}
           subtitle={subtitle}
           description={description}
      />
      {children}
      {footer}
    </div>
  )
}