import React from 'react';
import Button from 'components/controls/Button';
import TextField from 'components/controls/TextField';
import TextareaField from 'components/controls/TextareaField';
import RadioButton from 'components/controls/RadioButton';
import Checkbox from 'components/controls/Checkbox';
import SwitchButton from 'components/controls/SwitchButton';
import { Link } from 'components/controls/Link';

export default function ControlsAndStates() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        gridGap: '16px 24px',
      }}>
      <div className="text-caps color-neutral-4 text-medium">Normal</div>
      <div className="text-caps color-neutral-4 text-medium">Hover</div>
      <div className="text-caps color-neutral-4 text-medium">Focus</div>
      <div className="text-caps color-neutral-4 text-medium">Disabled</div>

      <div>
        <Button>Button</Button>
      </div>
      <div>
        <Button className="--hover">Button</Button>
      </div>
      <div>
        <Button className="--focus">Button</Button>
      </div>
      <div>
        <Button disabled>Button</Button>
      </div>

      <div>
        <TextField placeholder="Placeholder" name="" onChange={() => {}} />
      </div>
      <div>
        <TextField placeholder="Placeholder" className="--hover" name="" onChange={() => {}} />
      </div>
      <div>
        <TextField className="--focus" value="Text field" name="" onChange={() => {}} />
      </div>
      <div>
        <TextField disabled value="Text field" name="" onChange={() => {}} />
      </div>

      <div>
        <TextareaField placeholder="Placeholder" name="" onChange={() => {}} />
      </div>
      <div>
        <TextareaField placeholder="Placeholder" className="--hover" name="" onChange={() => {}} />
      </div>
      <div>
        <TextareaField className="--focus" value="Textarea field" name="" onChange={() => {}} />
      </div>
      <div>
        <TextareaField disabled value="Textarea field" name="" onChange={() => {}} />
      </div>

      <div>
        <RadioButton name="" value="" checked={false} label="Radio button" onChange={() => {}} />
      </div>
      <div>
        <RadioButton className="--hover" name="" value="" checked={false} label="Radio button" onChange={() => {}} />
      </div>
      <div>
        <RadioButton className="--focus" name="" value="" checked={false} label="Radio button" onChange={() => {}} />
      </div>
      <div>
        <RadioButton disabled name="" value="" checked={false} label="Radio button" onChange={() => {}} />
      </div>

      <div>
        <RadioButton name="" value="" checked={true} label="Radio button" onChange={() => {}} />
      </div>
      <div>
        <RadioButton className="--hover" name="" value="" checked={true} label="Radio button" onChange={() => {}} />
      </div>
      <div>
        <RadioButton className="--focus" name="" value="" checked={true} label="Radio button" onChange={() => {}} />
      </div>
      <div>
        <RadioButton disabled name="" value="" checked={true} label="Radio button" onChange={() => {}} />
      </div>

      <div>
        <Checkbox name="" value="" checked={false} label="Checkbox" onChange={() => {}} />
      </div>
      <div>
        <Checkbox className="--hover" name="" value="" checked={false} label="Checkbox" onChange={() => {}} />
      </div>
      <div>
        <Checkbox className="--focus" name="" value="" checked={false} label="Checkbox" onChange={() => {}} />
      </div>
      <div>
        <Checkbox disabled name="" value="" checked={false} label="Checkbox" onChange={() => {}} />
      </div>

      <div>
        <Checkbox name="" value="" checked={true} label="Checkbox" onChange={() => {}} />
      </div>
      <div>
        <Checkbox className="--hover" name="" value="" checked={true} label="Checkbox" onChange={() => {}} />
      </div>
      <div>
        <Checkbox className="--focus" name="" value="" checked={true} label="Checkbox" onChange={() => {}} />
      </div>
      <div>
        <Checkbox disabled name="" value="" checked={true} label="Checkbox" onChange={() => {}} />
      </div>

      <div>
        <SwitchButton name="" value="" checked={false} right="Switch" onChange={() => {}} />
      </div>
      <div>
        <SwitchButton className="--hover" name="" value="" checked={false} right="Switch" onChange={() => {}} />
      </div>
      <div>
        <SwitchButton className="--focus" name="" value="" checked={false} right="Switch" onChange={() => {}} />
      </div>
      <div>
        <SwitchButton disabled name="" value="" checked={false} right="Switch" onChange={() => {}} />
      </div>

      <div>
        <SwitchButton name="" value="" checked={true} right="Switch" onChange={() => {}} />
      </div>
      <div>
        <SwitchButton className="--hover" name="" value="" checked={true} right="Switch" onChange={() => {}} />
      </div>
      <div>
        <SwitchButton className="--focus" name="" value="" checked={true} right="Switch" onChange={() => {}} />
      </div>
      <div>
        <SwitchButton disabled name="" value="" checked={true} right="Switch" onChange={() => {}} />
      </div>

      <div>
        <Link href="#">Link</Link>
      </div>
      <div>
        <Link className="--hover" href="#">
          Link
        </Link>
      </div>
      <div>
        <Link className="--focus" href="#">
          Link
        </Link>
      </div>
      <div />
    </div>
  );
}
