export const authenticationApi = (): string => {
  return process.env.AUTHENTICATION_BACKEND || ''
}

export const port = (): number => {
  return parseInt(process.env.PORT || '')
}

export const analyzerPort = (): number => {
  return parseInt(process.env.ANALYZER_PORT || '')
}

export const environment = (): string => {
  return process.env.NODE_ENV || 'development'
}
