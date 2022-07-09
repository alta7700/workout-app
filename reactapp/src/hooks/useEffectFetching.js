import useFetching from "./useFetching";
import {useEffect} from "react";

const useEffectFetching = (asyncCallback, deps) => {

    const callback = useFetching(asyncCallback)

    return useEffect(() => {
        callback()
    }, deps)
}

export default useEffectFetching;