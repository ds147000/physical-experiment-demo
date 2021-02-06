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
console.log('%c 本人正在寻找好的工作机会中～如果有意请联系我的邮箱yangzhoulong@icloud.com 或 微信 ds147000', 'color: green')



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
