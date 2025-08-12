import React, { Component } from 'react';
import './ErrorBoundary.scss';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    handleReload = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/home';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <div className="error-content">
                        <div className="error-icon">
                            <i className="fa fa-exclamation-triangle"></i>
                        </div>
                        <h2>Đã xảy ra lỗi</h2>
                        <p>Rất tiếc, đã có lỗi xảy ra. Vui lòng thử lại sau.</p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="error-details">
                                <summary>Chi tiết lỗi (chỉ hiển thị trong môi trường development)</summary>
                                <pre>{this.state.error.toString()}</pre>
                                <pre>{this.state.errorInfo.componentStack}</pre>
                            </details>
                        )}

                        <div className="error-actions">
                            <button
                                className="btn btn-primary me-2"
                                onClick={this.handleReload}
                            >
                                <i className="fa fa-refresh me-1"></i>
                                Tải lại trang
                            </button>
                            <button
                                className="btn btn-outline-secondary"
                                onClick={this.handleGoHome}
                            >
                                <i className="fa fa-home me-1"></i>
                                Về trang chủ
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
