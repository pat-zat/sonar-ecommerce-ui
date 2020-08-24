// UncontrolledLottie.jsx
import React, { Component } from 'react';
import SvgDigilog from './SvgDigilog';
import $ from 'jquery';
import FilterHeader from './Filterheader';
import StyleFilter from './StyleFilter';
import TypeFilter from './TypeFilter';
import SizeFilter from './SizeFilter';


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
    render() {
        return (
            <div className="filterbar open">           
                {this.props.filters.map(filterSet =>
                    <div>
                        {/* add switch on Filter for condtional rendering of jsx and svg */}
                        {filterSet.filter}
                        {filterSet.value.map(filterVals =>
                        // add onClick to filterVals to handle filtering of grid -> send filters as props and in child loader grid
                        // set defualt filter to the prop and also set the defualt filter value to '' none here
                                <div>{filterVals}</div>                               
                                // if (filterHasIcons = true) => for each filter value
                                // if filterValue = icon value get that icon and show it
                            )}
                    </div>                  
                )}


                <FilterHeader filterSetTitle="gauge" FilterSetIcon="gaugeCatIcon" />

                <hr />

                <div className="digi"><SvgDigilog className="" /></div>

                <hr />

                <StyleFilter />

                <hr />

                <TypeFilter />

                <hr />

                <SizeFilter />

            </div>

        )
    }
}

export default SonarFilter