import PropTypes from 'prop-types'
import { createContext, useContext, useState, useEffect } from 'react'

// 创建语言上下文
const LanguageContext = createContext()

import enTranslations from '@/i18n/en'
import zhTranslations from '@/i18n/zh'

export const translations = {
  en: enTranslations,
  zh: zhTranslations
}

// 语言提供者组件
export const LanguageProvider = ({ children }) => {
  // 从localStorage读取语言偏好，如果没有则使用默认语言
  const savedLanguage = localStorage.getItem('preferredLanguage') || 'en'
  const [language, setLanguage] = useState(savedLanguage)
  
  // 当语言变化时，保存到localStorage
  useEffect(() => {
    localStorage.setItem('preferredLanguage', language)
  }, [language])

  // 切换语言的函数
  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage)
  }

  // 翻译工具函数
  const t = (key, defaultText = key) => {
    // 支持点表示法的嵌套键查找
    const keys = key.split('.')
    let value = translations[language]
    
    for (const k of keys) {
      if (value === undefined) break
      value = value[k]
    }
    
    return value !== undefined ? value : defaultText
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

// 自定义Hook，便于组件使用语言上下文
export const useLanguage = () => useContext(LanguageContext)

// 定义属性类型
LanguageProvider.propTypes = {
  children: PropTypes.any
}