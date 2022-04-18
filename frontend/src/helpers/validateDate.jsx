export const validateDate = (date) => {
  // Format = YYYY-MM-DD
  // Example: 2020-01-01
  const dateState = date.split("-")
  const year = parseInt(dateState[0])
  const month = parseInt(dateState[1]) - 1
  const day = parseInt(dateState[2])
  const newDate = new Date(year, month, day)
  const dateNow = new Date()
  if(dateNow < newDate) {
    return false
  }
  return true
}