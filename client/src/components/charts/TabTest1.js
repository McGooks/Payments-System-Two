import React, { Component } from 'react';
import tableau from 'tableau-api';
 
 
class Test1 extends Component {
  componentDidMount() {
    this.initViz()
  }
 
 
  initViz() {
    const vizUrl = 'https://tableau.iqeq.com/views/IQEQInvestorSolutions/Homepage?:embed=yes&:toolbar=no&:tabs=no&:device=phone&:showAppBanner=false&:display_count=n&:showVizHome=n&:origin=viz_share_link';
    const altVizURL =" https://public.tableau.com/views/NonprofitTrends/DigitalExperience?:embed=yes&:toolbar=no&:tabs=no&:device=tablet&:showAppBanner=false&:origin=viz_share_link"
    const aVizURl = "https://public.tableau.com/views/SalesByState_16129659738900/SalesbyState?:embed=yes&:toolbar=no&:tabs=no&:device=phone&:showAppBanner=false&:language=en-GB&:origin=viz_share_link"
    const vizContainer = this.vizContainer;
    let viz = new window.tableau.Viz(vizContainer, aVizURl)
  }
 
  render() {
    return (
      <div ref={(div) => { this.vizContainer = div }}>
      </div>
    )
  }
}
 

 
export default Test1;
