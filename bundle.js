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
                item.properties.iconContent =
                    item.properties.iconContent ?
                    item.properties.iconContent + 1 :
                    1

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
            clusterDisableClickZoom: false,
        });

    myMap.events.add('click', function(e) {
        var coords = e.get('coords');
        UpdateCoords(coords)
    })

    const UpdateCoords = (coords) => {
        const id = Date.now()
        const obj = {
            type: "Feature",
            id,
            geometry: {
                type: "Point",
                coordinates: coords
            },
            properties: {
                balloonContentBody: `<form id='${id}'><p><input placeholder='Введите ваше имя' name='login'></p><p><input name='place' placeholder='Укажите место'></p><p><textarea name='subject' placeholder='Оставьте отзыв'></textarea></p><p><input type='submit' value='Добавить'></p>`,
                balloonContentFooter: `</form>`,
                balloonContentHeader: '<strong>Отзыв:</strong>',
                clusterCaption: "<strong><s>Еще</s> одна</strong> метка",
                hintContent: "<strong>Текст  <s>подсказки</s></strong>",
                iconContent: ''
            }
        }
        points.features.push(obj)

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
        var objectId = e.get('objectId'),
            object = objectManager.objects.getById(objectId);
        for (let item of points.features) {
            if (item.id === objectId) {
                object.properties = item.properties
            }
        }
    });

    objectManager.objects.options.set('preset', 'islands#blueIcon');
    objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
    myMap.geoObjects.add(objectManager);

}