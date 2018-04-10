import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      info: null,
    };
  }
  componentDidCatch(error, info) {
    this.setState({ error, info });
  }
  render() {
    const { error, info } = this.state;
    const componentStack = info ? info.componentStack : '';

    if (error) {
      return (
        <div>
          <div className="bold">{error.toString()}</div>
          <pre>{componentStack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
