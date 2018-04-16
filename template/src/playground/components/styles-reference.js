import { LinkTo } from 'components/Link';
import React from 'react';

import { addComponent } from '../Session.js';

const pink = { background: 'pink' };
const cyan = { background: 'lightcyan' };
const note = { background: 'cornsilk' };

const tomato = { color: 'tomato' };
const limegreen = { color: 'limegreen' };
const deepskyblue = { color: 'deepskyblue' };
const orange = { color: 'orange' };

const color = {
  display: 'inline-block',
  background: 'currentColor',
  width: '6rem',
  height: '6rem',
  borderRadius: '50%',
  border: '1px solid black',
};

addComponent('styles reference', () => (
  <div className="box-xl">
    <div className="m-bottom-l">
      <LinkTo page="playground" className="ff-mono">
        {'> PL4YGR0UND 👾'}
      </LinkTo>
    </div>
    <h1 className="m-bottom-m">Font sizes and line heights</h1>
    <div className="box-m m-bottom-m" style={note}>
      <b>Note:</b> keep in mind multicolumn combinations and vertical rhythm
    </div>
    <ul className="m-bottom-xl">
      {Array.apply(null, { length: 3 }).map((_, i) => (
        <li key={`${i}`} className="h-xl ff-heading" style={pink}>
          The quick brown fox jumps over the lazy dog (h1, .h1, .h-xl)
        </li>
      ))}
      {Array.apply(null, { length: 3 }).map((_, i) => (
        <li key={`${i}`} className="h-l ff-heading" style={cyan}>
          The quick brown fox jumps over the lazy dog (h2, .h2, .h-l)
        </li>
      ))}
      {Array.apply(null, { length: 3 }).map((_, i) => (
        <li key={`${i}`} className="h-m" style={pink}>
          The quick brown fox jumps over the lazy dog (h3, .h3, .h-m)
        </li>
      ))}
      {Array.apply(null, { length: 3 }).map((_, i) => (
        <li key={`${i}`} className="h-s" style={cyan}>
          The quick brown fox jumps over the lazy dog (h4, .h4, .h-s)
        </li>
      ))}
    </ul>

    <h1 className="m-bottom-m">Space units</h1>
    <div>
      .(<span style={tomato}>p</span> | <span style={limegreen}>m</span>)-(<span style={tomato}>top</span> |{' '}
      <span style={limegreen}>bottom</span> | <span style={deepskyblue}>left</span> | <span style={orange}>right</span>)-xs
      <div className="overflow-hidden m-bottom-m" style={pink}>
        <div style={{ height: 0, width: '8rem' }} className="m-bottom-xs" />
      </div>
      .(<span style={tomato}>p</span> | <span style={limegreen}>m</span>)-(<span style={tomato}>top</span> |{' '}
      <span style={limegreen}>bottom</span> | <span style={deepskyblue}>left</span> | <span style={orange}>right</span>)-s
      <div className="overflow-hidden m-bottom-m" style={pink}>
        <div style={{ height: 0, width: '8rem' }} className="m-bottom-s" />
      </div>
      .(<span style={tomato}>p</span> | <span style={limegreen}>m</span>)-(<span style={tomato}>top</span> |{' '}
      <span style={limegreen}>bottom</span> | <span style={deepskyblue}>left</span> | <span style={orange}>right</span>)-m
      <div className="overflow-hidden m-bottom-m" style={pink}>
        <div style={{ height: 0, width: '8rem' }} className="m-bottom-m" />
      </div>
      .(<span style={tomato}>p</span> | <span style={limegreen}>m</span>)-(<span style={tomato}>top</span> |{' '}
      <span style={limegreen}>bottom</span> | <span style={deepskyblue}>left</span> | <span style={orange}>right</span>)-l
      <div className="overflow-hidden m-bottom-m" style={pink}>
        <div style={{ height: 0, width: '8rem' }} className="m-bottom-l" />
      </div>
      .(<span style={tomato}>p</span> | <span style={limegreen}>m</span>)-(<span style={tomato}>top</span> |{' '}
      <span style={limegreen}>bottom</span> | <span style={deepskyblue}>left</span> | <span style={orange}>right</span>)-xl
      <div className="overflow-hidden m-bottom-xl" style={pink}>
        <div style={{ height: 0, width: '8rem' }} className="m-bottom-xl" />
      </div>
    </div>

    <h1 className="m-bottom-m">Containers</h1>
    <div className="m-bottom-m">
      <div className="inline-block box-xs" style={pink}>
        <div style={{ background: 'white', width: '8rem' }}>.box-xs</div>{' '}
      </div>
    </div>
    <div className="m-bottom-m">
      <div className="inline-block box-s" style={pink}>
        <div style={{ background: 'white', width: '8rem' }}>.box-s</div>{' '}
      </div>
    </div>
    <div className="m-bottom-m">
      <div className="inline-block box-m" style={pink}>
        <div style={{ background: 'white', width: '8rem' }}>.box-m</div>{' '}
      </div>
    </div>
    <div className="m-bottom-m">
      <div className="inline-block box-l" style={pink}>
        <div style={{ background: 'white', width: '8rem' }}>.box-l</div>{' '}
      </div>
    </div>
    <div className="m-bottom-m">
      <div className="inline-block box-xl" style={pink}>
        <div style={{ background: 'white', width: '8rem' }}>.box-xl</div>{' '}
      </div>
    </div>
    <div className="m-bottom-m">
      <div className="inline-block landscape-xs" style={pink}>
        <div style={{ background: 'white', width: '8rem' }}>.landscape-xs</div>{' '}
      </div>
    </div>
    <div className="m-bottom-m">
      <div className="inline-block landscape-s" style={pink}>
        <div style={{ background: 'white', width: '8rem' }}>.landscape-s</div>{' '}
      </div>
    </div>
    <div className="m-bottom-m">
      <div className="inline-block landscape-m" style={pink}>
        <div style={{ background: 'white', width: '8rem' }}>.landscape-m</div>{' '}
      </div>
    </div>
    <div className="m-bottom-m">
      <div className="inline-block landscape-l" style={pink}>
        <div style={{ background: 'white', width: '8rem' }}>.landscape-l</div>{' '}
      </div>
    </div>
    <div className="m-bottom-xl">
      <div className="inline-block landscape-xl" style={pink}>
        <div style={{ background: 'white', width: '8rem' }}>.landscape-xl</div>{' '}
      </div>
    </div>

    <h1 className="m-bottom-m">Colors</h1>

    <div className="m-bottom-m">
      <div className="color-neutral-0 m-right-m" style={color} />
      <div className="color-neutral-1 m-right-m" style={color} />
      <div className="color-neutral-2 m-right-m" style={color} />
      <div className="color-neutral-3 m-right-m" style={color} />
      <div className="color-neutral-4 m-right-m" style={color} />
      <div className="color-neutral-5 m-right-m" style={color} />
    </div>

    <div className="m-bottom-m">
      <div className="color-accent-1 m-right-m" style={color} />
    </div>
  </div>
));
