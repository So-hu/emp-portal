import React, { Component } from 'react';
import { Chart } from "react-google-charts";
import store from "../../store/store";
 
class Piechart extends Component{

	state = { awards: [] }

	componentDidMount() {
		//console.log(store.getState().userData.userClass);

        if (store.getState().userData.userClass === "administrator"){
					fetch('/user/awardsgiven?id=' + "")
					.then(res => res.json())
					.then(awards => this.setState({ awards }));
        }
        else{
        let userAccountSettings = [];
        fetch('/user/account?email=' + store.getState().userName)
            .then(response => {
                return response.json();
            })
            .then(data => {
                //TODO: Need to add company name into the database
                userAccountSettings = data.map((user) => { return {id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email }})
                this.setState({userSettings: userAccountSettings});
                this.setState({ 
                    id: this.state.userSettings[0].id,
                    firstName: this.state.userSettings[0].firstName, 
                    lastName: this.state.userSettings[0].lastName,
                    email: this.state.userSettings[0].email,
                   });
                   //console.log("id sent " + this.state.id);
                   fetch('/user/awardsgiven?id=' + this.state.id)
                   .then(res => res.json())
                   .then((awards) => {
                     if(awards.eom === 0 || awards.eow === 0 || awards.hsm === 0 )
                     {
                       awards = {"eom":0,"eow":0,"hsm":0,"unknown":1};
                       this.setState({ awards });
                     }
                    //let numEmp = Object.keys(awards).length;
                    //numEmp = numEmp/2;
                    else{
                     this.setState({ awards })
                    }
                    });
            }).catch(error => {
              console.log(error);
            });
            

        }
	}

  render(){

    return(
      <div className="Piechart">
      <Chart
		  width={'600px'}
		  height={'400px'}
		  chartType="PieChart"
		  loader={<div>Loading Chart</div>}
		  data={[
		    ['Awards Given', 'Number of Awards'],
		    ['Employee of the Month', this.state.awards.eom],
				['Employee of the Week', this.state.awards.eow],
        ['Highest Sales in a Month', this.state.awards.hsm],
        ['N/A', this.state.awards.unknown]
		  ]}
		  options={{
		    title: 'Awards Given',
		    // Just add this option
		    pieHole: 0.5,
		  }}
		  rootProps={{ 'data-testid': '3' }}
		/>
      </div>
    )
  }
}

export default Piechart;