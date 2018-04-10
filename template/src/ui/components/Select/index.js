import c from 'classnames';
import Icon from 'components/Icon';
import React, { Component } from 'react';

import s from './styles.css';

class Select extends Component {
  constructor(props) {
    super(props);
    if (props.multiple) {
      throw new Error('Select component doesn\'t support multiple attribute');
    }
  }
  render() {
    const { containerProps = {}, backdropProps = {}, ...inputProps } = this.props;
    const { className: containerClassName, ...otherContainerProps } = containerProps;
    const { className, value, options, ...otherInputProps } = inputProps;
    const { className: backdropClassName, ...otherBackdropProps } = backdropProps;
    return (
      <div className={c('relative block', s.container, containerClassName)} {...otherContainerProps}>
        <select className={c('z1 opacity-0 absolute top-0 left-0 right-0 bottom-0')} {...otherInputProps}>
          {Object.keys(options).map(option => (
            <option key={option} value={option}>
              {options[option]}
            </option>
          ))}
        </select>
        <div className={c(s.backdrop, backdropClassName)} {...otherBackdropProps} />
        <div className={c(className, 'flex')} {...otherBackdropProps}>
          <div className="flex-auto truncate">{options[value] || 'Select from the list'}</div>
          <Icon name="svg-select" />
        </div>
      </div>
    );
  }
}

export default Select;
