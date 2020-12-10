import {Container} from 'react-bootstrap';
import Layout from '../components/Layout';
import {TextBlock} from '../components/TextBlock';
const React = require('react');

class About extends React.Component {
  render() {
    return (
      <Layout title={'About'} metaInfo={{subtitle: 'About', description: 'About Classic AH'}}>
        <Container style={{color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'space-evenly'}}>
          <TextBlock title={'Goal'}>
            <div>
              Classic AH is a search engine for auction house data on WoW Classic powered by TSM Classic. The goal of Classic AH is to provide
              near real-time auction house data from the convenience of your desktop, tablet, or mobile phone.

              We are currently only launched for US-West realms. If there is enough interest in this application, then we'll
              consider expanding to US-East, Europe and Oceanic!
            </div>
          </TextBlock>
          <TextBlock title={'Donations'}>
            <div>
              If you would like to help cover the hosting costs, it would be much appreciated!
            </div>
            <div style={{display: 'flex', justifyContent: 'center', marginTop: 30}}>
              <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                <input type="hidden" name="cmd" value="_donations" />
                <input type="hidden" name="business" value="NSK3K4THL6YGA" />
                <input type="hidden" name="item_name" value="Hosting costs for auction house!" />
                <input type="hidden" name="currency_code" value="USD" />
                <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
                <img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" />
              </form>
            </div>
          </TextBlock>
        </Container>
      </Layout>
    )
  }
}

export default About;
