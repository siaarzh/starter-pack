import c from 'classnames';
import Icon from 'components/Icon';
import Label from 'components/Label';
import React, { Component } from 'react';

import s from './styles.css';

class Checkbox extends Component {
  render() {
    const { name, checked, initialChecked, handleChange, value, className, children } = this.props;
    const isModified = checked !== initialChecked;
    return (
      <div className={c({ modified: isModified })}>
        <Label className={className}>
          <input name={name} type="checkbox" value={value} checked={checked} onChange={handleChange} />
          <div className={c(s.checkbox, 'iconw-m iconh-m m-right-s')}>
            {checked ? <Icon name="svg-checkmark" /> : null}
            <div className={s.backdrop} />
          </div>
          {children}
        </Label>
      </div>
    );
  }
}

export default Checkbox;
