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
              We collect access logs, which contains access dates and times, IP addresses and device information.
              This data is gathered for basic analytics such as traffic peaks and to better understand the access behavior of our visitors.
            </div>
          </TextBlock>
          <TextBlock title={'Personal Information'}>
            <div>
              We do not store any sensitive user-related data such as cookies or passwords.
              Authentication is handled through Google's OAuth 2.0 API.
              We use an encrypted version of the identifier key associated to Google accounts to store alarms and other relevant
              in-game item data for World of Warcraft: Classic.
            </div>
          </TextBlock>
        </Container>
      </Layout>
		)
	}
}

export default PrivacyPolicy;
