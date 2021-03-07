import { Controller } from "./controllerclass.js"


const init = () => {
    const firstOut = document.querySelector('#friendsFirst'),
        secondOut = document.querySelector('#friendsSecond'),
        firstFil = document.querySelector('#firstFilter'),
        secondFil = document.querySelector('#secondFilter'),
        cont = new Controller('7774039', firstOut, secondOut, firstFil, secondFil)

    cont.getList().then(item => {
        for (const obj of item) {
            cont.setPeople(obj)
        }
        cont.draw()
    })
}


init()