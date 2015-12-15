function wait(callback) {
  return new Promise((resolve, reject) => {
    let time = () => new Date().getTime()
    let t0 = time()
    let i = setInterval(() => {

      let rv
      try {
        rv = callback()
      }
      catch(e) {
        reject(e)
      }

      if(rv) {
        clearInterval(i)
        resolve(rv)
      }
      else if(time() - t0 > 2000) {
        clearInterval(i)
        reject(new Error('timeout'))
      }

    }, 50)
  })
}

mocha.setup('bdd')
mocha.timeout(5000)
mocha.slow(2000)

describe('todo app', function() {

  it('should add todo item', function(done) {
    let div = document.querySelector('#appUnderTest')
    let client = new Client()
    let app = React.render(<App client={client} />, div)

    wait(() => div.querySelector('#todolist'))
      .then((todolist) => {
        todolist.querySelector('[name=text]').value = 'hello world'
        todolist.querySelector('button').click()
      })
      .then(() => wait(() => div.querySelector('#todolist li .text')))
      .then((item) => {
        chai.assert.equal(item.textContent, 'hello world')
      })
      .then(() => {
        React.unmountComponentAtNode(div)
        done()
      })
  })

})

mocha.run()
