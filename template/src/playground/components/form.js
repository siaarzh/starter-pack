import { Consumer } from 'components-di';
import Form from 'components/Form';
import Button from 'components/Form/Button';
import Input from 'components/Form/Input';
import WithErrors from 'components/Form/WithErrors';
import WithLabel from 'components/Form/WithLabel';
import React from 'react';

import { addComponent } from '../Session.js';

class ExampleForm extends Form {
  render() {
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <div className="m-bottom-m">
          <WithErrors errors={this.errorsFor('input')}>
            <WithLabel
              label="Text input"
              name="input"
              value={this.valueFor('input')}
              initialValue={this.initialValueFor('input')}>
              <Input className="landscape-m" onChange={this.handleChange.bind(this)} />
            </WithLabel>
          </WithErrors>
        </div>
        <Button className="landscape-m" type="submit">
          Submit
        </Button>
      </form>
    );
  }
}

function mapper({ context, actions }) {
  return {
    ...context.session.store.state.form,
    onSubmit: actions.handleSubmit,
  };
}

addComponent(
  'form',
  <div className="box-xl">
    <h1 className="m-bottom-m">Form example</h1>
    <Consumer mapper={mapper}>
      <ExampleForm />
    </Consumer>
  </div>,
  {
    form: {
      fields: {
        input: 'default value',
      },
      errors: {
        input: ['Example error'],
      },
    },
  },
  {
    handleSubmit: function handleSubmit(context, fields) {
      context.session.store.setState(() => ({ form: { fields } }));
    },
  }
);
