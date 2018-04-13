import c from 'classnames';
import Label from 'components/Form/Label';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import uuid from 'utils/uuid';

class WithLabel extends Component {
  constructor(props) {
    super(props);
    this._id = uuid();
  }
  render() {
    const { label, initialValue, children, ...restProps } = this.props;
    let isModified = false;
    if (initialValue !== undefined && restProps.value !== undefined) {
      isModified = restProps.value !== initialValue;
    }
    return (
      <Fragment>
        <Label className={c('m-bottom-s', { bold: isModified })} htmlFor={this._id}>
          {label}
        </Label>
        {React.Children.map(children, child => React.cloneElement(child, { id: this._id, ...restProps }))}
      </Fragment>
    );
  }
}

WithLabel.propTypes = {
  label: PropTypes.string.isRequired,
};

export default WithLabel;
