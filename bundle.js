ymaps.ready(init);

let index = 0

function init() {

    let points = [

    ]

    let pointsToStore = [

    ]

    document.addEventListener('submit', e => {
        e.preventDefault()

        const [login, place, subject] = document.forms[0].elements
        let user = {
            formId: document.forms[0].id,
            login: login.value,
            place: place.value,
            subject: subject.value
        }

        user.formId === '' ? createMark(user) : UpdateInfo(user)
    })

    const createMark = (user) => {
        let id = UpdateCoords(myMap.balloon._balloon._position)
        UpdateInfo({...user, formId: id })
        myMap.balloon.close()
    }

    const UpdateInfo = (user) => {
        for (let item of points) {
            if (user.formId.toString() === item.properties._data.placemarkId.toString()) {
                let oldHeader = item.properties._data.balloonContentHeader,
                    newHeader = `<p><strong>${user.login}:</strong> ${user.place}</p><p>${user.subject}</p>` + oldHeader
                item.properties._data.balloonContentHeader = item.properties._data.clusterCaption = newHeader

                setLocalStore(user, item)

                if (item.properties._data.iconContent >= 1) {
                    item.properties._data.iconContent = parseInt(item.properties._data.iconContent) + 1;
                    UpdateCoords(item.geometry._coordinates)
                } else item.properties._data.iconContent = 1
                item.balloon.close()
            }
        }
    }

    const setLocalStore = (user, item) => {
        let res = pointsToStore.find(point => point.placemarkId.toString() === item.properties._data.placemarkId.toString()),
            obj = {
                placemarkId: user.formId,
                balloonContentBody: item.properties._data.balloonContentBody,
                balloonContentFooter: item.properties._data.balloonContentFooter,
                balloonContentHeader: item.properties._data.balloonContentHeader,
                clusterCaption: item.properties._data.clusterCaption,
                hintContent: item.properties._data.hintContent,
                iconContent: parseInt(item.properties._data.iconContent) + 1,
                coords: item.geometry._coordinates
            }

        if (res) {
            let index = pointsToStore.indexOf(res)
            pointsToStore.splice(index, 1, obj)
        } else {
            pointsToStore.push(obj)
        }

        localStorage.setItem('points', JSON.stringify(pointsToStore))
    }

    var customBalloonContentLayout = ymaps.templateLayoutFactory.createClass([
        '<div class=list>',
        `<div>{{ properties.geoObjects[0].properties.balloonContentHeader|raw }}<form id='{{properties.geoObjects[0].properties.placemarkId}}'><p><input required placeholder='Введите ваше имя' name='login'></p><p><input name='place' required placeholder='Укажите место'></p><p><textarea name='subject' required placeholder='Оставьте отзыв'></textarea></p><p><input type='submit' value='Добавить'></p></div>`,
        '</div>'
    ].join(''));

    var BalloonContentLayout = ymaps.templateLayoutFactory.createClass([
        '<div class=list>',
        `<div>{{ properties.balloonContentHeader|raw }}<form id='{{properties.placemarkId}}'><p><input required placeholder='Введите ваше имя' name='login'></p><p><input name='place' required placeholder='Укажите место'></p><p><textarea name='subject' required placeholder='Оставьте отзыв'></textarea></p><p><input type='submit' value='Добавить'></p></div>`,
        '</div>'
    ].join(''));

    let balloonContentLayoutForMap = ymaps.templateLayoutFactory.createClass([
        '<div class=list>',
        `<div><strong>Отзыв:</strong><form id=''><p><input required placeholder='Введите ваше имя' name='login'></p><p><input name='place' required placeholder='Укажите место'></p><p><textarea name='subject' required placeholder='Оставьте отзыв'></textarea></p><p><input type='submit' value='Добавить'></p></div>`,
        '</div>'
    ].join(''));

    var myMap = new ymaps.Map('map', {
        center: [55.76, 37.64],
        zoom: 10
    }, {
        searchControlProvider: 'yandex#search'
    })
    clusterer = new ymaps.Clusterer({
        clusterDisableClickZoom: true,
        groupByCoordinates: true,
        clusterBalloonContentLayout: customBalloonContentLayout
    })

    myMap.events.add('click', function(e) {
        tempCord = e.get('coords')

        tempBall = myMap.balloon.open(tempCord, {

        }, {
            contentLayout: balloonContentLayoutForMap
        })
    })

    const UpdateCoords = (coords) => {
        const id = Date.now(),
            obj = new ymaps.Placemark(coords, {
                placemarkId: id,
                balloonContentBody: `<form id='${id}'><p><input required placeholder='Введите ваше имя' name='login'></p><p><input name='place' required placeholder='Укажите место'></p><p><textarea name='subject' required placeholder='Оставьте отзыв'></textarea></p><p><input type='submit' value='Добавить'></p>`,
                balloonContentFooter: `</form>`,
                balloonContentHeader: '<strong>Отзыв:</strong>',
                clusterCaption: "<strong>Отзыв:</strong>",
                hintContent: "<strong>Текст  <s>подсказки</s></strong>",
                iconContent: 0
            }, {
                balloonContentLayout: BalloonContentLayout
            })
        points.push(obj)

        updateMap(obj)

        return id
    }

    const loadMap = () => {
        let items = JSON.parse(localStorage.getItem('points'))

        if (!items)
            return

        items.forEach(item => {
            for (let i = 0; i < item.iconContent; i++) {
                let obj = new ymaps.Placemark(item.coords, {
                    placemarkId: item.placemarkId,
                    balloonContentBody: item.balloonContentBody,
                    balloonContentFooter: item.balloonContentFooter,
                    balloonContentHeader: item.balloonContentHeader,
                    clusterCaption: item.clusterCaption,
                    hintContent: item.hintContent,
                    iconContent: item.iconContent
                }, {
                    balloonContentLayout: BalloonContentLayout
                })
                points.push(obj)
                clusterer.add(obj)
            }
            pointsToStore.push(item)
        })
    }

    const updateMap = (obj) => {
        for (let item of points) {
            if (obj === item) {
                clusterer.add(obj)
            }
        }
        obj.balloon.open()
    }

    myMap.geoObjects.add(clusterer)

    loadMap()

}