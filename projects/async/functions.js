/* eslint-disable eol-last */
/* eslint-disable prettier/prettier */
/* ДЗ 5 - Асинхронность и работа с сетью */

/*
 Задание 1:

 Функция должна возвращать Promise, который должен быть разрешен через указанное количество секунд

 Пример:
   delayPromise(3) // вернет promise, который будет разрешен через 3 секунды
 */
function delayPromise(seconds) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(seconds)
        }, seconds * 1000)
    })
}

/*
 Задание 2:

 2.1: Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов можно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json

 2.2: Элементы полученного массива должны быть отсортированы по имени города

 Пример:
   loadAndSortTowns().then(towns => console.log(towns)) // должна вывести в консоль отсортированный массив городов
 */
function loadAndSortTowns() {
    const url = "https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json"

    return fetch(url).
    then(data => data.json()).
    then(json => {
        json.sort((a, b) => {
            const first = a.name.toLowerCase(),
                second = b.name.toLowerCase();
            return first < second ? -1 : 1;
        })
        return json;
    })
}

export { delayPromise, loadAndSortTowns };