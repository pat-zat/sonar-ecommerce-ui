import React from 'react';
import SvgSterlingGauge from './SvgSterlingGauge';

const StyleFilter = () => {


    return (
        <div>
            <h3>Style</h3>
                <div className="styleFilter">
                    <ul>                            {/*Back-ticks/rim-glow*/}
                        <li>Black Premier</li>      {/*blk white-blu / black*/}
                        <li>White Premier</li>      {/*white-black /stainless*/}                  
                        <li>Driftwood</li>          {/* lightGray-black/darkGray-white*/}                  
                        <li>Lido pro</li>           {/*black-white/silver*/}        
                        <li>Argent</li>             {/*silver-black/white-red*/}       
                        <li>Sahara</li>             {/*light tan rim + dark Metal*/}      
                        <li>Sterling</li>           {/*silver -black*/}        
                        <li>Black sterling</li>     {/*black silver*/}             
                        <li>Amega</li>              {/*black-(white+red)*/}    
                        <li>Arctic</li>             {/*white-black/white*/}   
                        <li>Eclipse</li>            {/*black white blue*/}
                    </ul>
                    <SvgSterlingGauge />
                </div>
        </div>
    );
};

export default StyleFilter