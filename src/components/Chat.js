import React from 'react';
import { connect } from 'react-redux';
import socketIO from 'socket.io-client';
// import './WebRTC';
// import photo from '../assets/photo.jpeg';
// const Peer = require('simple-peer');
const Modal = (props) => {
  return (
    <div>
      <input onChange={props.childHandleChange} value={props.value} id='updateMessage' type='text' placeholder='Type message...' /><br />
      <button id='send-btn' onClick={() => props.handleEdit(props.delAbleId)}> Send </button>
    </div>
  )
}
class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: null,
      isLoading: false,
      messages: [],
      status: 'NaN',
      resMessage: '',
      eventUser: '',
      delAbleId: '',
      updateFieldVal: '',
      isModalVisible: false
    }
  }

  componentWillMount() {
    this.socketConnection()
  }

  componentDidMount() {
    this.getAllMessages()
  }
  getAllMessages = () => {
    console.log('get')
    const { socket } = this.state;
    socket.emit('get_all_messages')
    socket.on('get_all_messages', (data) => {
      this.setState({ messages: data })
    })
  }

  socketConnection = () => {
    const socketURL = 'http://localhost:8000/';
    const socket = socketIO(socketURL)
    this.setState({
      socket,
    })
    socket.on('connection', (s) => {
      console.log('Successfully connected in Client :', s)
    })
  }

  chatHandle = () => {
    const { socket } = this.state
    const feedback = document.getElementById('feedback')
    const message = document.getElementById('message')
    const user = document.getElementById('user')

    socket.emit('chat', {
      message: message.value,
      user: user.value
    })

    socket.on('get_chat', (data) => {
      feedback.innerHTML = ''
      console.log('Data check :', data)
      this.setState((prevState) => ({
        messages: [...prevState.messages, data]
      }))
    })
  }

  feedbackHandle = () => {
    const { socket } = this.state;
    const feedback = document.getElementById('feedback')
    const user = document.getElementById('user');

    socket.emit('typing', user.value)

    socket.on('typing', (data) => {
      feedback.innerHTML = '<p><em>' + data + ' is typing message... </em></p>'
    })
  }

  handleEdit = (id) => {
    const { socket, updateFieldVal } = this.state;
    this.setState({isLoading: true})
    const data = {
      id: id,
      message: updateFieldVal
    }
    socket.emit('update_entry', data)
    socket.on('update_entry', (data) => {
      console.log(data.doc.message)
      this.setState({ resMessage: data.message, delMessage: data.doc.message, delID: data.doc._id, eventUser: data.doc.user, isLoading: false, isModalVisible: false })
    })
  }

  handleDelete = (id) => {
    const { socket } = this.state;
    this.setState({ isLoading: true })
    socket.emit('delete_entry', id)
    socket.on('delete_entry', (res) => {
      this.setState({ resMessage: res.message, eventUser: res.doc.user, delMessage: res.doc.message, delID: res.doc._id, isLoading: false })
    })
  }
  handleKeyUp = () => {
    console.log('trigger')
  }
  toogleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible })
  }
  childHandleChange = (e) => {
    this.setState({ updateFieldVal: e.target.value })
  }


  // peerSignalhandle = () => {
  //   const { peer1Id } = this.state
  //   navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((MediaStream) => {
  //     let peer1 = new Peer({
  //       initiator: true,
  //       trickle: false,
  //       stream: MediaStream
  //     })
  //     let peer2 = new Peer()

  //     peer1.on('signal', (data) => {
  //       peer2.signal(data)
  //     })

  //     peer2.on('signal', (data) => {
  //       peer1.signal(data)
  //     })
  //     peer1.on('connect', () => {
  //       // wait for 'connect' event before using the data channel
  //       peer1.send('df896')
  //     })

  //     peer2.on('data', (data) => {
  //       // got a data channel message
  //       console.log('got a message from peer1: ' + data)
  //     })
  //     peer2.on('stream', (stream) => {
  //       const video = document.querySelector('video');
  //       const canvas = document.getElementById('preview')
  //       const context = canvas.getContext("2d")
  //       const broadcastVideo = document.getElementById('broadcastVideo')
  //       context.drawImage(broadcastVideo, 0, 0, context.width, context.height)
  //       canvas.width = 800;
  //       canvas.height = 600;
  //       context.width = canvas.width;
  //       context.height = canvas.height
  //       video.srcObject = stream;
  //       broadcastVideo.srcObject = stream
  //       video.play()
  //     })
  //   })
  //     .catch(err => console.log('Peer Error :', err))
  // }
  render() {
    if (this.state.isLoading) {
      return (
        <div>
          <h3>Loading.......</h3>
          {this.getAllMessages()}
        </div>
      )
    }
    if (this.state.isModalVisible) {
      return (
        <div>
          <Modal
            toogleModal={this.toogleModal}
            handleEdit={this.handleEdit}
            feedbackHandle={this.feedbackHandle}
            delAbleId={this.state.delAbleId}
            childHandleChange={this.childHandleChange}
            value={this.state.updateFieldVal}
          />
        </div>
      )
    }
    return (
      <div>
        <div id='mario-chat'>
          <div id='chat-window'>
            {/* <video autoPlay={true}></video>
            <video id='broadcastVideo' autoPlay={true} /> */}
            <div id='output'>
              <canvas id='preview'></canvas>
              {
                this.state.messages.length === 0 ? 'Empty Box' : this.state.messages.map((sms, index) => {
                  return <ul key={index} style={{ listStyle: 'none' }}>
                    <li><b>Name:  </b><em> {sms.user}</em> <br />
                      <p style={{ marginLeft: 60 }}>
                        <b>Message:  </b> {sms.message} </p><div onClick={() => this.setState({ delAbleId: sms._id }, () => this.toogleModal())}>Edit</div> </li>
                    <div onClick={() => this.handleDelete(sms._id)}>Delete</div>
                  </ul>
                })
              }
            </div>
            <div id='feedback'></div>
          </div>
          <input id='user' type='text' placeholder='Username' /><br />
          <input id='message' type='text' placeholder='Type message ...' onKeyPress={this.feedbackHandle} onKeyUp={this.handleKeyUp} /><br />
          <button id='send-btn' onClick={this.chatHandle}> Send </button>
          {/* <div>
                    <button id="startButton">Start</button>
                    <button id="callButton">Call</button>
                    <button id="hangupButton">Hang Up</button>
                  </div> */}
          <button id='send-btn' onClick={this.peerSignalhandle}>Camera </button>
          <h1>{this.state.eventUser}</h1>
          <h2>{this.state.resMessage}</h2>
          <h3>ID :{this.state.delID}</h3>
          <h4>Record: {this.state.delMessage}</h4>
          {/* <button id='send-btn' onClick={this.clearLocal}>clearLocal </button> */}
        </div>
        {/* { this.state.isLoading === false ? this.imageBroadcast()  : '' } */}
      </div>
    )

  }
}
const mapStateToProps = (state) => {
  return {
    getTodos: state.TodoReducer
  }
}
export default connect(mapStateToProps)(Chat)
