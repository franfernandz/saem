import axios from 'axios'


const API_URL2="https://api.francobalich.com/api"

// http://172.21.22.37/web_Api_Rest_Molinete/api/login/autenticar
const API_URL="http://172.5.20.5:5007"

const userAPI = axios.create({
    baseURL:API_URL
})


// axios.interceptors.request.use(config => {
//     if (config.method === 'POST' || config.method === 'PATCH' || config.method === 'PUT')
//       config.headers['Content-Type'] = 'application/json;charset=utf-8';
  
    
//     return config;
//   });
// userAPI.interceptors.request.use(config=>{
//     config.headers={
//         ...config.headers,
//         'x-token':localStorage.getItem('token')
//     }
//     return config
// })

// userAPI.interceptors.request.use(config=>{
//     config.headers={
//         ...config.headers
       
//     }
//     alert(JSON.stringify(config))
//     return config
// })

export default userAPI