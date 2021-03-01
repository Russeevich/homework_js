import model from "./model.js"
import view from "./view.js"

export default {
    peoples: [],
    favorite: [],
    async getList() {
        const friend = JSON.parse(localStorage.getItem('peoples'))
        if (!friend) {
            const friends = await model.getFriends({ fields: "photo_100" })
            return friends.items
        } else {
            return friend
        }
    },
    checkFav() {
        const fav = JSON.parse(localStorage.getItem('favorite'))
        if (fav) {
            this.favorite = [...fav]
            return JSON.parse(localStorage.getItem('favorite'))
        }
    },
    setList(input, output, items) {
        const results = document.getElementById(input)
        results.innerHTML = view.render(output, items)
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
            const el = this.peoples.find(item => item.id == id)

            if (!el)
                return

            this.favorite.push({...el, close: true })
            this.peoples = this.peoples.filter(item => item.id != id)

            localStorage.setItem('peoples', JSON.stringify(this.peoples))
            localStorage.setItem('favorite', JSON.stringify(this.favorite))

            res('complite')

        })
    },
    unsetFavorite(id) {
        return new Promise(res => {
            const el = this.favorite.find(item => item.id == id)

            if (!el)
                return

            this.peoples.push({...el, close: false })
            this.favorite = this.favorite.filter(item => item.id != id)

            localStorage.setItem('peoples', JSON.stringify(this.peoples))
            localStorage.setItem('favorite', JSON.stringify(this.favorite))

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