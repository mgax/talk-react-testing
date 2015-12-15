class Client {

  request(method, url, data) {
    let options = {headers: {}}
    options.headers['Accept'] = 'application/json'
    options.method = method
    if(data) {
      options.headers['Content-Type'] = 'application/json'
      options.body = JSON.stringify(data)
    }

    return fetch(url, options)
      .then((resp) => resp.json())
  }

  get(url) {
    return this.request('GET', url)
  }

  post(url, data) {
    return this.request('POST', url, data)
  }

}

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {todos: []}
  }

  render() {
    return (
      <div id='todolist'>
        <input ref='text' name='text' />
        <button
          onClick={(e) => {
            e.preventDefault()
            let input = this.refs.text
            this.add(input.value.trim())
            input.value = ''
          }}
          >add</button>
        <ul>
          {this.state.todos.map((todo) =>
            <li>
              <span className='text'>
                {todo.text}
              </span>
            </li>
          )}
        </ul>
      </div>
    )
  }

  componentWillMount() {
    this.update()
  }

  update() {
    this.props.client.get('/todos')
      .then((resp) => {
        this.setState({todos: resp.todos})
      })
  }

  add(text) {
    if(! text) return
    this.props.client.post('/todos', {text: text})
      .then(() => { this.update() })
  }

}

window.Client = Client
window.App = App
