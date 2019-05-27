import React from 'react';
import { TopBar } from './TopBar';
import { Main } from './Main';
import { TOKEN_KEY } from '../constants';

/**
 * // Component Composition         // Url
 * App --> TopBar (o)
 *     --> Main (o)
 *            --> Register (x)      /register
 *            --> Login    (o)      /login
 *            --> Home     (o)      /home
 */

class App extends React.Component {
    state = {
        isLoggedIn: !!localStorage.getItem(TOKEN_KEY)
    }

    handleLogin = (token) => {
        this.setState({ isLoggedIn: true });
        localStorage.setItem(TOKEN_KEY, token);
    }

    handleLogout = () => {
        this.setState({ isLoggedIn: false });
        localStorage.removeItem(TOKEN_KEY);
    }

    render() {
        const { isLoggedIn } = this.state;

        return (
            <div className="App">
                <TopBar isLoggedIn={isLoggedIn} handleLogout={this.handleLogout} />
                <Main isLoggedIn={isLoggedIn} handleLogin={this.handleLogin} />
            </div>
        );
    }
}

export default App;
