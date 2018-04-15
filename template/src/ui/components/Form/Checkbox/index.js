import c from 'classnames';
import { isEqual } from 'components-di';
import Icon from 'components/Icon';
import WithBackdrop from 'components/WithBackdrop';
import React, { Component } from 'react';
import renderIf from 'utils/renderIf';

import s from './styles.css';

export default class Checkbox extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const { children: curChildren, ...propsButChildren } = this.props;
    const { children: nextChildren, ...nextPropsButChildren } = nextProps;
    return !isEqual(propsButChildren, nextPropsButChildren) || !isEqual(this.state, nextState);
  }
  render() {
    const { checked, children, container = {}, ...restProps } = this.props;
    return (
      <label className={c('block max-content cursor-pointer', s.container, container.className)}>
        <input type="checkbox" checked={checked} {...restProps} />
        <WithBackdrop container={{ className: s.checkbox }} backdrop={{ className: s['checkbox-backdrop'] }}>
          {renderIf(checked, <Icon name="svg-checkmark" />)}
        </WithBackdrop>
        {children}
      </label>
    );
  }
}

// class Checkbox extends Component {
//   render() {
//     const { name, checked, initialChecked, handleChange, value, className, children } = this.props;
//     const isModified = checked !== initialChecked;
//     return (
//       <div className={c({ modified: isModified })}>
//         <label className={className}>
//           <input name={name} type="checkbox" value={value} checked={checked} onChange={handleChange} />
//           <div className={c(s.checkbox, 'iconw-m iconh-m m-right-s')}>
//             {renderIf(checked, <Icon name="svg-checkmark" />)}
//             <div className={s.backdrop} />
//           </div>
//           {children}
//         </label>
//       </div>
//     );
//   }
// }

// export default Checkbox;
