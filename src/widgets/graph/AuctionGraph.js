import React, {PureComponent} from 'react';
import moment from 'moment';
import {Area, CartesianGrid, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {CustomizedAxisTick} from './TimeAxisTick';
import {WowCurrencyTick} from './WoWCurrencyTick';
import {CustomTooltip} from './GraphTooltip';

const formatTick = (tick) => moment(tick).format('MM/DD h:mm a');
export class AuctionGraph extends PureComponent {
  render() {
    let {prices, item, timespan} = this.props;
    prices = prices.map(p => {
      return {...p, timestamp: moment(p.timestamp).valueOf()}
    });

    let startDate;
    if (timespan === 2) {
      startDate = moment().subtract(1, 'month').valueOf();
    } else if (timespan === 1) {
      startDate = moment().subtract(1, 'week').valueOf();
    } else {
      startDate = moment().subtract(12, 'hours').valueOf();
    }

    return (
      <ResponsiveContainer width={'100%'} height={300}>
        <ComposedChart data={prices}
                       margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="timestamp"
                 type={'number'}
                 scale={'time'}
                 height={60}
                 tick={<CustomizedAxisTick timespan={timespan}/>}
                 interval={5}
                 domain={[
                   startDate,
                   moment().valueOf(),
                 ]}
                 tickFormatter={formatTick}/>
          <YAxis dataKey="price" width={75} tick={<WowCurrencyTick timespan={timespan}/>} />
          <Tooltip content={<CustomTooltip item={item}/>} />
          <Area type="monotone" dataKey="price" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
        </ComposedChart>
      </ResponsiveContainer>
    )
  }
}

