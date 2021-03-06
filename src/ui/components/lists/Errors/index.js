import c from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import s from './styles.css';

export class Errors extends React.PureComponent {
  render() {
    const { value, className } = this.props;
    if (value === undefined || (value && value.length === 0)) {
      return null;
    }
    return (
      <ul className={c('text-caption m-u-t color-accent-1-dark', s.list, className)}>
        {value.map((err, idx) => (
          <li key={idx.toString()}>{err}</li>
        ))}
      </ul>
    );
  }
}

Errors.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
};
