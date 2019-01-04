import React from 'react';
import PropTypes from 'prop-types';

const Table = ({titles, children}) => (
  <table className="table is-hoverable is-fullwidth">
    <thead>
      <tr>
        {titles.map(title => (
          <th key={title}>{title}</th>
        ))}
      </tr>
    </thead>
    <tbody>{children}</tbody>
  </table>
);

Table.propTypes = {
  titles: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.node.isRequired,
};

export default Table;
