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

  flushDb() {
    return this.client.post('/_flush')
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

  waitFor(selector) {
    return wait(() => this.div.querySelector(selector))
  }

}

mocha.setup('bdd')
mocha.timeout(5000)
mocha.slow(2000)

describe('todo app', function() {

  it('should add todo item', function(done) {
    let ctx = new TestingContext()
    ctx.run(done, () =>
      ctx.flushDb()
      .then(() => ctx.createApp())
      .then(() => ctx.waitFor('#todolist'))
      .then((todolist) => {
        todolist.querySelector('[name=text]').value = 'hello world'
        todolist.querySelector('button').click()
      })
      .then(() => ctx.waitFor('#todolist li .text'))
      .then((item) => {
        chai.assert.equal(item.textContent, 'hello world')
      })
    )
  })

  it('should delete todo item', function(done) {
    let rowId
    let ctx = new TestingContext()
    ctx.run(done, () =>
      ctx.flushDb()
      .then(ctx.client.post('/todos', {text: 'hello world'}))
      .then((res) => { rowId = res.id })
      .then(() => ctx.createApp())
      .then(() => ctx.waitFor('#todolist li .delete'))
      .then((del) => { del.click() })
      .then(() => wait(() =>
        ctx.div.querySelector('#todolist li') === null
      ))
    )
  })

})

mocha.run()
