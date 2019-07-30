import React, { Component } from 'react'
import { socket } from '../Socket-Config/Socket-Config';
export default class Status extends Component {
    state = {
        status: ''
    }
    componentDidMount() {
        socket.on('default_data', (result) => {
            console.log(result)
            // this.setState({ status: result.status })
        })
    }

    cancelStatus = () => {
        socket.emit('status', 'Cancel')
        socket.on('status', (result) => {
            this.setState({ status: result.status })
        })
    }
    orderedStatus = () => {
        socket.emit('status', 'Ordered')
        socket.on('status', (result) => {
            this.setState({ status: result.status })
        })
    }
    proceedStatus = () => {
        socket.emit('status', 'Proceed')
        socket.on('status', (result) => {
            this.setState({ status: result.status })
        })
    }

    render() {
        const { status } = this.state;
        return (
            <div>
                <h1>Status component</h1>
                <h3>Status: {status}</h3>
                <button id='send-btn' onClick={this.cancelStatus}>Cancel</button>
                <button id='send-btn' onClick={this.orderedStatus}>Ordered</button>
                <button id='send-btn' onClick={this.proceedStatus}>Proceed</button>
            </div>
        )
    }
}

