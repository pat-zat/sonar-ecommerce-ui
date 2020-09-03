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
            term: ''
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
       // console.log(this.props.filterSet[0]);
    }

    //state = { term: ''};
//     onFilterClick = event => {
//         event.preventDefault();
//         this.props.onFilter(this.state.term);
//     }

handleFilterChange = value => {
    let val = value;
    
   //let prod = this.state.products.data.data.map(prod => prod);
   //console.log(prod.filter(prods => prods.descriptionLong.includes({val})));
   //console.log(this.state.products.data.data.map(prod => prod));
    this.setState({ 
        term: val,
      
    }, () => {
        this.props.onFilter(this.state.term);
    });

  };


    render() {
        return (
            
            <div className="filterbar open">           
              
            {/* 
              {this.props.filterSet.map((filterSet, index) =>
                    <div>
                        <h2 key={index} >{filterSet.filter}</h2>
                        {filterSet.value.map( (filterVals, index)  =>
                                <div key={index} value={filterVals} onClick={this.handleFilterChange.bind(this,filterVals)}>{filterVals}</div>                                                   
                            )}
                    </div>                  
                )} */}


                <FilterHeader filterSetTitle="gauge" FilterSetIcon="gaugeCatIcon" />

                <hr />

                <div className="digi"><SvgDigilog className="" /></div>

                <hr />

                <StyleFilter />

                <hr />

                <TypeFilter />

                <hr />

                {/* <SizeFilter diameters={this.props.filterSet[0]} /> */}

                <div className="flexcol">
                    <h3> {this.props.filterSet[0].filter}</h3>            
                    <div className="size-filter">
                        <div className="flexrow">
                           

                            {this.props.filterSet[0].value.map( (diams, index)  =>
                                <div onClick={this.handleFilterChange.bind(this,diams)} className="small-number-filter" key={index} value={diams} >{diams}</div>                                                   
                            )}
                        </div>
                        {/* <div className="small-number-filter">2"</div>
                        <div className="small-number-filter">3"</div>
                        <div className="small-number-filter">5"</div> */}
                    </div>
                </div>

            </div>

        )
    }
}

export default SonarFilter