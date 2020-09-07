const React = require('react');

export class TextBlock extends React.Component {
  render () {
    const {title, children, sm, indent, titleColor} = this.props;

    const TitleColor = titleColor ? titleColor : 'turquoise';

    const Title = sm ? <h6 style={{color: TitleColor}}>{title}</h6>
        : <h4 style={{color: TitleColor}}>{title}</h4>;

    const windowStyle = {
      marginTop: 30, flex: 1
    };

    if (indent) {
      windowStyle.marginLeft = 8;
    }

    return (
      <div style={windowStyle}>
        {Title}
        <div style={{color: 'white', marginTop: 15}}>
          {children}
        </div>
      </div>
    )
  };
}
