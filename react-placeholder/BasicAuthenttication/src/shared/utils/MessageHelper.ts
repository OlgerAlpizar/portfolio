// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseCatchMessage = (error: any) => {
  const message = error.response?.data?.message || 'Error'
  const details =
    error.response?.data?.details ??
    error.response?.data?.substring(0, 200) ??
    error.response ??
    error.message ??
    error

  return `${message}. ${details}`
}
