import React from 'react';
import classes from "../ItemTables.module.css";
import classNames from "classnames";

const Paginator = ({activePage, setActivePage, pagesCount}) => {

    const LEFT_PAGE = 'LEFT'
    const RIGHT_PAGE = 'RIGHT'

    const range = (from, to, step = 1) => {
        let i = from;
        const array = [];
        while (i <= to) {
            array.push(i);
            i += step;
        }
        return array
    }

    const fetchPageNumbers = () => {
        const totalPages = pagesCount;
        const currentPage = activePage.page;
        const pageNeighbours = 2;

        const totalNumbers = pageNeighbours * 2 + 3;
        const totalBlocks = totalNumbers + 2;

        if (totalPages > totalBlocks) {
            const startPage = Math.max(2, currentPage - pageNeighbours);
            const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);
            let pages = range(startPage, endPage);

            /**
             * hasLeftSpill: has hidden pages to the left
             * hasRightSpill: has hidden pages to the right
             * spillOffset: number of hidden pages either to the left or to the right
             */
            const hasLeftSpill = startPage > 2;
            const hasRightSpill = (totalPages - endPage) > 1;
            const spillOffset = totalNumbers - (pages.length + 1);

            switch (true) {
                // handle: (1) < {5 6} [7] {8 9} (10)
                case (hasLeftSpill && !hasRightSpill): {
                    const extraPages = range(startPage - spillOffset, startPage - 1);
                    pages = [LEFT_PAGE, ...extraPages, ...pages];
                    break;
                }

                // handle: (1) {2 3} [4] {5 6} > (10)
                case (!hasLeftSpill && hasRightSpill): {
                    const extraPages = range(endPage + 1, endPage + spillOffset);
                    pages = [...pages, ...extraPages, RIGHT_PAGE];
                    break;
                }

                // handle: (1) < {4 5} [6] {7 8} > (10)
                case (hasLeftSpill && hasRightSpill):
                default: {
                    pages = [LEFT_PAGE, ...pages, RIGHT_PAGE];
                    break;
                }
            }
            return [1, ...pages, totalPages];
        }
        return range(1, totalPages);
    }

    return (
        <div className={classes.pages}>
            {fetchPageNumbers().map(page =>
                page === LEFT_PAGE ?
                    <span
                        key={page}
                        className={classes.page}
                        onClick={() => setActivePage(prev => {return {page: prev.page - 3, firstTime: false}})}
                    >&laquo;</span>
                : page === RIGHT_PAGE ?
                    <span
                        key={page}
                        className={classes.page}
                        onClick={() => setActivePage(prev => {return {page: prev.page + 3, firstTime: false}})}
                    >&raquo;</span>
                    : <span
                        key={page}
                        onClick={() => setActivePage({page: page, firstTime: false})}
                        className={activePage.page === page ? classNames(classes.page, classes.active) : classes.page}
                    >
                        {page}
                    </span>
            )}
        </div>
    );
};

export default Paginator;