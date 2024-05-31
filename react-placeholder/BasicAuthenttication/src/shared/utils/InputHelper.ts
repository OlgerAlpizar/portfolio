import InputState from '../../models/InputState'

export const textInputReducer = (
  currentState: InputState,
  value: string,
  isValid: boolean,
  errorNote: string
) => {
  return {
    ...currentState,
    valid: isValid,
    value: value,
    error: isValid ? '' : errorNote,
  }
}
