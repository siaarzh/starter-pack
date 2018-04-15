import c from 'classnames';
import { isEqual } from 'components-di';
import Label from 'components/Form/Label';
import focusWatcher from 'focus-watcher';
import { merge } from 'object-state-storage';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import uuid from 'utils/uuid';

class WithLabel extends Component {
  constructor(props) {
    super(props);
    this._id = uuid();
  }
  handleLabelClick() {
    if (!this.props.nofocus) {
      focusWatcher.enableFocusRing();
    }
  }
  render() {
    const { label, initialValue, children, nofocus, ...restProps } = this.props;
    let isModified = !isEqual(restProps.value, initialValue);
    return (
      <Fragment>
        <Label
          className={c('m-bottom-s', { bold: isModified, 'cursor-auto': nofocus })}
          htmlFor={this._id}
          onClick={this.handleLabelClick.bind(this)}>
          {label}
        </Label>
        {React.Children.map(children, (child, idx) => {
          const props = { ...restProps };
          if (idx === 0 && !nofocus) {
            props.id = this._id;
          }
          return React.cloneElement(child, Object.assign(props, child.props));
        })}
      </Fragment>
    );
  }
}

WithLabel.propTypes = {
  label: PropTypes.string.isRequired,
};

export default WithLabel;
