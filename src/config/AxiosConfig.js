import axios from "axios";

const baseAxios = axios.create({
    baseURL: "https://4rznj6pb8d.execute-api.us-east-1.amazonaws.com/IoTAPI/",
    headers: {
        "Content-Type":"application/json"
    },
})


export default baseAxios