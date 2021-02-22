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
        err: 'ERR',
        upd: 'UPD',
        atc: 'ATC'
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
        user.img = "assets/img/avatar.jpg"

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
            case tMess.atc:
                updateData(data)
                break
        }
    }

    const renderUser = () => {
        const drop = users.find(item => item.login === user.login),
            dropIndex = users.indexOf(drop)

        users.splice(dropIndex, 1, {
            ...drop,
            my: true
        })



        let result = Handlebars.compile(userTable.textContent)
        document.getElementById('userTable').innerHTML = result(users)

        let img = document.getElementById(`dropped`)

        img.addEventListener('drop', e => {
            e.preventDefault()
            let file = e.dataTransfer.files[0],
                reader = new FileReader()

            reader.onload = function(e) {
                socket.send(JSON.stringify({
                    type: tMess.atc,
                    login: user.login,
                    filename: `${user.login}.${file.name.split('.')[1]}`,
                    data: e.target.result
                }))
            }
            reader.readAsBinaryString(file)
        })

        img.addEventListener('dragover', e => {
            e.preventDefault()
        })

        updatePeople()
    }

    const updateData = (data) => {
        let result = Handlebars.compile(chatTable.textContent)

        updateUser(data)

        chat.forEach((item, index) => {
            users.forEach((val, ind) => {
                if (val.login === item.login) {
                    chat.splice(index, 1, {
                        ...item,
                        img: val.img
                    })
                }
            })
        })

        messages.innerHTML = result(chat)
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

    const updateMessage = (data) => {
        const login = data.user.login,
            message = data.message,
            date = data.date

        console.log(date)

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

    const findUsers = (data) => {
        let finds = null
        users.forEach(item => {
            let findUser = false
            data.userData.forEach(point => {
                if (item.login === point.login)
                    findUser = true
            })
            if (!findUser)
                finds = item
        })

        return finds
    }

    const updateUser = (data) => {
        if (data.type === tMess.auth || data.type === tMess.disc) {
            let result = Handlebars.compile(chatTable.textContent),
                findUser = null

            if (data.type === tMess.disc)
                findUser = findUsers(data)

            chat.push({
                message: data.type === tMess.disc ? `${findUser.login} вышел(а) из чата` : `${data.userData[data.userData.length - 1].login} зашел(а) в чат`,
                type: 'alien',
            })
            messages.innerHTML = result(chat)
        }

        users = data.userData
        user = users.find(item => item.login === user.login)
        renderUser()
    }

    const errorMessage = (err) => {
        throw new Error(err)
    }

    form.addEventListener('submit', formHandler)
}

Init()