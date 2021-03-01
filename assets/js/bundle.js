import controller from "./controller.js"
import model from "./model.js"
import view from "./view.js"

const setEvent = () => {
    const mvBtn = document.querySelectorAll('.friends__move'),
        firstFilter = document.getElementById('firstFilter'),
        clBtn = document.querySelectorAll('.friends__close'),
        secondFilter = document.getElementById('secondFilter'),
        items = document.querySelectorAll('.friends__item')
    mvBtn.forEach(item => {
        item.addEventListener('click', (e) => {
            const id = e.target.parentNode.id
            setFav(id, firstFilter, secondFilter)
        })
    })

    clBtn.forEach(item => {
        item.addEventListener('click', (e) => {
            const id = e.target.parentNode.id
            unsetFav(id, firstFilter, secondFilter)
        })
    })

    items.forEach(item => {
        item.addEventListener('dragstart', onDragStart)
    })
}

const setFav = (id, first, second) => {
    controller.setFavorite(id).then(() => {
        controller.render(first, second).then(items => {
            controller.setList('friendsFirst', 'friends', items.first)
            controller.setList('friendsSecond', 'friends', items.second)
            setEvent()
        })
    })
}

const unsetFav = (id, first, second) => {
    controller.unsetFavorite(id).then(() => {
        controller.render(first, second).then(items => {
            controller.setList('friendsFirst', 'friends', items.first)
            controller.setList('friendsSecond', 'friends', items.second)
            setEvent()
        })
    })
}

const filter = (e, input, output, fav) => {
    controller.setFilter(e.target.value, fav).then(list => {
            controller.setList(input, output, list)
            setEvent()
        })
        .catch(err => {
            controller.setList(input, output, [
                { err }
            ])
        })
}

const onDragStart = e => {
    e.dataTransfer.setData('text/plain', e.target.id)
}


const init = () => {
    model.login('7774039', {}).then(() => {
        controller.getList().then(friends => {
            controller.setFriends(friends)
            controller.setList('friendsFirst', 'friends', friends)
            const firstFilter = document.getElementById('firstFilter'),
                secondFilter = document.getElementById('secondFilter'),
                first = document.getElementById('friendsFirst'),
                second = document.getElementById('friendsSecond'),
                items = document.querySelectorAll('.friends__item'),
                fav = controller.checkFav()

            controller.setList('friendsSecond', 'friends', fav)

            setEvent()

            firstFilter.addEventListener('input', e => {
                filter(e, 'friendsFirst', 'friends', false)
            })

            secondFilter.addEventListener('input', e => {
                filter(e, 'friendsSecond', 'friends', true)
            })

            first.addEventListener('drop', e => {
                e.preventDefault()

                const id = e.dataTransfer.getData('text')
                unsetFav(id, firstFilter, secondFilter)

                e.dataTransfer.clearData()
            })

            second.addEventListener('drop', e => {
                e.preventDefault()

                const id = e.dataTransfer.getData('text')
                setFav(id, firstFilter, secondFilter)

                e.dataTransfer.clearData()
            })

            first.addEventListener('dragover', e => {
                e.preventDefault()
            })

            second.addEventListener('dragover', e => {
                e.preventDefault()
            })

            items.forEach(item => {
                item.addEventListener('dragstart', onDragStart)
            })
        })
    })
}




init()