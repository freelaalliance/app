export function getNumOrder() {
  const QTD_DIGITOS = 5
  const CARACTERES =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let codigo = ''
  for (let i = 0; i < QTD_DIGITOS; i++) {
    const aleatorio = Math.floor(Math.random() * CARACTERES.length)
    codigo += CARACTERES.charAt(aleatorio)
  }
  const dataAtual = new Date()

  return dataAtual.getUTCMonth() + codigo + dataAtual.getFullYear()
}
