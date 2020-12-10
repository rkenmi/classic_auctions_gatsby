import {Container} from 'react-bootstrap';
import Layout from '../components/Layout';
import {TextBlock} from '../components/TextBlock';
const React = require('react');

class Disclaimer extends React.Component {
	render() {
		return (
      <Layout title={'Disclaimer'} metaInfo={{subtitle: 'Privacy Policy', description: 'Details for Classic AH Privacy Policy'}}>
        <Container style={{color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'space-evenly'}}>
          <TextBlock title={'Disclaimer for Classic AH'}>
            <p>If you require any more information or have any questions about our site's disclaimer, please feel free to contact us by email at webm.classic.ah@gmail.com. Our Disclaimer was generated with the help of the <a href="https://www.disclaimergenerator.net/">Disclaimer Generator</a>.</p>
          </TextBlock>
          <TextBlock title={'Disclaimers for Classic AH'}>
            <p>All the information on this website - https://classic-ah.com - is published in good faith and for general information purpose only. Classic AH does not make any warranties about the completeness, reliability and accuracy of this information. Any action you take upon the information you find on this website (Classic AH), is strictly at your own risk. Classic AH will not be liable for any losses and/or damages in connection with the use of our website.</p>

            <p>From our website, you can visit other websites by following hyperlinks to such external sites. While we strive to provide only quality links to useful and ethical websites, we have no control over the content and nature of these sites. These links to other websites do not imply a recommendation for all the content found on these sites. Site owners and content may change without notice and may occur before we have the opportunity to remove a link which may have gone 'bad'.</p>

          </TextBlock>
          <TextBlock title={'Consent'}>
            <p>By using our website, you hereby consent to our disclaimer and agree to its terms.</p>
          </TextBlock>
          <TextBlock title={'Update'}>
            <p>Should we update, amend or make any changes to this document, those changes will be prominently posted here.</p>
          </TextBlock>
        </Container>
      </Layout>
		)
	}
}

export default Disclaimer;
