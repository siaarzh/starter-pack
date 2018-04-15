import { Consumer } from 'components-di';
import Form from 'components/Form';
import Button from 'components/Form/Button';
import Checkbox from 'components/Form/Checkbox';
import Input from 'components/Form/Input';
import Radio from 'components/Form/Radio';
import Select from 'components/Form/Select';
import Textarea from 'components/Form/Textarea';
import Toggle from 'components/Form/Toggle';
import WithErrors from 'components/Form/WithErrors';
import WithLabel from 'components/Form/WithLabel';
import { LinkTo } from 'components/Link';
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
        <div className="m-bottom-m">
          <WithErrors errors={this.errorsFor('textarea')}>
            <WithLabel
              label="Textarea"
              name="textarea"
              value={this.valueFor('textarea')}
              initialValue={this.initialValueFor('textarea')}>
              <Textarea className="landscape-m" onChange={this.handleChange.bind(this)} />
            </WithLabel>
          </WithErrors>
        </div>
        <div className="m-bottom-m">
          <WithErrors errors={this.errorsFor('select')}>
            <WithLabel
              label="Select"
              name="select"
              value={this.valueFor('select')}
              initialValue={this.initialValueFor('select')}>
              <Select
                className="landscape-m"
                options={['a', 'b', 'c']}
                labels={{ a: 'Label for a', b: 'Label for b' }}
                onChange={this.handleChange.bind(this)}
              />
            </WithLabel>
          </WithErrors>
        </div>
        <div className="m-bottom-m">
          <WithErrors errors={this.errorsFor('checkbox')}>
            <WithLabel
              nofocus
              label="Checkbox"
              name="checkbox"
              value={this.valueFor('checkbox')}
              initialValue={this.initialValueFor('checkbox')}
              onChange={this.handleChange.bind(this)}>
              <Checkbox container={{ className: 'm-bottom-m' }} checked={this.valueFor('checkbox.a')} value="a">
                Value a
              </Checkbox>
              <Checkbox checked={this.valueFor('checkbox.b')} value="b">
                Value b
              </Checkbox>
            </WithLabel>
          </WithErrors>
        </div>
        <div className="m-bottom-m">
          <WithErrors errors={this.errorsFor('radio')}>
            <WithLabel
              nofocus
              label="Radio"
              name="radio"
              value={this.valueFor('radio')}
              initialValue={this.initialValueFor('radio')}
              onChange={this.handleChange.bind(this)}>
              <Radio container={{ className: 'm-bottom-m' }} checked={this.valueFor('radio') === 'a'} value="a">
                Value a
              </Radio>
              <Radio checked={this.valueFor('radio') === 'b'} value="b">
                Value b
              </Radio>
            </WithLabel>
          </WithErrors>
        </div>
        <div className="m-bottom-m">
          <WithErrors errors={this.errorsFor('toggle')}>
            <WithLabel
              nofocus
              label="Toggle"
              value={this.valueFor('toggle')}
              initialValue={this.valueFor('toggle')}
              onChange={this.handleChange.bind(this)}>
              <Toggle name="toggle" checked={this.valueFor('toggle')}>
                Toggle?
              </Toggle>
            </WithLabel>
          </WithErrors>
        </div>
        <div className="m-bottom-m">
          <WithErrors errors={this.errorsFor('toggle')}>
            <WithLabel
              nofocus
              label="Deep toggle"
              value={this.valueFor('deep.toggle')}
              initialValue={this.valueFor('deep.toggle')}
              onChange={this.handleChange.bind(this)}>
              <Toggle name="deep.toggle" checked={this.valueFor('deep.toggle')}>
                Deep Toggle?
              </Toggle>
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
    <div className="m-bottom-l">
      <LinkTo page="playground" className="ff-mono">
        {'> PL4YGR0UND '}
        <span role="img" aria-label="Alien Monster">
          👾
        </span>
      </LinkTo>
    </div>
    <h1 className="m-bottom-m">Form example</h1>
    <Consumer mapper={mapper}>
      <ExampleForm />
    </Consumer>
  </div>,
  {
    form: {
      fields: {
        input: 'default value',
        textarea: '',
        checkbox: {
          a: false,
          b: true,
        },
        radio: 'a',
        toggle: false,
        deep: {
          toggle: false,
        },
      },
      errors: {
        input: ['Example error'],
        textarea: [],
      },
    },
  },
  {
    handleSubmit: function handleSubmit(context, fields) {
      context.session.store.setState(() => ({ form: { fields } }));
    },
  }
);
