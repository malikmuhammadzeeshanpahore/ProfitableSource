import React from 'react'

export default class ErrorBoundary extends React.Component{
  constructor(props){ super(props); this.state = { error: null, info: null } }
  static getDerivedStateFromError(error){ return { error } }
  componentDidCatch(error, info){ this.setState({ error, info }) ; console.error('ErrorBoundary caught', error, info) }
  render(){
    if(this.state.error){
      return (
        <div className="card error-card">
          <h3>Something went wrong</h3>
          <p className="muted small">An unexpected error occurred while loading this page. You can try refreshing or navigate to another page.</p>
          <details className="error-details">
            <summary>Error details</summary>
            <div className="error-text">{String(this.state.error && this.state.error.toString())}</div>
            <div className="error-stack">{this.state.info && this.state.info.componentStack}</div>
          </details>
        </div>
      )
    }
    return this.props.children
  }
}
