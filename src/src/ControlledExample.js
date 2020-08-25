import React from 'react';

class SearchInputUncontrolled extends React.Component {
    onInputChange() {
        console.log(event.target.value)
    }
    render() {
        return (
            <div>
                <form>
                    <div>
                        <label>Search</label>
                        {/* function syntax - defines function above */}
                        <input onChange={this.onInputChange} />
                        {/* abbreviated syntax - defines function inline*/}
                        <input onChange={(e) => console.log(e.target.value)} />
                    </div>
                </form>
            </div>
        );
    }
}
export default SearchInputUncontrolled;

class SearchInputControlled extends React.Component {  
    //1 initialized state and define new prop called term
    state = { term: ''};
    render() {
        return (
            <div>
                <form>
                    <div>
                        <label>Search</label>                       
                        {/*2 used setState to update state on every change and added value prop set to term*/}
                        <input value={this.state.term} onChange={e => this.setState({ term: e.target.value })} />
                    </div>
                </form>
            </div>
        );
    }
}
export default SearchInputControlled;