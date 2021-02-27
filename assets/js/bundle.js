import controller from "./controller.js"
import model from "./model.js"
import view from "./view.js"

const setEvent = () => {
    const mvBtn = document.querySelectorAll('.friends__move'),
        firstFilter = document.getElementById('firstFilter'),
        clBtn = document.querySelectorAll('.friends__close'),
        secondFilter = document.getElementById('secondFilter')
    mvBtn.forEach(item => {
        item.addEventListener('click', (e) => {
            const id = e.target.parentNode.id
            controller.setFavorite(id, firstFilter).then(list => {
                controller.setList('friendsSecond', 'friends', list.second)
                controller.setList('friendsFirst', 'friends', list.first).then(() => {
                    setEvent()
                })
            })
        })
    })

    clBtn.forEach(item => {
        item.addEventListener('click', (e) => {
            const id = e.target.parentNode.id
            controller.unsetFavorite(id, secondFilter).then(list => {
                controller.setList('friendsSecond', 'friends', list.first)
                controller.setList('friendsFirst', 'friends', list.second).then(() => {
                    setEvent()
                })
            })
        })
    })
}

const filter = (e, input, output, fav) => {
    controller.setFilter(e.target.value, fav).then(list => {
            controller.setList(input, output, list)
        }).then(() => {
            setEvent()
        })
        .catch(err => {
            controller.setList(input, output, [
                { err }
            ])
        })
}


const init = () => {
    model.login('7774039', {}).then(() => {
        controller.getList().then(friends => {
            controller.setFriends(friends)
            controller.setList('friendsFirst', 'friends', friends).then(() => {
                const firstFilter = document.getElementById('firstFilter'),
                    secondFilter = document.getElementById('secondFilter'),


                    setEvent()

                firstFilter.addEventListener('input', e => {
                    filter(e, 'friendsFirst', 'friends', false)
                })

                secondFilter.addEventListener('input', e => {
                    filter(e, 'friendsSecond', 'friends', true)
                })
            })
        })
    })
}




init()