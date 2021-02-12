/* eslint-disable no-console */
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)

console.log('%c hello，此demo代码仅做演示作用，请勿做商业用途～', 'color: red')
console.log('%c 如果您有好的功能和设计想法请联系我的邮箱yangzhoulong@icloud.com 或 微信 ds147000', 'color: green')



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
