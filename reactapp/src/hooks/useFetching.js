import {Context} from "../index";
import {useContext} from "react";

const useFetching = (callback) => {

    const {loading} = useContext(Context)

    return async () => {
        let key = loading.startFetching()
        await callback()
        loading.endFetching(key)
    }

};

export default useFetching;