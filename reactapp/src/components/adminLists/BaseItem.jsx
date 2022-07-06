import React, {useState} from 'react';
import classes from "./BaseList.module.css";
import classNames from "classnames";

const BaseItem = ({main, expand}) => {

    const [expanded, setExpanded] = useState(false)

    return (
        <div className={classes.item}>
            <div
                className={expanded ? classNames(classes.arrow, classes.expanded): classes.arrow}
                onClick={() => setExpanded(prevState => !prevState)}
            ><span/></div>
            <div className={classes.info}>
                {main}
                {expanded && expand}
            </div>
        </div>
    );
};

export default BaseItem;