const React = require('react');

export class WoWMoney extends React.Component {
  renderDesktopMoney = (text, money) => {
    // For items with no buyout price
    if (money === '0' || money === 0) {
      return <span style={{border: 0}}/>;
    }

    return (
      <div style={{display: 'flex'}}>
        <span style={{flex: 1, justifyContent: 'flex-start'}}>
          {text}
        </span>
        <span style={{justifyContent: 'flex-end'}}>
          {money > 9999 ?
            <span className={'money-gold'}>{Math.floor((money / 10000))}</span>
            : null}
          {money > 99 ?
            <span className={'money-silver'}>{Math.floor((money / 100) % 100)}</span>
            : null}
          <span className={'money-copper'}>{Math.floor(money % 100)}</span>
        </span>
      </div>
    )
  };

  render() {
    const {text, money} = this.props;
    return this.renderDesktopMoney(text, money)
  }
}
