import React from "react";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import SignUp from "./sign up.jsx"
import SignIn from "./sign in.jsx"
import Main from "./Mainchannel.jsx"
import Navbar from "./navbar.jsx"
import Channel from "./channels.jsx"
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
const axios = require('axios')
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isConnected:false,channel_list:[]};
    this.connected=this.connected.bind(this)
    this.handelchange=this.handelchange.bind(this)
    this.description=this.description.bind(this)
    this.create=this.create.bind(this)
  }
connected(){
  this.setState({isConnected:true})
setInterval(()=>{
  axios.get('/channel_list').then((data)=>{
    this.setState({channel_list:data.data})
  })
},2000)

}
handelchange(event){
  this.setState({newchannel:event.target.value})
}
description(event){
  this.setState({description:event.target.value})
}
create(){
  axios({
    method: 'post',
    url: '/create_new_channel',
    data: {
      description: this.state.description,
      name: this.state.newchannel
    }
  })
}
  render() {
    return (
      <Router>
        <Switch>
        <div>
        <Navbar/>
        {this.state.isConnected?
        <div style={{position:"absolute",marginLeft:"80vw",marginTop:'5vh'}}>
          <TextField
          onChange={this.handelchange}
          id="outlined-password-input"
          label="create channel"
          type="create channel"
          autoComplete="create channel"
          variant="outlined"
        />
        <TextField
          onChange={this.description}
          id="outlined-password-input"
          label="description"
          type="description"
          autoComplete="description"
          variant="outlined"
        />
        <Button variant="contained" color="primary" onClick={this.create}>
             create
          </Button>
        </div>
        :null}
        {this.state.channel_list.length?<div style={{border:"solid 1px grey",position:"absolute",marginLeft:"5vw",marginTop:"10vh",padding:"10px"}}> 
          <div>
            Channel List:
          <div>
          <li> <Link to="/main_channel">
          Main Channel
          </Link></li>
          </div>
          
          <br/>
        {this.state.channel_list.map((value, index) => {
          var link=+value.name
          console.log(value)
        return <Link to={"/channel/"+value.name}><li key={index}>
          
          {value.name}
         
          </li>
          </Link>
      })}
        </div>
        </div>:null}
        <Route path="/SignIn" >
          <SignIn connected={this.connected}/>
        </Route>
        <Route path="/SignUp">
        <SignUp/>
        </Route>
        <Route path="/main_channel">
        <Main />
        </Route>
        <Route path="/channel/:channelname" children={<Channel />} />
        
        </div>
        </Switch>
      </Router>
    );
  }
}

export default App;
