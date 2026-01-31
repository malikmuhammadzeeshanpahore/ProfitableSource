import React, {useState, useEffect} from 'react'

export default function LanguageToggle(){
  const [lang,setLang] = useState(localStorage.getItem('de_lang') || 'en')

  useEffect(()=>{
    localStorage.setItem('de_lang', lang)
  },[lang])

  return (
    <div className="lang-toggle">
      <button className={`small ${lang==='en' ? 'active' : ''}`} onClick={()=>setLang('en')}>EN</button>
      <button className={`small ${lang==='ur' ? 'active' : ''}`} onClick={()=>setLang('ur')}>اردو</button>
    </div>
  )
}
