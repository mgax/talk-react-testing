function time() {
  return new Date().getTime()
}

function sleep(t) {
  return new Promise((resolve) => {
    setTimeout(resolve, t)
  })
}

async function wait(callback) {
  let t0 = time()
  while(true) {
    if(time() - t0 > 2000) throw new Error('timeout')
    let rv = callback()
    if(rv) return rv
    await sleep(50)
  }
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

  waitFor(selector) {
    return wait(() => this.div.querySelector(selector))
  }

}

mocha.setup('bdd')
mocha.timeout(5000)
mocha.slow(2000)

describe('todo app', function() {

  it('should add todo item', async function() {
    let ctx = new TestingContext()
    await ctx.flushDb()
    await ctx.createApp()
    let todolist = await ctx.waitFor('#todolist')
    todolist.querySelector('[name=text]').value = 'hello world'
    todolist.querySelector('button').click()
    let item = await ctx.waitFor('#todolist li .text')
    chai.assert.equal(item.textContent, 'hello world')
    await ctx.destroyApp()
  })

  it('should delete todo item', async function() {
    let ctx = new TestingContext()
    await ctx.flushDb()
    await ctx.client.post('/todos', {text: 'hello world'})
    await ctx.createApp()
    let del = await ctx.waitFor('#todolist li .delete')
    await del.click()
    await wait(() => ctx.div.querySelector('#todolist li') === null)
    await ctx.destroyApp()
  })

})

mocha.run()
