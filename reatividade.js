const projeto = {
  id: 1,
  descricao: "alura"
}
const proxy = new Proxy(projeto, {
  get(objetoOriginal, chave, receptor) {
    console.log(`Alguém pediu a chave ${chave} do projeto`)
    return Reflect.get(objetoOriginal, chave, receptor)
  },
  set(objetoOriginal, chave, valor) {
    console.log(`Algéum alterou a chave ${chave} para o valor ${valor}`)
    objetoOriginal[chave] = valor
  }
})
proxy.descricao = "Reatividade"
console.log(proxy.descricao)