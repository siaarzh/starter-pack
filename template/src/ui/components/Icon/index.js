import c from 'classnames';
import React from 'react';

import s from './styles.css';

const Icon = props => {
  const { className, name, style = {} } = props;
  return (
    <div className={c('iconw-m iconh-m', s.icon, className)} style={style}>
      <svg
        className={c(s.svg)}
        preserveAspectRatio="xMidYMid meet"
        dangerouslySetInnerHTML={{
          __html: `<use xlink:href='#${name}'></use>`,
        }}
      />
    </div>
  );
};

export default Icon;
