import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Aggiorna lo stato in modo che l'UI di fallback sia mostrata
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Salva i dettagli dell'errore nello stato per il debug
    this.setState({ error, errorInfo });
    console.error("Errore catturato dall'Error Boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Mostra i dettagli dell'errore durante il debug
      return (
        <div>
          <h1>Qualcosa è andato storto. Riprova più tardi.</h1>
          <details style={{ whiteSpace: "pre-wrap" }}>
            <summary>Dettagli dell'errore (clicca per espandere)</summary>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}