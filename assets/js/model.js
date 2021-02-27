export default {
    login(id, params) {
        return new Promise((res, rej) => {
            VK.init({
                apiId: id
            })

            VK.Auth.login(resp => {
                if (resp.session) {
                    res(resp)
                } else {
                    rej(new Error('Неудачная авторизация'))
                }
            }, params)
        })
    },
    callApi(method, params) {
        params.v = params.v || '5.130'

        return new Promise((res, rej) => {
            VK.api(method, params, resp => {
                if (resp.error) {
                    rej(new Error('Возникла ошибка запроса'))
                } else {
                    res(resp.response)
                }
            })
        })
    },
    getUser(params = {}) {
        return this.callApi('users.get', params)
    },
    getFriends(params = {}) {
        return this.callApi('friends.get', params)
    }
}