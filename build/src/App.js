import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Particles from 'react-particles-js';
import './App.css';
import 'tachyons'
import Clarifai from 'clarifai';

// This is my own api key
const app = new Clarifai.App({
  apiKey: 'de0373b3e78b45f88765b4a36ec18e4b'
 });

const particlesOptions2 = {
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
        value_area:500
      }
    }
  }
}



class App extends Component {
  // we need to create "state" to let the app knows what value the user entered
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      faceBox: {}, //empty object
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        password: '',
        entries: 0,
        join: ''
      }
    };
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      password: data.password,
      entries: data.entries,
      join: data.join
    }})
  }

  // connect to the back-end
  componentDidMount() {
    fetch('http://localhost:3000')
      .then(response => response.json())
      .then(console.log)
  }


  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    // console.log(width, height)
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height),
    }
  }

  displayFaceBox = (box) => {
    this.setState({faceBox: box});
  }

  onInputChange = (event) => {
   this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL, 
        this.state.input
        )
      // .then(response => console.log(response))
      .then(response => {
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count }))
          })
        }  
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err=>console.log(err));
  }

  onRouteChange = (value) => {
    if (value === 'signout') {
      this.setState({isSignedIn: false})
    } else if (value === 'youarein') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: value});
  }

  // onRouteBack = () => {
  //   this.setState({route: 'signin'});
  // }

  render() {
    const { isSignedIn, imageUrl, route, faceBox} = this.state;
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions2} 
        />
        <Navigation 
          isSignedIn={isSignedIn} 
          onRouteChange={this.onRouteChange} 
        />
        { route === 'youarein'
          ? <div>
              <Logo />
              <Rank 
                name={this.state.user.name}
                entries={this.state.user.entries}
              />
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition
                faceBox = {faceBox} 
                imageUrl = {imageUrl}
              />
            </div>
          : (
            route === 'signin'
            ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )
        }
      </div>
    );
  }
  
}

  

export default App;



// const particlesOptions = {
//   particles: {
//     line_linked: {
//       shadow: {
//         enable: true,
//         color: "#3CA9D1",
//         blur: 1
//       }
//     }
//   }
// }

// function App() {
//   return (
//     <div className="App">
//       <Particles className='particles'
//         params={particlesOptions2} 
//       />
//       <Navigation />
//       <Logo />
//       <Rank />
//       <ImageLinkForm />
//       {/* <FaceRecognition />} */}
//     </div>
//   );
// }