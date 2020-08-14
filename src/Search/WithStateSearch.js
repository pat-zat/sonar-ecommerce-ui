import React from 'react';
import LoaderGrid from './LoaderGrid';
import WithStateGrid from './withStateGrid';

class WithStateSearch extends React.Component {
    constructor(props) {
        super(props);
        this.handlerA = this.handlerA.bind(this);
        this.state = {
            search: false,
            activeSearch: false,
        };
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
            search: false,
        });
    };

    searchStateChange = (e) => {
        e.preventDefault();
        this.setState({
            search: true,
            activeSearch: true,
        });
    }
   
    handlerA() {
        this.setState({ search: 'false' });
        console.log('searchHandler:  ' + this.state.search);
    }

    render() {
        return (
            <div className="simpleSearch" >
                <div className={this.state.activeSearch ? 'activeSearch' : 'searchCon'}>
                    <div className="flex">
                        <form className="searchBar" onSubmit={this.searchStateChange}>
                            <input style={{ maxWidth: '600px' }} className='activeSearch' placeholder="SEARCH" type="text" name="query" value={this.state.query} onChange={this.handleChange} />
                            <button ref="searchBtn" type={'submit'} className='k-button searchBtn'><span>Search</span></button>                           
                        </form>             
                    </div>             
                </div>

                {/* <LoaderGrid clear={this.handleClick} action={this.handlerA} search={this.state.search} query={this.state.query} activeSearch={this.state.activeSearch} /> */}

                <WithStateGrid clear={this.handleClick} action={this.handlerA} search={this.state.search} query={this.state.query} activeSearch={this.state.activeSearch} />
            </div>
        );
    }
}

export default WithStateSearch;