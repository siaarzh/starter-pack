import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import renderIf from 'utils/renderIf';

function WithErrors({ errors = [], children }) {
  return (
    <Fragment>
      {children}
      {renderIf(errors.length > 0, () => (
        <ul className="h-s m-top-s list-dash">
          {errors.map((err, idx) => {
            return <li key={idx}>{err}</li>;
          })}
        </ul>
      ))}
    </Fragment>
  );
}

WithErrors.propTypes = {
  errors: PropTypes.array.isRequired,
};

export default WithErrors;
