import React from 'react';
import PropTypes from 'prop-types';
import c from 'classnames';
import s from './styles.css';

export default function Checkbox({ value: _value, label, className, ...props }) {
  let value = '';
  if (_value) {
    value = _value;
  }
  return (
    <label className={c('block w-content relative', className, s.container)}>
      <input className={s.checkbox} type="checkbox" value={value} {...props} />
      <div className={c('relative z1', s.label)}>
        <div className={s['icon-container']}>
          <div className={c('relative', s['icon-square'])}>
            <div className={c('absolute top-0 left-0 right-0 bottom-0', s['icon-square-backdrop'])} />
            <div className={c('absolute', s['icon-square-tick'])} />
          </div>
        </div>
        {label}
      </div>
      <div className={c('absolute top-0 left-0 right-0 bottom-0', s.backdrop)} />
    </label>
  );
}

Checkbox.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};