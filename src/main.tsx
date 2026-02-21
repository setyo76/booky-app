console.log(
  "%c📚 Booky %c— Built by Setyo",
  "background:#2563eb;color:white;font-weight:bold;padding:4px 8px;border-radius:4px",
  "color:#2563eb;font-weight:bold;padding:4px"
);
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Root from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
