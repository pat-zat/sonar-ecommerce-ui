import React from 'react';

const SizeFilter = (props) => {

    return (
        <div className="flexcol">
                    <h3>Diameter</h3>            
                    <div className="size-filter">
                        <div className="flexrow">
                            {props.diameters[0]}

                            {props.diameters.value.map( (diams, index)  =>
                                <div className="small-number-filter" key={index} value={diams} >{diams}</div>                                                   
                            )}
                        </div>
                        {/* <div className="small-number-filter">2"</div>
                        <div className="small-number-filter">3"</div>
                        <div className="small-number-filter">5"</div> */}
                    </div>
                </div>
    )
}

export default SizeFilter