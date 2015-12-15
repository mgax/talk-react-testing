mocha.setup('bdd')
mocha.timeout(5000)
mocha.slow(2000)

describe('todo app', function() {

  it('should add todo item', function(done) {
    let div = document.querySelector('#appUnderTest')
    let client = new Client()
    let app = React.render(<App client={client} />, div)

    setTimeout(() => {
      document.querySelector('[name=text]').value = 'hello world'
      todolist.querySelector('button').click()

      setTimeout(() => {
        let item = document.querySelector('#todolist li .text')
        chai.assert.equal(item.textContent, 'hello world')
        React.unmountComponentAtNode(div)
        done()
      }, 500)
    }, 500)
  })

})

mocha.run()
