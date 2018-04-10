import c from 'classnames';
import isEqual from 'lodash/isEqual';
import { isObject, merge } from 'object-state-storage';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import uuid from 'utils/uuid';

// creates object "{ path1: { path2: ... { pathN: value } } }"
export function wrap(path, value) {
  if (path.length > 0) {
    const key = path.pop();
    return wrap(path, { [key]: value });
  }
  return value;
}

// replaces all non-object values with provided value
export function replaceValues(obj, value) {
  let result = {};
  for (const key in obj) {
    if (isObject(obj[key])) {
      result[key] = replaceValues(obj[key], value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

// renders a list of errors
export class Errors extends Component {
  shouldComponentUpdate(nextProps) {
    const { list: nextList } = nextProps;
    const { list } = this.props;
    return !isEqual(nextList, list);
  }
  render() {
    const { list } = this.props;
    if (list.length === 0) {
      return null;
    }
    return (
      <ul className="h-s m-top-m list-dash">
        {list.map((item, idx) => {
          return <li key={idx}>{item}</li>;
        })}
      </ul>
    );
  }
}

Errors.propTypes = {
  list: PropTypes.array.isRequired,
};

// wrapper for single-element input (textarea, input, select)
// automatically adds some of the props
// OLD WITH VALIDATION
// export class Field extends Component {
//   constructor(props) {
//     super(props);
//     this.handleChange = this.handleChange.bind(this);
//     this.handleBlur = this.handleBlur.bind(this);
//     // so that there no collissions with other fields on a page
//     this.id = `${props.name}_${uuid()}`;
//   }
//   componentDidMount() {
//     const { name, value, validate, handleValidationError, errors } = this.props;
//     if (handleValidationError && validate) {
//       handleValidationError(name, [...errors, validate(value)]);
//     }
//   }
//   shouldComponentUpdate(nextProps) {
//     const { value: nextValue, initialValue: nextInitialValue, errors: nextErrors } = nextProps;
//     const { value, initialValue, errors } = this.props;
//     return !isEqual(value, nextValue) || !isEqual(initialValue, nextInitialValue) || !isEqual(errors, nextErrors);
//   }
//   handleBlur(evt) {
//     const { validate, handleValidationError } = this.props;
//     const { name, value } = evt.target;
//     window.clearTimeout(this.validationTimer);
//     if (handleValidationError && validate) {
//       handleValidationError(name, validate(value));
//     }
//   }
//   handleChange(evt) {
//     const { validate, handleValidationError, handleChange } = this.props;
//     const { name, value } = evt.target;
//     window.clearTimeout(this.validationTimer);
//     handleChange(evt);
//     if (handleValidationError && validate) {
//       this.validationTimer = window.setTimeout(function delayedValidation() {
//         handleValidationError(name, validate(value));
//       }, 300);
//     }
//   }
//   componentWillUnmount() {
//     window.clearTimeout(this.validationTimer);
//   }
//   render() {
//     const { label = null, render, name, value, initialValue, errors } = this.props;
//     const isModified = !isEqual(value, initialValue);
//     return (
//       <div className={c('m-bottom-l', { modified: isModified })}>
//         {React.Children.map(label, element =>
//           React.cloneElement(element, {
//             htmlFor: this.id,
//             className: 'm-bottom-s',
//           })
//         )}
//         {React.Children.map(render, element =>
//           React.cloneElement(element, {
//             onChange: this.handleChange,
//             onBlur: this.handleBlur,
//             name,
//             id: this.id,
//             value,
//           })
//         )}
//         <Errors list={errors} />
//       </div>
//     );
//   }
// }

// Field.propTypes = {
//   label: PropTypes.element,
//   render: PropTypes.element.isRequired,
//   name: PropTypes.string.isRequired,
//   value: PropTypes.string.isRequired,
//   initialValue: PropTypes.string.isRequired,
//   errors: PropTypes.array.isRequired,
//   handleChange: PropTypes.func.isRequired,
//   validate: PropTypes.func,
//   handleValidationError: PropTypes.func,
// };

// handles label-input unique ids, some default styling
export class Field extends Component {
  constructor(props) {
    super(props);
    // so that there no collissions with other fields on a page
    this.id = `${props.name}_${uuid()}`;
  }
  shouldComponentUpdate(nextProps) {
    const { value: nextValue, initialValue: nextInitialValue, errors: nextErrors } = nextProps;
    const { value, initialValue, errors } = this.props;
    return !isEqual(value, nextValue) || !isEqual(initialValue, nextInitialValue) || !isEqual(errors, nextErrors);
  }
  render() {
    const { label = null, input, name, value, initialValue, errors, handleChange } = this.props;
    const isModified = !isEqual(value, initialValue);
    return (
      <div className={c('m-bottom-l', { modified: isModified })}>
        {React.Children.map(label, element =>
          React.cloneElement(element, {
            htmlFor: this.id,
            className: 'm-bottom-s',
          })
        )}
        {React.Children.map(input, element =>
          React.cloneElement(element, {
            onChange: handleChange,
            name,
            id: this.id,
            value,
          })
        )}
        <Errors list={errors} />
      </div>
    );
  }
}

export class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: this.props.initialValue,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleSubmit(evt) {
    evt.preventDefault();
    if (this.props.handleSubmit) {
      this.props.handleSubmit(this.state.fields);
    }
  }
  handleReset() {
    // this.setState(this.props.initialValue);
    throw new Error('handleReset() is not implemented');
  }
  handleChange(evt) {
    const { type, name, value, checked } = evt.target;
    const path = ['fields', ...name.split('.')];
    this.setState(prevState => {
      if (type === 'checkbox') {
        return merge(prevState, wrap(path, { [value]: checked }));
      } else {
        return merge(prevState, wrap(path, value));
      }
    });
  }
  // handleValidationError(name, value) {
  //   const path = ['errors', ...name.split('.')];
  //   this.setState(prevState => {
  //     return merge(prevState, wrap(path, value));
  //   });
  // }
  render() {
    return null;
  }
}

Form.propTypes = {
  initialValue: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};
