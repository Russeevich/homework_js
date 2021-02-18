const WebSocketServer = new require('ws'),
    tMess = {
        auth: 'AUTH',
        mess: 'MESS',
        disc: 'DISC',
        err: 'ERR'
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
        console.log('получено сообщение ' + message);
        let mess = JSON.parse(message)
        switch (mess.type) {
            case tMess.auth:
                filterUser(mess)
                break
            case tMess.mess:
                addMessage(mess)
                break
        }
        console.log(users)
    });

    const filterUser = (data) => {
        const res = users.find(item => item.login === data.userData.login)
        if (res) {
            clients[id].send(JSON.stringify({ type: tMess.err, text: "Пользователь с таким именем уже есть в чате!\n Перезайти?" }))
        } else {
            updateUser(data)
        }
    }

    const updateUser = (data) => {
        users.push({ id, ...data.userData })
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