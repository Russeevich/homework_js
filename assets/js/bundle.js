const Init = () => {
    const socket = new WebSocket("ws://localhost:8080"),
        form = document.getElementById('form'),
        userTable = document.getElementById('messangerLeft'),
        mess = document.getElementById('mess'),
        chatForm = document.getElementById('chatForm'),
        messages = document.getElementById('chatMessage'),
        chatTable = document.getElementById('messangerRight')
    tMess = {
        auth: 'AUTH',
        mess: 'MESS',
        disc: 'DISC',
        err: 'ERR'
    }
    let user = {

        },
        users = [

        ],
        chat = [

        ]

    const goToChat = () => {
        document.getElementById('login').remove()
        mess.style.display = 'flex';

        chatForm.addEventListener('submit', sendMessage)
    }

    function declOfNum(n) {
        const peoples = ['участник', 'участника', 'участников']
        n = Math.abs(n) % 100;
        var n1 = n % 10;
        if (n > 10 && n < 20) { return peoples[2]; }
        if (n1 > 1 && n1 < 5) { return peoples[1]; }
        if (n1 == 1) { return peoples[0]; }
        return peoples[2];
    }

    const formHandler = (event) => {
        event.preventDefault()

        const [login] = event.target.elements

        user.login = login.value
        user.img = "assets/img/avatar.png"

        socket.addEventListener('message', event => filterMessage(JSON.parse(event.data)))

        socket.addEventListener('error', () => errorMessage('Ошибка соединения'))

        socket.send(JSON.stringify({
            type: tMess.auth,
            userData: {
                ...user
            }
        }))

        goToChat()
    }

    const filterMessage = (data) => {
        switch (data.type) {
            case tMess.disc:
            case tMess.auth:
                updateUser(data)
                break
            case tMess.mess:
                updateMessage(data)
                break
            case tMess.err:
                checkErr(data)
                break
        }
    }

    const renderUser = () => {
        let result = Handlebars.compile(userTable.textContent)
        document.getElementById('userTable').innerHTML = result(users)

        updatePeople()
    }

    const checkErr = (data) => {
        result = alert(data.text)
        location.reload()
    }

    const sendMessage = (event) => {
        event.preventDefault()
        const [message] = event.target.elements

        socket.send(JSON.stringify({
            type: tMess.mess,
            message: message.value,
            user
        }))

        message.value = ''
    }

    const updatePeople = () => {
        const count = users.length
        document.getElementById('people').textContent = `${count} ${declOfNum(count)}`
    }

    const getDate = (date) => {
        const minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes(),
            hours = date.getHours() > 9 ? date.getHours() : '0' + date.getHours()

        return `${hours}:${minutes}`
    }

    const updateMessage = (data) => {
        const login = data.user.login,
            message = data.message,
            date = getDate(new Date())

        let result = Handlebars.compile(chatTable.textContent),
            lastMess = chat[chat.length - 1],
            first = false

        if (!lastMess || lastMess.login !== login) {
            first = true
        }

        let lastUser = users.find(item => item.login === login),
            lastIndex = users.indexOf(lastUser)

        users.splice(lastIndex, 1, {
            ...lastUser,
            lastMess: message
        })

        renderUser()

        chat.push({
            login,
            message,
            date,
            type: user.login === login ? 'my' : 'alien',
            first,
            img: data.user.img
        })
        messages.innerHTML = result(chat)
    }

    const updateUser = (data) => {
        users = data.userData

        renderUser()
    }

    const errorMessage = (err) => {
        throw new Error(err)
    }

    form.addEventListener('submit', formHandler)
}

Init()