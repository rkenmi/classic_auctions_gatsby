import React, {PureComponent} from 'react';
import moment from 'moment';

export class CustomizedAxisTick extends PureComponent {

  format12Hr(tick) {
    return moment(tick).format('h:mm a')
  }

  format1Wk(tick) {
    return moment(tick).format('M/D')
  }

  render() {
    const {
      x, y, payload, timespan
    } = this.props;

    let format = timespan === 0 ? this.format12Hr : this.format1Wk;

    return (
      <g transform={`translate(${x},${y})`}>
      </g>
    );
  }
}

