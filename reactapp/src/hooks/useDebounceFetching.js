import {useCallback, useRef} from "react";
import useFetching from "./useFetching";

export default function useDebounceFetching(asyncCallback, delay) {

    const timer = useRef()
    const callback = useFetching(asyncCallback)

    return useCallback((...args) => {
        if (timer.current) {
            clearTimeout(timer.current)
        }
        timer.current = setTimeout(() => {
            callback(...args)
        }, delay)
    }, [callback, delay])
}