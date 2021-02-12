ymaps.ready(init);

let index = 0

function init() {

    let points = {
        "type": "FeatureCollection",
        features: [

        ]
    }

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
        for (let item of points.features) {
            if (user.formId === item.id.toString()) {
                let oldHeader = item.properties.balloonContentHeader,
                    newHeader = `<p><strong>${user.login}:</strong> ${user.place}</p><p>${user.subject}</p>` + oldHeader
                item.properties.balloonContentHeader = newHeader

                if (item.properties.iconContent >= 1) {
                    item.properties.iconContent++;
                    item.options.preset = 'islands#blueCircleIcon'
                    objectManager.objects.setObjectOptions(item.id, {
                        preset: item.options.preset
                    });
                    // points.features.push({...item, id: Date.now() })
                } else item.properties.iconContent = 1

                objectManager.objects.balloon.close(item.id)
            }
        }
    }

    var myMap = new ymaps.Map('map', {
            center: [55.76, 37.64],
            zoom: 10
        }, {
            searchControlProvider: 'yandex#search'
        }),
        objectManager = new ymaps.ObjectManager({
            clusterize: true,
            gridSize: 32,
            clusterDisableClickZoom: true,
            clusterHideIconOnBalloonOpen: true,
            geoObjectHideIconOnBalloonOpen: true
        });
    clusterer = new ymaps.Clusterer({
        preset: 'islands#invertedVioletClusterIcons',
        groupByCoordinates: false,
        clusterDisableClickZoom: true,
        clusterHideIconOnBalloonOpen: false,
        geoObjectHideIconOnBalloonOpen: false
    })

    myMap.events.add('click', function(e) {
        var coords = e.get('coords');
        UpdateCoords(coords)
    })

    const deleteAll = (id) => {
        // points.features = points.features.filter(item => item.id !== id && item.properties.iconContent === '')
        points.features.forEach(item => {
            if (item.id !== id && item.properties.iconContent === '') {
                points.features = points.features.filter(obj => obj === item)
            }
        })
    }

    const UpdateCoords = (coords) => {
        const id = Date.now(),
            obj = {
                type: "Feature",
                id,
                geometry: {
                    type: "Point",
                    coordinates: coords
                },
                properties: {
                    balloonContentBody: `<form id='${id}'><p><input required placeholder='Введите ваше имя' name='login'></p><p><input name='place' required placeholder='Укажите место'></p><p><textarea name='subject' required placeholder='Оставьте отзыв'></textarea></p><p><input type='submit' value='Добавить'></p>`,
                    balloonContentFooter: `</form>`,
                    balloonContentHeader: '<strong>Отзыв:</strong>',
                    // clusterCaption: "<strong><s>Еще</s> одна</strong> метка",
                    // hintContent: "<strong>Текст  <s>подсказки</s></strong>",
                    iconContent: ''
                },
                options: {
                    preset: "islands#blueIcon"
                }
            }
        points.features.push(obj)
        deleteAll(id)


        updateMap(id)
    }

    const updateMap = (id) => {
        for (let item of points.features) {
            if (id === item.id) {
                objectManager.add(item)
                objectManager.objects.balloon.open(id)
            }
        }
    }


    objectManager.objects.events.add('balloonopen', function(e) {

    });

    objectManager.objects.events.add('balloonclose', function(e) {
        const objectId = e.get('objectId'),
            obj = points.features.filter(item => item.id === objectId)

        obj.forEach(item => {
            if (item.properties.iconContent < 1) {
                points.features = points.features.filter(item => item.id !== objectId)
                objectManager.remove([objectId])
            }
        })

    })

    // objectManager.objects.options.set('preset', 'islands#blueIcon');
    objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
    myMap.geoObjects.add(objectManager);
    myMap.geoObjects.add(clusterer);

}