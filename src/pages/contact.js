import {Container} from 'react-bootstrap';
import Layout from '../components/Layout';
import {TextBlock} from '../components/TextBlock';
const React = require('react');

class Contact extends React.Component {
	render() {
		return (
      <Layout title={'Contact'} metaInfo={{subtitle: 'Privacy Policy', description: 'Details for Classic AH Privacy Policy'}}>
        <Container style={{color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'space-evenly'}}>
          <TextBlock title={'Email'}>
            For any bugs, feature requests, or inquiries, please email us here: webm.classic.ah@gmail.com
          </TextBlock>
        </Container>
      </Layout>
		)
	}
}

export default Contact;
