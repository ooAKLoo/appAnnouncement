import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'  // 引入原项目的样式
import './tailwind.css'  // 引入Tailwind样式
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
