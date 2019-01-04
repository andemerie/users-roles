import React from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from 'react-paginate';

const Paginate = ({ pageCount, initialPage, onPageChange }) => (
  <nav className="pagination" role="navigation" aria-label="pagination">
    <ReactPaginate
      pageCount={pageCount}
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      initialPage={initialPage}
      containerClassName="pagination-list"
      pageLinkClassName="pagination-link"
      activeLinkClassName="is-current"
      previousLabel="Previous"
      previousLinkClassName="pagination-previous"
      nextLabel="Next"
      nextLinkClassName="pagination-next"
      breakLabel="..."
      breakClassName="pagination-ellipsis"
      onPageChange={onPageChange}
    />
  </nav>
);

Paginate.propTypes = {
  pageCount: PropTypes.number.isRequired,
  initialPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Paginate;
