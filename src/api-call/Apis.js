const axios = require("axios")

axios.defaults.baseURL = "" // TODO
axios.defaults.withCredentials = true
async function getDevice(JWT) {

    return axios({
        url: "/devices",
        method: "GET",
    })
}

export default getDevice