import c from 'classnames';
import { StaticConsumer } from 'components-di';
import WithBackdrop from 'components/WithBackdrop';
import React from 'react';

import s from './styles.css';

export function Link({ children, container = {}, backdrop = {}, className, ...restProps }) {
  container.className = ((container.className || '') + ` inline-block ${s.container || ''}`).trim();
  backdrop.className = ((backdrop.className || '') + s.backdrop).trim();
  return (
    <WithBackdrop container={container} backdrop={backdrop}>
      <a className={c('relative z1 cursor-pointer', s.link, className)} {...restProps}>
        {children}
      </a>
    </WithBackdrop>
  );
}

function mapper({ context }) {
  return {
    urlFor: context.session.urlFor,
    historyPushPage: context.session.historyPushPage,
  };
}

function WithRouterActions({ urlFor, historyPushPage, pagename, data, children }) {
  const href = urlFor(pagename, data);
  function onClick(evt) {
    evt.preventDefault();
    historyPushPage(pagename, data);
  }
  return React.Children.map(children, child => React.cloneElement(child, { href, onClick }));
}

export function LinkTo({ children, page, data, ...restProps }) {
  return (
    <StaticConsumer mapper={mapper}>
      <WithRouterActions pagename={page} data={data}>
        <Link {...restProps}>{children}</Link>
      </WithRouterActions>
    </StaticConsumer>
  );
}
