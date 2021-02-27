import model from "./model.js"
import view from "./view.js"

export default {
    peoples: [],
    favorite: [],
    async getList() {
        const friends = await model.getFriends({ fields: "photo_100" })
        return friends.items
    },
    setList(input, output, items) {
        return new Promise(res => {
            const results = document.getElementById(input)
            results.innerHTML = view.render(output, items)
            res('complite')
        })
    },
    setFriends(friends) {
        this.peoples = [...friends]
    },
    filterFields(friendField, filter) {
        return friendField.toLowerCase().includes(filter.toLowerCase())
    },
    setFilter(filter, fav = false) {
        return new Promise((res, rej) => {
            const filters = []

            if (!fav) {
                for (let item of this.peoples) {
                    if (this.filterFields(item.first_name, filter) || this.filterFields(item.last_name, filter)) {
                        filters.push(item)
                    }
                }
            } else {
                for (let item of this.favorite) {
                    if (this.filterFields(item.first_name, filter) || this.filterFields(item.last_name, filter)) {
                        filters.push(item)
                    }
                }
            }

            if (filters.length < 1)
                rej('Никто не соответствует фильтру')
            else res(filters)
        })
    },
    setFavorite(id, filter) {
        return new Promise(res => {
            const index = this.peoples.findIndex(item => item.id == id),
                el = this.peoples.find(item => item.id == id)

            this.favorite.push({...el, close: true })
            this.peoples.splice(index, 1)
            this.setFilter(filter.value).then(e => {
                res({ first: e, second: this.favorite })
            })
        })
    },
    unsetFavorite(id, filter) {
        return new Promise(res => {
            const index = this.favorite.findIndex(item => item.id == id),
                el = this.favorite.find(item => item.id == id)

            this.peoples.push({...el, close: false })
            this.favorite.splice(index, 1)
            if (filter.value)
                this.setFilter(filter.value, true).then(e => {
                    res({ first: e, second: this.peoples })
                }).catch(err => res({ first: [{ err }], second: this.peoples }))
            else res({ first: this.favorite, second: this.peoples })
        })
    }
}