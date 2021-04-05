import React from "react";
import Container from '@material-ui/core/Container';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';

const axios = require('axios')


class Channel extends React.Component {
    
  constructor(props) {
    super(props);
    this.state = {messages:[],fetch:null};
    this.handelchange=this.handelchange.bind(this)
    this.sendmessage=this.sendmessage.bind(this)
  }
  
  componentDidMount(){

var url=window.location.href.split("channel")[1].slice(1)
console.log(url)
if(url.includes("%20")){
url=url.replace("%20", " ")
}
      this.setState({
          fetch: setInterval(() => {
            axios.get('/fetch_messages/'+url).then((data)=>{
                this.setState({messages:data.data})
                console.log(data.data)
            })
          }, 1000)
      })
  }
  componentWillUnmount(){
      clearInterval(this.state.fetch)
  }

  sendmessage(){
    var url=window.location.href.split("channel")[1].slice(1)
    if(url.includes("%20")){
    url=url.replace("%20", " ")
    }
    axios.post('/send_message/'+url, 
        {
          message:this.state.message,
          id:localStorage.getItem('id'),
          name:localStorage.getItem('name')
        }
    )
  }
  handelchange(event){
this.setState({message:event.target.value})
  }
  render() {
    return (
        <div style={{"marginTop":"10vh"}}> 
        <div style={{"background":"white","width":"50vw","height":'60vh',"margin":"auto"}}>
        {this.state.messages.map((value, index) => {
            if(value.user_id==localStorage.getItem("id")){
                return <li key={index}>{"Me"+":  "+ value.message}</li>
            }
            return <li key={index}>{value.name+":  "+ value.message}</li>
      })}
        </div>
        <br/>
        <Container maxWidth="sm">
            <div style={{"display":"flex"}}>
            <FormControl fullWidth>
          <InputLabel htmlFor="standard-adornment-amount">chat</InputLabel>
          <Input
             onChange={this.handelchange}
            id="standard-adornment-amount"
            startAdornment={<InputAdornment position="start">tap</InputAdornment>}
          />
        </FormControl>
        <Button variant="contained" color="primary" onClick={this.sendmessage}>
            send
         </Button>
            </div>

      </Container>
      </div>
    );
  }
}

export default Channel;
