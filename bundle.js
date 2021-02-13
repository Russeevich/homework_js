ymaps.ready(init);

let index = 0

function init() {

    let points = [

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

                if (item.properties._data.iconContent >= 1) {
                    item.properties._data.iconContent++;
                    UpdateCoords(item.geometry._coordinates)
                } else item.properties._data.iconContent = 1
                item.balloon.close()
            }
        }
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
                iconContent: ''
            }, {
                balloonContentLayout: BalloonContentLayout
            })
        points.push(obj)

        updateMap(obj)

        return id
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

}