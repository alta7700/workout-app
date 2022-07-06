import {makeAutoObservable} from "mobx";

export default class StudentsStore {

    constructor() {
        makeAutoObservable(this)
    }

}