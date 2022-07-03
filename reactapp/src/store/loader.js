import {makeAutoObservable} from "mobx";

export default class LoaderStore {

    constructor() {
        makeAutoObservable(this)
    }

    state = false
    fetching = []

    updateState() {
        this.state = this.fetching.length === 0
    }

    startFetching() {
        let key = Date.now() / (Math.random() * 100000)
        this.fetching.push(key)
        this.updateState()
        return key
    }
    endFetching(key) {
        console.log('closing')
        this.fetching = this.fetching.filter(v => v !== key)
        this.updateState()
    }
}