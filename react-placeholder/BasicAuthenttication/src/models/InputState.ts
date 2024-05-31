class InputState {
  valid: boolean
  value: string
  error: string

  constructor(valid = true, value = '', error = '') {
    this.valid = valid
    this.value = value
    this.error = error
  }
}

export default InputState
