import get from 'lodash.get';
import { merge } from 'object-state-storage';
import { Component } from 'react';

// creates object "{ path1: { path2: ... { pathN: value } } }"
export function deposit(value, path) {
  if (path.length > 0) {
    const key = path.pop();
    return deposit({ [key]: value }, path);
  }
  return value;
}

export function modifierFor(evt) {
  const { type, name, value, checked } = evt.target;
  const path = name.split('.');
  if (type === 'checkbox') {
    return deposit({ [value]: checked }, path);
  } else {
    return deposit(value, path);
  }
}

export default class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: props.fields,
    };
  }
  initialValueFor(name) {
    return get(this.props.fields, name);
  }
  valueFor(name) {
    return get(this.state.fields, name);
  }
  errorsFor(name) {
    return get(this.props.errors, name, []);
  }
  handleChange(evt) {
    const modifier = modifierFor(evt);
    this.setState(state => {
      return merge(state, { fields: modifier });
    });
  }
  onSubmit(evt) {
    evt.preventDefault();
    this.props.onSubmit(this.state.fields);
  }
}
