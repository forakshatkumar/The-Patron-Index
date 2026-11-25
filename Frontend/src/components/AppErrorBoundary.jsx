import { Component } from 'react'
export default class AppErrorBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError () { return { failed: true } }
  render () {
    if (this.state.failed) return <main className='session-state' role='alert'><h2>Something went wrong</h2><p>Reload the workspace to try again. Your saved data remains on the server.</p><button className='primary-button' onClick={() => window.location.reload()}>Reload application</button></main>
    return this.props.children
  }
}
