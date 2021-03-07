export class People {
    constructor(filter) {
        this._people = []
        this.change = false
        this.filters = filter
    }

    isObject = (obj) => {
        return obj instanceof Object
    }

    get people() {
        return this._people
    }

    errorMessage = (err) => {
        throw new Error(err)
    }

    setPeople = (obj) => {
        if (this.isObject(obj)) {
            this._people.push(obj)
            this.change = true
        } else this.errorMessage('Это не объект')
    }

    setAll = (obj) => {
        this._people = obj
    }
}