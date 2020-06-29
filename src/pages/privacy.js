import {Container} from 'react-bootstrap';
import Layout from '../components/Layout';
import {TextBlock} from '../components/TextBlock';
const React = require('react');

class PrivacyPolicy extends React.Component {
	render() {
		return (
      <Layout title={'Privacy Policy'} metaInfo={{subtitle: 'Privacy Policy', description: 'Details for Classic AH Privacy Policy'}}>
        <Container style={{color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'space-evenly'}}>
          <TextBlock title={'Data Collection'}>
            <div>
              We collect access logs, which contains access dates and times, IP addresses and browser information.
              This data is gathered for basic analytics such as traffic peaks and to better understand the access behavior of our visitors.

              We may also collect search query input to understand what the most frequent search terms are and to
              improve the quality of our search engine.
            </div>
          </TextBlock>
          <TextBlock title={'Personal Information'}>
            <div>
              We do not store any user-related data such as cookies or passwords. This website is not intended to handle confidential information.
            </div>
          </TextBlock>
          <TextBlock title={'Security'}>
            <div>
              This website is SSL activated.
            </div>
          </TextBlock>
          <TextBlock title={'Questions?'}>
            <div>
              Feel free to email: webm.classic.ah@gmail.com
            </div>
          </TextBlock>
        </Container>
      </Layout>
		)
	}
}

export default PrivacyPolicy;
