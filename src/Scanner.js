import React, { Component } from 'react';
import Quagga from '@ericblade/quagga2';

export default class Scanner extends Component {
    constructor(props) {
        super(props);

        this.state = {errorMessage: null}
        this._onDetected = this._onDetected.bind(this);
    }

    componentDidMount() {

        const markError = (err) => this.setState({errorMessage: "Camera was not found"});
        Quagga.init(
            {
                inputStream: {
                    type: 'LiveStream',
                    constraints: {
                        width: 640,
                        height: 480,
                        facingMode: 'environment', // or user
                    },
                },
                locator: {
                    patchSize: 'medium',
                    halfSample: true,
                },
                numOfWorkers: 0,
                decoder: {
                    readers: ['ean_reader', 'ean_8_reader'],
                },
                locate: true,
            },
            function(err) {
                if (err) {
                    markError(err);
                    return console.log(err);
                }
                Quagga.start();
            }
        );
        Quagga.onDetected(this._onDetected);
    }

    componentWillUnmount() {
        Quagga.offDetected(this._onDetected);
    }

    _onDetected(result) {
        this.props.onDetected(result);
    }

    render() {
        return <>
            {this.state.errorMessage && 'Error' + this.state.errorMessage}
            <div id="interactive" className="viewport" />
        </>;
    }
}
