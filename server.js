const WebSocketServer = new require('ws'),
    fs = require('fs'),
    tMess = {
        auth: 'AUTH',
        mess: 'MESS',
        disc: 'DISC',
        err: 'ERR',
        upd: 'UPD',
        atc: 'ATC'
    }

var clients = {};
let users = [

]
let currentId = 1;

const webSocketServer = new WebSocketServer.Server({ port: 8080 });

webSocketServer.on('connection', function(ws) {
    const id = currentId++;
    clients[id] = ws;
    console.log("новое соединение " + id);

    ws.on('message', function(message) {
        let mess = JSON.parse(message)
        switch (mess.type) {
            case tMess.auth:
                filterUser(mess)
                break
            case tMess.mess:
                addMessage(mess)
                break
            case tMess.atc:
                fileSave(mess)
                break
        }
    });

    const fileSave = (data) => {
        const url = data.data;
        fs.writeFile(`./server/img/${data.filename}`, url, { encoding: 'binary' }, (err) => {
            if (err) {
                console.log('error')
            } else {
                let user = users.find(item => item.login === data.login),
                    userIndex = users.indexOf(user)
                users.splice(userIndex, 1, {
                    ...user,
                    img: getUserImg(user)
                })
                for (const key in clients) {
                    clients[key].send(JSON.stringify({
                        type: tMess.atc,
                        userData: users
                    }));
                }
            }
        })
    }

    const filterUser = (data) => {
        const res = users.find(item => item.login === data.userData.login)
        if (res) {
            clients[id].send(JSON.stringify({ type: tMess.err, text: "Пользователь с таким именем уже есть в чате!\n Перезайти?" }))
        } else {
            updateUser(data)
        }
    }

    const getUserImg = (data) => {
        const files = fs.readdirSync('./server/img')
        let img = null

        files.forEach(item => {
            if (item.split('.')[0] === data.login) {
                img = fs.readFileSync(`./server/img/${item}`, { encoding: 'base64' })
            }
        })

        if (img === null) {
            img = fs.readFileSync(`./server/default/avatar.jpg`, { encoding: 'base64' })
        }

        return `data:image/jpeg;base64, ${img}`
    }

    const updateUser = (data) => {
        let img = getUserImg(data.userData)
        users.push({ id, ...data.userData, img })
        for (const key in clients) {
            clients[key].send(JSON.stringify({
                type: tMess.auth,
                userData: users
            }));
        }
    }

    const addMessage = (data) => {
        for (const key in clients) {
            clients[key].send(JSON.stringify({
                type: tMess.mess,
                message: data.message,
                user: data.user
            }));
        }
    }

    ws.on('close', function() {
        console.log('соединение закрыто ' + id);
        users = users.filter(item => item.id !== id)
        for (const key in clients) {
            clients[key].send(JSON.stringify({
                type: tMess.disc,
                userData: users
            }));
        }
        delete clients[id];
    });
});
console.log("Сервер запущен на порту 8080");