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
      </div>
    )
  }

  add(text) {
    if(! text) return
    this.props.client.post('/todos', {text: text})
  }

}

window.Client = Client
window.App = App
