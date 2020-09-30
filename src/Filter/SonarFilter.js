// UncontrolledLottie.jsx
import React, { Component } from 'react';
import SvgDigilog from './SvgDigilog';
import $ from 'jquery';
import FilterHeader from './Filterheader';
import StyleFilter from './StyleFilter';
import TypeFilter from './TypeFilter';
import SizeFilter from './SizeFilter';
import SvgSterlingGauge from './SvgSterlingGauge';

let mCustomScrollbar = '';

const scrollBarLoaded = () => {
    return new Promise((resolve, reject) => {
        const scrollStyle = document.createElement('link')
        scrollStyle.type = 'text/css'
        scrollStyle.rel = 'stylesheet'
        scrollStyle.href = 'https://cdnjs.cloudflare.com/ajax/libs/malihu-custom-scrollbar-plugin/3.1.5/jquery.mCustomScrollbar.min.css'
        document.getElementsByTagName('head')[0].appendChild(scrollStyle);

        const scrollScript = document.createElement('script')
        scrollScript.onload = resolve
        scrollScript.onerror = reject
        scrollScript.id = 'scroll_script'
        scrollScript.async = true
        scrollScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/malihu-custom-scrollbar-plugin/3.1.5/jquery.mCustomScrollbar.concat.min.js'
        document.body.appendChild(scrollScript)
    })
}
class SonarFilter extends Component {
    filterBarUrl = 'http://10.92.48.29:9002/api/IconFilters/Details/Gauges';
    init = { method: 'GET', accept: 'application/json', headers: {} };
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            collapsed: false,
            closed: true,
            term: []
        };
    }
    componentDidMount() {
        window.jQuery = $
        scrollBarLoaded().then(() => {
            mCustomScrollbar = window.mCustomScrollbar
            $('.filterbar').mCustomScrollbar({
                theme: 'dark'
            })
        })


        
    }


    //term should be an empty array of objects to mirror the data for multiple filters at a time
    //each time you filter it will be a new set of paramaters applied to the unchanging aka immutable state.products

    //terms: [{filter: '', values:['']}]

    //this.setState({ myArray: [...this.state.myArray, 'new value'] }) //simple value
    // this.setState({ myArray: [...this.state.myArray, ...[1,2,3] ] }) //another array

    // this.setState(prevState => ({
    //     myArray: [...prevState.myArray, {"name": "object"}]
    //   }))



    handleFilterChange = value => {
        let val = value;
        let terms = [...this.state.term];
        terms.push(val);
      
        console.log(terms);
        this.setState({
            term: terms,
             
        }, () => {
            this.props.onFilter(this.state.term);
        });

    };
   // onFilter={this.props.onFilter} => pass this into each filter

    render() {
        return (
            <div className="filterbar open">
                <FilterHeader filterSetTitle={this.props.cat} FilterSetIcon="gaugeCatIcon" />
                <hr />
                <div className="digi"><SvgDigilog className="" /></div>
                <hr />
                {/* <StyleFilter filterSet={this.props.filterSet[2]} onFilter={this.props.onFilter} /> */}
                <div>
            <h3>Style</h3>
                <div className="styleFilter">
                    <ul>                            {/*Back-ticks/rim-glow*/}
                    {this.props.filterSet[2].value.map((colors, index) =>
                        <li onClick={this.handleFilterChange.bind(this, colors)} className="" key={index} value={colors} >{colors}</li>
                    )}
                    </ul>
                    <SvgSterlingGauge rim="" center="" back="" />
                </div>
        </div>
                <hr />
                <TypeFilter  />
                <hr />
                <div className="flexcol">
                    <h3> {this.props.filterSet[0].filter}</h3>
                    <div className="size-filter">
                        <div className="flexrow">
                            {this.props.filterSet[0].value.map((diams, index) =>
                                <div onClick={this.handleFilterChange.bind(this, diams)} className="small-number-filter" key={index} value={diams} >{diams}</div>
                            )}
                        </div>
                    </div>
                </div>

            </div>

        )
    }
}

export default SonarFilter