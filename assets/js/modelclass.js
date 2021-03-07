export class Model {
    constructor(id, version = '5.130') {
        this.id = id
        this.version = version
    }

    login(params) {
        return new Promise((res, rej) => {
            VK.init({
                apiId: this.id
            })

            VK.Auth.login(resp => {
                if (resp.session) {
                    res(resp)
                } else {
                    rej(new Error('Неудачная авторизация'))
                }
            }, params)
        })
    }

    callApi(method, params) {
        params.v = this.version

        return new Promise((res, rej) => {
            VK.api(method, params, resp => {
                if (resp.error) {
                    rej(new Error('Возникла ошибка запроса'))
                } else {
                    res(resp.response)
                }
            })
        })
    }

    getUser(params = {}) {
        return this.callApi('users.get', params)
    }

    getFriends(params = {}) {
        return this.callApi('friends.get', params)
    }
}