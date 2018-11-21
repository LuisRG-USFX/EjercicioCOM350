import React, { Component } from 'react';
import './css/SurveyForm.css';

class SurveyForm extends Component {

    constructor(props){
        super(props);
        this.state = {
            firstName:    '',
            lastName:     '',
            age:          '',
            artistValue:  '',
            regionValue:  '',
            defaultRegionValues: ['Bolivia','Africa', 'Antarctica', 'Asia', 'Europa', 'Norte America'],
            defaultArtistValues: [ 'Elton John', 'Elvis Presley',
                'Michael Jackson', 'Pink Floyd', 'The Beatles', ''],
            displayMessage: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.generateRegionOptions = this.generateRegionOptions.bind(this);
        this.generateArtistOptions = this.generateArtistOptions.bind(this);
    }

    generateRegionOptions(){
        let options = [];
        for(var i = 0; i < this.state.defaultRegionValues.length; i++){
            options.push(<option key={this.state.defaultRegionValues[i]}
                                 value={this.state.defaultRegionValues[i]}>{this.state.defaultRegionValues[i]}</option>);
        }
        return options;
    }

    generateArtistOptions(){
        let options = [];
        for(var i = 0; i < this.state.defaultArtistValues.length; i++){
            options.push(<option key={this.state.defaultArtistValues[i]}
                                 value={this.state.defaultArtistValues[i]}>{this.state.defaultArtistValues[i]}</option>);
        }
        return options;
    }

    handleSubmit(event){

        fetch('http://localhost:5555/sendSurveyData',{
            method: 'POST',
            headers:    {
                'Content-Type': 'application/json'
            },
            body:   JSON.stringify({
                firstName :   this.firstName.value,
                lastName  :   this.lastName.value,
                age       :   this.age.value,
                region    :   this.regionValue.value,
                artist    :   this.artistValue.value
            })
        }).then(function(response) {
            if (response.status >= 200 && response.status < 300) {
                return response
            } else {
                var error = new Error(response.statusText)
                error.response = response
                throw error
            }
        }).then(function(response){
            this.setState({displayMessage: 'Resultados enviados con exito!'});
        }.bind(this)).catch(function(error) {
            this.setState({displayMessage:  'Fallo al enviar los datos. Intente otra vez!'});
            console.log('There has been a problem with your fetch operation: ' + error.message);
        }.bind(this));

        event.preventDefault();
    }

    render() {
        return (
            <div className="App container-fluid">
                <header className="header row">
                    <h1 className="App-title">Bienvenido a la Encuesta</h1>
                </header>
                {this.state.displayMessage.length === 0 &&
                    <div className="Survey-form row">
                        <form onSubmit={this.handleSubmit}>
                            <div className="row">
                                <input className="input" type="text" placeholder="Nombres"
                                       ref={(input) => {this.firstName = input}}/>
                            </div>
                            <div className="row">
                                <input className="input" type="text" placeholder="Apellidos"
                                       ref={(input) => {this.lastName = input}}/>
                            </div>
                            <div className="row">
                                <input className="input" type="number" placeholder="Edad"
                                       ref={(input) => {this.age = input}}/>
                            </div>
                            <div className="row">
                                <label htmlFor="Region" className="text">Region:</label>
                                <select className="select"
                                        defaultValue={this.state.defaultRegionValues[0]}
                                        ref={(input) => {this.regionValue = input}}>
                                    {this.generateRegionOptions()}
                                </select>
                            </div>
                            <div className="row">
                                <label htmlFor="Favourite Artist" className="text">Artista favorito:</label>
                                <select className="select"
                                        defaultValue={this.state.defaultArtistValues[0]}
                                        ref={(input) => {this.artistValue = input}}>
                                    {this.generateArtistOptions()}
                                </select>
                            </div>
                            <div className="row">
                                <button className="submit" type="Submit">Enviar</button>
                                <button className="submit col-md-offset-2" onClick={this.props.gotoLoginPage}>Admin Login</button>
                            </div>
                        </form>
                    </div>
                }
                {this.state.displayMessage.length !== 0 &&
                    <div>
                        <div className="row">
                            <p className="App-title">{this.state.displayMessage}</p>
                        </div>
                        <div className="row">
                            <button className="submit" onClick={() => {this.setState({displayMessage: ''})}}>Regresar</button>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default SurveyForm;
