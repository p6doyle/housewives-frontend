import React from 'react';
import logo from './logo.svg';
import './App.css';
import Homepage from "./containers/Homepage.js"
import IndexPage from "./containers/IndexPage.js"
import ShowPage from "./containers/ShowPage.js"
import Menu from "./containers/Menu.js"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

let HOUSEWIVES_URL = "https://realhousewives-backend.herokuapp.com/housewives"

class App extends React.Component {

  constructor(){
    super()
      this.state={
        menu_on: false,
        allHousewives: [],
        reverse: false
      }
  }

  componentDidMount(){
  fetch(HOUSEWIVES_URL)
  .then(res => res.json())
  .then(data => {
    console.log(data)
    let sorted = data.sort(this.dynamicSort("firstname"))
    this.setState({allHousewives: sorted})
    })
  }

  dynamicSort = (property) => {
    var sortOrder = 1;

    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }

    return function (a,b) {
        if(sortOrder == -1){
            return b[property].localeCompare(a[property]);
        }else{
            return a[property].localeCompare(b[property]);
        }
    }
}

  filterName = (e) => {
    if (this.state.reverse) {
      let allHousewives = this.state.allHousewives
      let sorted = allHousewives.sort(this.dynamicSort("firstname"));
      console.log(sorted)
      this.setState({allHousewives: sorted, reverse: false})
    } else {
      let allHousewives = this.state.allHousewives
      let sorted = allHousewives.sort(this.dynamicSort("-firstname"));
      console.log(sorted)
      this.setState({allHousewives: sorted, reverse: true})
    }
  }

  filterCity = (e) => {
    if (this.state.reverse) {
      let allHousewives = this.state.allHousewives
      let sorted = allHousewives.sort(this.dynamicSort("-city"));
      console.log(sorted)
      this.setState({allHousewives: sorted, reverse: false})
    } else {
      let allHousewives = this.state.allHousewives
      let sorted = allHousewives.sort(this.dynamicSort("city"));
      console.log(sorted)
      this.setState({allHousewives: sorted, reverse: true})
    }
  }

  filterTenure = (e) => {
    if (this.state.reverse) {
      let allHousewives = this.state.allHousewives
      let sorted = allHousewives.sort(function(a, b) {
        return b.totalseasons - a.totalseasons;
      });
      console.log(sorted)
      this.setState({allHousewives: sorted, reverse: false});
    } else {
      let allHousewives = this.state.allHousewives
      let sorted = allHousewives.sort(function(a, b) {
        return a.totalseasons - b.totalseasons;
      });
      console.log(sorted)
      this.setState({allHousewives: sorted, reverse: true})
    }
  }

  citySort = (hw) => {
    if (hw.city === "Atlanta") {
      return hw.city === "Atlanta";
    }
    // else if (hw.city === "Beverly Hills") {
    //   return hw.city === "Beverly Hills";
    // }
    // else if (hw.city === "Orange County") {
    //   return hw.city === "Orange County";
    // }
  }


  // settingCityHW = () => {
  //   let allHousewives = this.state.allHousewives
  //   this.setState(this.initialState)
  //   let cityHW = allHousewives.filter(this.citySort)
  //   console.log(cityHW)
  //   this.setState({allHousewives: cityHW, menu_on: false})
  // }

  settingCityHW = () => {
    let allHousewives = this.state.allHousewives
    let cityHW = allHousewives.filter(function(hw){
      return hw.city === "Atlanta"})
    this.setState({allHousewives: cityHW, menu_on: false})}

  openMenu = () => {
    {this.state.menu_on === false ?
      this.setState({menu_on: true}) :
      this.setState({menu_on: false})
    }
  }

  indexOrMenu = (routerProps) => {
    return (this.state.menu_on === false ?
      <IndexPage
      openMenu={this.openMenu}
      menu_on={this.state.menu_on}
      allHousewives={this.state.allHousewives}
      filterName={this.filterName}
      filterCity={this.filterCity}
      filterTenure={this.filterTenure}
      routerProps={routerProps}/> :
      <Menu
      openMenu={this.openMenu}
      menu_on={this.state.menu_on}/>)
  }

  findHW = (routerProps) => {
    let housewifeId = parseInt(routerProps.match.params.id)
    let selectedHousewife = this.state.allHousewives.find(hw => hw.id === housewifeId)
    return <ShowPage selectedHW={selectedHousewife}
    openMenu={this.openMenu}
    menu_on={this.state.menu_on}/>}

  render(){
  	return (
      <Router>
        <div>
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/home" />} />

          <Route path="/home">
            {
              this.state.menu_on === false ?
              <Homepage
              openMenu={this.openMenu}
              menu_on={this.state.menu_on}/>
              :
              <Menu
              openMenu={this.openMenu}
              menu_on={this.state.menu_on}
              settingCityHW={this.settingCityHW}
              />
            }
          </Route>

          {
            this.state.menu_on === false ?
            <Route path={`/housewives/:id`}
            render={this.findHW}
            openMenu={this.openMenu}
            menu_on={this.state.menu_on}/>
            :
            <Menu
            openMenu={this.openMenu}
            menu_on={this.state.menu_on}
            settingCityHW={this.settingCityHW}
            />
          }

          {
            this.state.menu_on === false ?
            <Route path="/housewives" render={this.indexOrMenu}
            openMenu={this.openMenu}
            menu_on={this.state.menu_on}/>
            :
            <Menu
            openMenu={this.openMenu}
            menu_on={this.state.menu_on}
            settingCityHW={this.settingCityHW}
            />
          }
        </Switch>
        </div>
      </Router>
  	);
  }

};

export default App;


// <Router>
//   <div>
//     <Route exact path="/" render={() => <Redirect to="/home" />} />
//     <Route path="/home">
      // {
      //   this.state.menu_on === false ?
      //   <Homepage
      //   openMenu={this.openMenu}
      //   menu_on={this.state.menu_on}/>
      //   :
      //   <Menu
      //   openMenu={this.openMenu}
      //   menu_on={this.state.menu_on}
      //   />
      // }
//     </Route>
//     <Switch>
//     <Route path={`/housewives/:id`}
//     render={this.findHW}
//     openMenu={this.openMenu}
//     menu_on={this.state.menu_on}/>
//
//     <Route path="/housewives" render={this.indexOrMenu}
//     openMenu={this.openMenu}
//     menu_on={this.state.menu_on}/>
//     </Switch>
//   </div>
// </Router>



