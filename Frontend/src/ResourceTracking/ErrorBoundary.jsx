import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  render() {
    if (this.state.error) {
      return (
        <div className="h-[100dvh] w-full bg-[#05080f] flex items-center justify-center p-8">
          <div className="max-w-md text-center">
            <div className="w-10 h-10 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <span className="text-red-400 text-lg font-bold">!</span>
            </div>
            <p className="text-sm text-red-400 font-mono mb-2">Component error</p>
            <p className="text-[11px] text-cool-gray/40 font-mono leading-relaxed break-all">
              {this.state.error?.message || 'Unknown error'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded
                bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer"
            >
              Reload
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
