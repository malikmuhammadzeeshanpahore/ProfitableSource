const LOCALES = {
  en: {
    appName: 'Profitable Source',
    getStarted: 'Get Started',
    viewPackages: 'View Packages',
    signIn: 'Sign in',
    signUp: 'Sign up'
  },
  ur: {
    appName: 'پرافٹیبل سورس',
    getStarted: 'شروع کریں',
    viewPackages: 'پیکیجز دیکھیں',
    signIn: 'سائن ان',
    signUp: 'سائن اپ'
  }
}

export function t(key, locale='en'){
  return (LOCALES[locale] && LOCALES[locale][key]) || LOCALES['en'][key] || key
}

export default { t }
