'use strict';

const illegalurlarguments = {
    " " : "%20",
    "`" : "%60",
    "@" : "%40",
    "#" : "%23",
    "$" : "%24",
    "%" : "%25",
    "^" : "%5E",
    "&" : "%26",
    "=" : "%3D",
    "+" : "%2B",
    "\\" : "%5C",
    "|" : "%7C",
    "{" : "%7B",
    "}" : "%7D",
    "[" : "%5B",
    "]" : "%5D",
    ";" : "%3B",
    ":" : "%3A",
    '"' : "%22",
    "," : "%2C",
    "/" : "%2F",
    "<" : "%3C",
    ">" : "%3E",
    "?" : "%3F",
}


function processTextIntoURL(inputString) {
    let outputString = '';

    for (let i = 0 ; i < inputString.length ; i++) {
        let currentChar = inputString.charAt(i);
        outputString += (currentChar in illegalurlarguments) ? illegalurlarguments[currentChar] : currentChar;
    }

    return outputString;
}

function Molehill (props) {
    return (
        <div className="molehill"></div>
    );
}

class Mole extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        let moleHead = (this.props.aboveground && !this.props.gameOver) ? <img src={this.props.imageurl}/> : <img className = "blank" src = "./blue.png"/>
        const verticalAlignment = this.props.low ? "mole lowmole" : "mole";
        return (
            <div className = {verticalAlignment} onClick = {() => this.props.onClick()}>
                {moleHead}
                <Molehill />
            </div>
        );
    }
}

class Molegame extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            score: 0,
            highscore: 0,
            gameOver : true,
            moles: [false, false, false, false, false],
            imageurl : "https://retro-avatar.s3.amazonaws.com/avatar_5c0533500f0dc351421d2c6c50717252.png",
            timeRemaining : 0,
        }

        this.rollTheMoles = this.rollTheMoles.bind(this);
        this.newGame = this.newGame.bind(this);
        this.endGame = this.endGame.bind(this);
        this.whackMole = this.whackMole.bind(this);
        this.createNewImage = this.createNewImage.bind(this);

        setInterval(this.rollTheMoles, 100);
    }

    rollTheMoles() {
        if (!this.state.gameOver) {
            let rerolled = [];
            const popChance = 0.9 + (1 / (12 + this.state.score)); // Function Range (0.9, 0.983], tapering downwards
            for (let i = 0; i < 5 ; i++) {
                
                rerolled.push(this.state.moles[i] || Math.random() > popChance);
            }
            this.setState({moles : rerolled});
            this.setState((state) => ({timeRemaining : state.timeRemaining - 0.1}));
            if (this.state.timeRemaining <= 0) {
                this.endGame();
            }
        }
    }

    newGame() {
        this.setState({score: 0, gameOver: false, moles: [false, false, false, false, false], timeRemaining:30});
    }

    endGame() {
        this.setState({gameOver : true, moles: [false, false, false, false, false], timeRemaining : 0})
    }

    whackMole(moleidx) { 
        if (this.state.moles[moleidx]) {
            this.state.moles[moleidx] = false;
            this.setState((state) => ({score : state.score + 1}));
            if(this.state.score >= this.state.highscore) {
                this.setState((state) => ({highscore: state.score}));
            }
        } else {
            this.endGame();
        }
    }

    renderMole(index, isLow, aboveground) {
        return (
            <Mole
                low = {isLow}
                gameOver = {this.state.gameOver}
                aboveground = {aboveground}
                onClick = {() => {this.whackMole(index)}}
                imageurl = {this.state.imageurl}
            />
        );
    }

    createNewImage(imgprompt) {
        // Replaces image with given argument. Also restarts game.

        const settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://retro-avatar-generator.p.rapidapi.com/generate-avatar/",
            "method": "POST",
            "headers": {
                "content-type": "application/x-www-form-urlencoded",
                "x-rapidapi-key": "18ee963a5amsh2946620d8c9b77bp196c4ajsn08e65d11ba5a",
                "x-rapidapi-host": "retro-avatar-generator.p.rapidapi.com"
            },
            "data": {
                "seed": imgprompt,
            }
        };
        
        $.ajax(settings).done( (response) => { // idk why but axios and fetch both fail to work for some reason
            this.setState({imageurl : response.avatar_url});
        });

        this.newGame();
    }

    render() {
        return (
            <div>
                <div>
                    <div id = "topBar">
                    <InputBar 
                        onSub = {this.createNewImage}
                    />
                        <div id = "scoreBar">
                            <div id = "score">Score: {this.state.score}</div>
                            <div id = "highscore">High Score: {this.state.highscore}</div>
                        </div>
                    </div>
                    <br/>
                    <button onClick={this.newGame}>New Game</button>
                </div>
                <h1>{Math.round(this.state.timeRemaining * 10) / 10}</h1>
                <div className = "moleChain">
                    {this.renderMole(0, false, this.state.moles[0])}
                    {this.renderMole(1, true, this.state.moles[1])}
                    {this.renderMole(2, false, this.state.moles[2])}
                    {this.renderMole(3, true, this.state.moles[3])}
                    {this.renderMole(4, false, this.state.moles[4])}                
                </div>
            </div>
        );
    }
}

class InputBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);    
    }

    handleChange(event) {
        this.setState({value : event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.state.value !== '') {
            this.props.onSub(this.state.value);
            this.setState({value: ''});
        }
    }

    render () {
        return (
            <div className = "inputBar">
            <form onSubmit={this.handleSubmit}>
                <label>Enter target to whack:
                    <input type="text" value={this.state.value} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Begin!"/>
            </form>
            </div>
        );
    }
}

function ChatWindow (props) {
    let formattedLog = props.chatlog.map((message, index) => 
        <p key={index}>{message}</p>
        );
    return (
        <div className="chatWindow">{formattedLog}</div>
    );
}

class FullChatExperience extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chatlog : []
        }
        this.addToChatLog = this.addToChatLog.bind(this);
    }

    addToChatLog(message) {
        this.setState((state) => ({chatlog: state.chatlog.concat("You: " + message)}));

        const settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://twinword-sentiment-analysis.p.rapidapi.com/analyze/?text=" + processTextIntoURL(message),
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "18ee963a5amsh2946620d8c9b77bp196c4ajsn08e65d11ba5a",
                "x-rapidapi-host": "twinword-sentiment-analysis.p.rapidapi.com"
            }
        };

        $.ajax(settings).done( (response) => {
            let opinion = response.type;
            if (opinion === "positive") {
                this.setState((state) => ({chatlog: state.chatlog.concat("Mole: How a-mole-zing! Would you like some marsh-mole-ows?")}));
            } else if (opinion === "negative") {
                this.setState((state) => ({chatlog: state.chatlog.concat("Mole: Moley Shit! How could you be so molean?")}));
            } else {
                this.setState((state) => ({chatlog: state.chatlog.concat("Mole: mole bottom text")}));
            }    
        });
    }

    render() {
        return (
            <div>
                <ChatWindow chatlog = {this.state.chatlog}/>
                <ChatInput onSub = {this.addToChatLog}/>
            </div>
        );
    }
}

class ChatInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.onSub(this.state.value);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div className = "chatForm">
                    <textarea cols = "70" rows = "4" className="chatInput" value={this.state.value} onChange={this.handleChange}/>
                    <input className="sendButton" type="submit" value="Send"/>
                </div>
            </form>
        );
    }
}

function WeatherTop (props) {
    return (
        <div className="weatherTop">
            <div className="sunContainer">
                <img src="sun.png" alt="sun"/>
            </div>
            <h5>Disclaimer: It may or may not actually be sunny outside.</h5>
        </div>
    );
}

function WeatherBody (props) {
    return (
        <div>
            <p>Feels Like: {props.feelsLike}˚C</p>
            <p>Temperature: {props.reallyIs}˚C</p>
            <p>Humidity: {props.humidity}%</p>
            <h5>Moles prefer warm (but not hot) weather, around 20˚C.</h5>
        </div>
    );
}

class WeatherInfoBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            feelsLike : -1,
            reallyIs : -1,
            humidity : -1,
        }
        this.getWeather();
    }

    getWeather() {
        const locationSettings = {
            "method" : 'GET',
            url: 'http://www.geoplugin.net/json.gp',
        }
        
        $.ajax(locationSettings).done((location) => {
            const weatherSettings = {
                "async": true,
                "crossDomain": true,
                "url": "https://community-open-weather-map.p.rapidapi.com/weather?q="+location.geoplugin_city+"%2C"+location.geoplugin_countryCode+"&lat="+location.geoplugin_latitude+"&lon="+location.geoplugin_longitude+"&lang=null&units=%22metric%22%20or%20%22imperial%22",
                "method": "GET",
                "headers": {
                    "x-rapidapi-key": "18ee963a5amsh2946620d8c9b77bp196c4ajsn08e65d11ba5a",
                    "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com"
                }
            }
            $.ajax(weatherSettings).done((response) => {
                console.log(response);
                this.setState({
                    feelsLike : (Math.round(response.main.feels_like * 100) - 27300) / 100,
                    reallyIs : (Math.round(response.main.temp * 100) - 27300) / 100,
                    humidity : response.main.humidity,
                });
            });
        });
    }


    render () {
        return (
            <div className = "weatherInfoBox">
                <WeatherTop/>
                <WeatherBody 
                    feelsLike = {this.state.feelsLike}
                    reallyIs = {this.state.reallyIs}
                    humidity = {this.state.humidity}
                />
            </div>
        );
    }
}

class App extends React.Component {
    render() {
        return (
            <div>
                <div className="column">
                    <Molegame />
                    <FullChatExperience />
                </div>
                <div className="column">
                    <WeatherInfoBox />
                </div>
            </div>
        );
    }
}


ReactDOM.render(<App />, document.getElementById('root'));