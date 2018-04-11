import Button from 'components/Button';
import React from 'react';
import { addComponent } from '../Session.js';

addComponent(
  'buttons',
  <div className="box-xl">
    <Button className="landscape-m">Hello button</Button>
  </div>
);
