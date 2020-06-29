const React = require('react');

export class TextBlock extends React.Component {
  render () {
    const {title, children} = this.props;
    return (
      <div style={{marginTop: 30, flex: 1}}>
        <h4 style={{color: 'turquoise'}}>{title}</h4>
        <div style={{color: 'white', marginTop: 15}}>
          {children}
        </div>
      </div>
    )
  };
}
