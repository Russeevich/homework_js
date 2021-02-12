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

        UpdateInfo(user)
    })

    const UpdateInfo = (user) => {
        for (let item of points) {
            if (user.formId === item.properties._data.placemarkId.toString()) {

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

    var myMap = new ymaps.Map('map', {
        center: [55.76, 37.64],
        zoom: 10
    }, {
        searchControlProvider: 'yandex#search'
    })
    clusterer = new ymaps.Clusterer({
        clusterDisableClickZoom: true,
        groupByCoordinates: true,
        // clusterBalloonLeftColumnWidth: 0
        clusterBalloonContentLayout: customBalloonContentLayout
    })

    myMap.events.add('click', function(e) {
        var coords = e.get('coords');
        UpdateCoords(coords)
    })

    const deleteAll = (id) => {
        points.features.forEach(item => {
            if (item.id !== id && item.properties.iconContent === '') {
                points.features = points.features.filter(obj => obj === item)
            }
        })
    }

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
            })
        points.push(obj)

        console.log(clusterer.getGeoObjects())

        updateMap(obj)
    }

    const updateMap = (obj) => {
        for (let item of points) {
            if (obj === item) {
                clusterer.add(obj)
                myMap.geoObjects.add(clusterer)
            }
        }
        obj.balloon.open()
    }

    clusterer.events.add('balloonclose', function(event) {
        const id = event.get('target').properties._data.placemarkId,
            obj = points.filter(item => item.properties._data.placemarkId === id)

        if (obj[0].properties._data.iconContent !== '')
            return
        points = points.filter(item => item.properties._data.placemarkId !== id)
        clusterer.remove(obj)

    })


    // objectManager.objects.events.add('balloonopen', function(e) {
    //     console.log(points)
    // });

    // objectManager.objects.events.add('balloonclose', function(e) {
    //     const objectId = e.get('objectId'),
    //         obj = points.features.filter(item => item.id === objectId)

    //     obj.forEach(item => {
    //         if (item.properties.iconContent < 1) {
    //             points.features = points.features.filter(item => item.id !== objectId)
    //             objectManager.remove([objectId])
    //         }
    //     })

    // })

    // objectManager.objects.options.set('preset', 'islands#blueIcon');
    // objectManager.clusters.options.set({
    //     'preset': 'islands#blueClusterIcons',
    //     gridSize: 100,
    //     minClusterSize: 1,
    //     synchAdd: true
    // });
    // myMap.geoObjects.add(objectManager);
    myMap.geoObjects.add(clusterer)

}