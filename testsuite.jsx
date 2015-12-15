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

class TestingContext {

  constructor() {
    this.client = new Client()
  }

  createApp() {
    this.div = document.querySelector('#appUnderTest')
    this.app = React.render(<App client={this.client} />, this.div)
    return this.app
  }

  destroyApp() {
    if(! this.div) return
    React.unmountComponentAtNode(this.div)
    this.div = null
  }

  run(done, callback) {
    callback().then(() => {
      this.destroyApp()
      done()
    })
    .catch(done)
  }

}

mocha.setup('bdd')
mocha.timeout(5000)
mocha.slow(2000)

describe('todo app', function() {

  it('should add todo item', function(done) {
    let ctx = new TestingContext()
    ctx.run(done, () =>
      Promise.resolve()
      .then(() => ctx.createApp())
      .then(() => wait(() => ctx.div.querySelector('#todolist')))
      .then((todolist) => {
        todolist.querySelector('[name=text]').value = 'hello world'
        todolist.querySelector('button').click()
      })
      .then(() => wait(() => ctx.div.querySelector('#todolist li .text')))
      .then((item) => {
        chai.assert.equal(item.textContent, 'hello world')
      })
    )
  })

})

mocha.run()
