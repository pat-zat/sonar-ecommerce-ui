import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import axios from "axios";

function getParams(location) {
  const searchParams = new URLSearchParams(location.search);
  return {
    query: searchParams.get("query") || ""
  };
}

function setParams({ query }) {
  const searchParams = new URLSearchParams();
  searchParams.set("query", query || "");
  return searchParams.toString();
}

const MainPage = props => {
  const { query, history } = props;
  return (
    <div>
      <InputPage history={history} />
      <h2>{`My query: ${query}`}</h2>
      <ResultsPage query={query} />
    </div>
  );
};

class InputPage extends React.Component {
  state = { inputValue: "" };
  updateInputValue = e => this.setState({ inputValue: e.target.value });
  updateURL = () => {
    const url = setParams({ query: this.state.inputValue });
    this.props.history.push(`?${url}`);
  };
  render() {
    return (
      <div id="search">
        <input
          type="text"
          className="input"
          placeholder="What am I looking for ?"
          value={this.state.inputValue}
          onChange={this.updateInputValue}
        />
        <input
          type="button"
          className="button"
          value="Search"
          onClick={this.updateURL}
        />
      </div>
    );
  }
}

const httpClient = axios.create({
  baseURL: "https://api.github.com"
});

class ResultsPage extends React.Component {
  state = { results: [], loading: false, error: false };

  searchRepositories = query => {
    if (!query) {
      return this.setState({
        results: []
      });
    }
    this.setState({ loading: true, error: false });
    return httpClient
      .get(`/search/repositories?q=${query}`)
      .then(({ data }) =>
        this.setState({
          results: data.items,
          loading: false
        })
      )
      .catch(e => this.setState({ loading: false, error: true }));
  };

  componentDidMount() {
    return this.searchRepositories(this.props.query);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.query !== this.props.query) {
      this.setState({ query: nextProps.query });
      return this.searchRepositories(nextProps.query);
    }
  }
  render() {
    if (this.state.loading) {
      return <div className="loading">Loading ... </div>;
    }
    if (this.state.error) {
      return <div className="error">An error occured ... </div>;
    }
    if (this.state.results.length === 0) {
      return <div className="no-results">No results</div>;
    }
    return (
      <div>
        {this.state.results.map(repo => (
          <div className="repo" key={repo.id}>
            <a className="repo-link" href={repo.html_url}>
              {repo.name}
            </a>
            <div className="repo-owner">{`by ${repo.owner.login}`}</div>
          </div>
        ))}
      </div>
    );
  }
}

const App = () => (
  <React.Fragment>
    <Router>
      <React.Fragment>
        <Route
          path="/"
          render={({ location, history }) => {
            const { query } = getParams(location);
            return <MainPage query={query} history={history} />;
          }}
        />
      </React.Fragment>
    </Router>
  </React.Fragment>
);

render(<App />, document.getElementById("root"));
