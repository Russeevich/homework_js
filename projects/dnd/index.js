/* eslint-disable prettier/prettier */
/* Задание со звездочкой */

/*
 Создайте страницу с кнопкой.
 При нажатии на кнопку должен создаваться div со случайными размерами, цветом и позицией на экране
 Необходимо предоставить возможность перетаскивать созданные div при помощи drag and drop
 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
import './dnd.html';
import { randomNumber } from '../../scripts/helper';

const homeworkContainer = document.querySelector('#app');

const moveBlock = (e, item, pos) => {
    item.style.left = e.pageX - pos.offsetX + 'px'
    item.style.top = e.pageY - pos.offsetY + 'px'
}

function generateColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

export function createDiv() {
    const div = document.createElement('div')

    div.classList.add('draggable-div')
    div.style.width = randomNumber(0, 1000) + 'px'
    div.style.height = randomNumber(0, 1000) + 'px'
    div.style.left = randomNumber(0, 1000) + 'px'
    div.style.top = randomNumber(0, 1000) + 'px'
    div.style.background = generateColor()

    div.addEventListener('mousedown', (ex) => {
        document.onmousemove = function(e) {
            moveBlock(e, div, ex);
        }

        div.onmouseup = function() {
            document.onmousemove = null;
            div.onmouseup = null;
        }
    });

    return div
}

const addDivButton = homeworkContainer.querySelector('#addDiv');

addDivButton.addEventListener('click', function() {
    const div = createDiv();

    homeworkContainer.appendChild(div);
});
