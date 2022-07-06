import {Context} from "../index";
import {useContext} from "react";

const useFetching = (callback) => {

    const {loading} = useContext(Context)

    return async (...props) => {
        let key = loading.startFetching();
        // const sleep = ms => new Promise(r => setTimeout(r, ms));
        // await sleep(300)
        let response = await callback(...props)
        loading.endFetching(key)
        return response
    }
};

export default useFetching;