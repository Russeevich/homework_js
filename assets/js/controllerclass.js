import { View } from './viewclass.js';
import { Model } from './modelclass.js';
import { People } from './people.js';

export class Controller {
    constructor(id, firstOut, secondOut, firstFil, secondFil) {
        this.model = new Model(id)
        this._peoples = new People(firstFil)
        this._favorite = new People(secondFil)
        this._firstOut = firstOut
        this._secondOut = secondOut
        this.model.login()
        this.inputChange()
    }

    inputChange = () => {
        this._peoples.filters.addEventListener('input', () => {
            this._peoples.change = true
            this.draw()
        })

        this._favorite.filters.addEventListener('input', () => {
            this._favorite.change = true
            this.draw()
        })

        this._firstOut.addEventListener('drop', e => {
            const id = e.dataTransfer.getData('text'),
                people = this._favorite._people.find(item => item.id == id)

            this.setPeople({...people, close: false })
            this.deleteItem(people)

            this.draw()

            e.preventDefault()
        })

        this._firstOut.addEventListener('dragover', e => {
            e.preventDefault()
        })

        this._secondOut.addEventListener('drop', e => {
            const id = e.dataTransfer.getData('text'),
                people = this._peoples._people.find(item => item.id == id)

            this.setFavorite({...people, close: true })
            this.deleteItem(people)

            this.draw()

            e.preventDefault()
        })

        this._secondOut.addEventListener('dragover', e => {
            e.preventDefault()
        })
    }

    filterFields(friendField, filter) {
        return friendField !== undefined ? friendField.toLowerCase().includes(filter.toLowerCase()) : false
    }

    filter = (filter) => {
        const filters = []

        filter.people.forEach(item => {
            if (this.filterFields(item.first_name, filter.filters.value) || this.filterFields(item.last_name, filter.filters.value))
                filters.push(item)
        })

        return filters
    }

    deleteItem = (item) => {
        if (this._peoples.change && item) {
            this._favorite.setAll(this._favorite.people.filter(obj => obj.id != item.id))
            this._favorite.change = true
        } else if (this._favorite.change && item) {
            this._peoples.setAll(this._peoples.people.filter(obj => obj.id != item.id))
            this._peoples.change = true
        }
    }

    closeBtn = (e) => {
        const id = e.target.parentNode.id,
            item = this._favorite.people.find(obj => obj.id == id)

        this.setPeople({...item, close: false })
        this.deleteItem(item)

        this.draw()

        e.preventDefault()
    }

    moveBtn = (e) => {
        const id = e.target.parentNode.id,
            item = this._peoples.people.find(obj => obj.id == id)

        this.setFavorite({...item, close: true })
        this.deleteItem(item)

        this.draw()

        e.preventDefault()
    }

    setEvent = () => {
        const close = document.querySelectorAll('.friends__close'),
            move = document.querySelectorAll('.friends__move'),
            friends = document.querySelectorAll('.friends__item')

        if (close) {
            close.forEach(item => {
                item.addEventListener('click', e => this.closeBtn(e))
            })
        }

        if (move) {
            move.forEach(item => {
                item.addEventListener('click', e => this.moveBtn(e))
            })
        }

        friends.forEach(item => {
            item.addEventListener('dragstart', e => {
                e.dataTransfer.setData('text/plain', e.target.id)
            })
        })
    }

    draw = () => {
        if (this._peoples.change) {
            this._firstOut.innerHTML = View.render('friends', this.filter(this._peoples))
            this._peoples.change = false
        }
        if (this._favorite.change) {
            this._secondOut.innerHTML = View.render('friends', this.filter(this._favorite))
            this._favorite.change = false
        }

        this.setEvent()
    }

    setPeople = (obj) => this._peoples.setPeople(obj)


    setFavorite = (obj) => this._favorite.setPeople(obj)

    getList() {
        return new Promise(res => {
            const friend = JSON.parse(localStorage.getItem('peoples'))
            if (!friend) {
                friend = this.model.getFriends({ fields: "photo_100" })
                res(friend.items)
            } else {
                res(friend)
            }
        })
    }
}