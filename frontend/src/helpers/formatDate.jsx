export const formatDate = date => {

  const newDate = new Date(date.split("T").shift().split("-"))
  const options = {
    weekday : "long",
    year: "numeric",
    month: "long",
    day: "2-digit"
  }
  return newDate.toLocaleDateString("es-ES", options)
}