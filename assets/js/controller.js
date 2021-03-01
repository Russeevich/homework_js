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
        if (friendField !== undefined)
            return friendField.toLowerCase().includes(filter.toLowerCase())
    },
    setFilter(filter, fav = false) {
        return new Promise(res => {
            const filters = []

            if (!fav) {
                for (let item of this.peoples) {
                    if (item && this.filterFields(item.first_name, filter) || this.filterFields(item.last_name, filter)) {
                        filters.push(item)
                    }
                }
            } else {
                if (this.favorite.length > 0) {
                    for (let item of this.favorite) {
                        if (this.filterFields(item.first_name, filter) || this.filterFields(item.last_name, filter)) {
                            filters.push(item)
                        }
                    }
                }
            }

            if (filters.length < 1)
                res([{ err: 'Никто не соответсвует фильтру' }])
            else res(filters)
        })
    },
    setFavorite(id) {
        return new Promise(res => {
            const el = this.peoples.find(item => item.id == id),
                inFav = this.favorite.find(item => item.id == id)

            this.favorite.push({...el, close: true })
            this.peoples = this.peoples.filter(item => item.id != id)

            res('complite')

        })
    },
    unsetFavorite(id) {
        return new Promise(res => {
            const el = this.favorite.find(item => item.id == id),
                inPeo = this.peoples.find(item => item.id == id)

            this.peoples.push({...el, close: false })
            this.favorite = this.favorite.filter(item => item.id != id)

            res('complite')
        })
    },
    render(first, second) {
        return new Promise(res => {
            this.setFilter(first.value).then(item => {
                this.setFilter(second.value, true).then(items => {
                    res({ first: item, second: items })
                })
            })
        })
    }
}