/* eslint-disable prettier/prettier */
/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующей cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если добавляемая cookie не соответствует фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующей cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

import './cookie.html';

/*
 app - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#app');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

filterNameInput.addEventListener('input', function() {
    Load()
});

addButton.addEventListener('click', () => {
    document.cookie = `${addNameInput.value}=${addValueInput.value}`
    Load()
    addNameInput.value = addValueInput.value = ''
});

const Search = (input, letter) => {
    return letter.toLowerCase().includes(input.toLowerCase())
}

const createTh = (value, type = 'text') => {
    const th = document.createElement('th')
    if (type === 'text') {
        th.textContent = value
    } else {
        const btn = document.createElement('button')
        btn.textContent = 'удалить'
        btn.onclick = () => {
            document.cookie = `${value}=; Max-Age=-99999999;`
            Load()
        }
        th.append(btn)
    }
    return th
}

const createInfo = (item) => {
    const tr = document.createElement('tr'),
        key = createTh(item.key),
        value = createTh(item.value),
        btn = createTh(item.key, 'btn')

    tr.append(key, value, btn)
    listTable.append(tr)
}

const getCookie = () => {
    const cookies = {}
    document.cookie.split('; ').forEach(item => {
        const [name, value] = item.split('=')
        cookies[name] = value
    })
    return cookies
}

const Load = () => {
    listTable.innerHTML = ''
    const cookies = getCookie()
    for (const item in cookies) {
        if (Search(filterNameInput.value, item) || Search(filterNameInput.value, cookies[item] || !filterNameInput.value))
            createInfo({
                key: item,
                value: cookies[item]
            })
    }
}

Load()

listTable.addEventListener('click', (e) => {});
