import c from 'classnames';
import { isEqual } from 'components-di';
import Icon from 'components/Icon';
import WithBackdrop from 'components/WithBackdrop';
import React, { Component } from 'react';

import s from './styles.css';

function labelOrOption(option, labels = {}) {
  return labels[option] === undefined ? option : labels[option];
}

export default class Select extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const { children: curChildren, ...propsButChildren } = this.props;
    const { children: nextChildren, ...nextPropsButChildren } = nextProps;
    return !isEqual(propsButChildren, nextPropsButChildren) || !isEqual(this.state, nextState);
  }
  render() {
    const { container = {}, backdrop = {}, className, options, labels = {}, value, ...restProps } = this.props;
    container.className = ((container.className || '') + `${s.container || ''}`).trim();
    backdrop.className = ((backdrop.className || '') + s.backdrop).trim();
    return (
      <WithBackdrop container={container} backdrop={backdrop}>
        <div className={c(className, 'flex z1')}>
          <div className="flex-auto truncate">
            {value === undefined ? 'Select from the list' : labelOrOption(value, labels)}
          </div>
          <Icon name="svg-select" />{' '}
        </div>
        <select
          className={'z2 absolute top-0 left-0 right-0 bottom-0 opacity-0 cursor-pointer'}
          value={value}
          {...restProps}>
          {options.map(option => (
            <option key={option} value={option}>
              {labelOrOption(option, labels)}
            </option>
          ))}
        </select>
      </WithBackdrop>
    );
  }
}
// class Select extends Component {
//   constructor(props) {
//     super(props);
//     if (props.multiple) {
//       throw new Error('Select component doesn\'t support multiple attribute');
//     }
//   }
//   render() {
//     const { containerProps = {}, backdropProps = {}, ...inputProps } = this.props;
//     const { className: containerClassName, ...otherContainerProps } = containerProps;
//     const { className, value, options, ...otherInputProps } = inputProps;
//     const { className: backdropClassName, ...otherBackdropProps } = backdropProps;
//     return (
//       <div className={c('relative block', s.container, containerClassName)} {...otherContainerProps}>
//         <select className={c('z1 opacity-0 absolute top-0 left-0 right-0 bottom-0')} {...otherInputProps}>
//           {Object.keys(options).map(option => (
//             <option key={option} value={option}>
//               {options[option]}
//             </option>
//           ))}
//         </select>
//         <div className={c(s.backdrop, backdropClassName)} {...otherBackdropProps} />
//         <div className={c(className, 'flex')} {...otherBackdropProps}>
//           <div className="flex-auto truncate">{options[value] || 'Select from the list'}</div>
//           <Icon name="svg-select" />
//         </div>
//       </div>
//     );
//   }
// }

// export default Select;
