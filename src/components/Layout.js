import React from 'react';
import Footer from '../widgets/Footer';

export default function Layout({ children, location }) {
  let footer;
  if (location) {
    footer = <Footer location={location}/>
  } else {
    footer = <Footer/>
  }

  return (
    <div style={{position: 'relative', minHeight: '85vh'}}>
      {children}
      {footer}
    </div>
  )
}