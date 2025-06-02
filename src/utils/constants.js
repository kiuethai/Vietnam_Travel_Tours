let apiRoot = ''

// console.log('process.env.BUILD_MODE', process.env.BUILD_MODE)


// Môi trường Dev sẽ chạy localhost với port 8017
if (process.env.BUILD_MODE === 'dev') {
  // apiRoot = 'http://localhost:8018'
  apiRoot = 'https://api-travel-tour-vn.onrender.com'

}
if (process.env.BUILD_MODE === 'production') {
  apiRoot = 'https://api-travel-tour-vn.onrender.com'
}

// console.log('🚀 ~ file: constants.js:7 ~ apiRoot:', apiRoot)
export const API_ROOT = apiRoot

