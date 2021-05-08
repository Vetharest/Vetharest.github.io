'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var illegalurlarguments = {
    " ": "%20",
    "`": "%60",
    "@": "%40",
    "#": "%23",
    "$": "%24",
    "%": "%25",
    "^": "%5E",
    "&": "%26",
    "=": "%3D",
    "+": "%2B",
    "\\": "%5C",
    "|": "%7C",
    "{": "%7B",
    "}": "%7D",
    "[": "%5B",
    "]": "%5D",
    ";": "%3B",
    ":": "%3A",
    '"': "%22",
    ",": "%2C",
    "/": "%2F",
    "<": "%3C",
    ">": "%3E",
    "?": "%3F"
};

function processTextIntoURL(inputString) {
    var outputString = '';

    for (var i = 0; i < inputString.length; i++) {
        var currentChar = inputString.charAt(i);
        outputString += currentChar in illegalurlarguments ? illegalurlarguments[currentChar] : currentChar;
    }

    return outputString;
}

function Molehill(props) {
    return React.createElement("div", { className: "molehill" });
}

var Mole = function (_React$Component) {
    _inherits(Mole, _React$Component);

    function Mole(props) {
        _classCallCheck(this, Mole);

        return _possibleConstructorReturn(this, (Mole.__proto__ || Object.getPrototypeOf(Mole)).call(this, props));
    }

    _createClass(Mole, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            var moleHead = this.props.aboveground && !this.props.gameOver ? React.createElement("img", { src: this.props.imageurl }) : React.createElement("img", { className: "blank", src: "./blue.png" });
            var verticalAlignment = this.props.low ? "mole lowmole" : "mole";
            return React.createElement(
                "div",
                { className: verticalAlignment, onClick: function onClick() {
                        return _this2.props.onClick();
                    } },
                moleHead,
                React.createElement(Molehill, null)
            );
        }
    }]);

    return Mole;
}(React.Component);

var Molegame = function (_React$Component2) {
    _inherits(Molegame, _React$Component2);

    function Molegame(props) {
        _classCallCheck(this, Molegame);

        var _this3 = _possibleConstructorReturn(this, (Molegame.__proto__ || Object.getPrototypeOf(Molegame)).call(this, props));

        _this3.state = {
            score: 0,
            highscore: 0,
            gameOver: true,
            moles: [false, false, false, false, false],
            imageurl: "https://retro-avatar.s3.amazonaws.com/avatar_5c0533500f0dc351421d2c6c50717252.png",
            timeRemaining: 0
        };

        _this3.rollTheMoles = _this3.rollTheMoles.bind(_this3);
        _this3.newGame = _this3.newGame.bind(_this3);
        _this3.endGame = _this3.endGame.bind(_this3);
        _this3.whackMole = _this3.whackMole.bind(_this3);
        _this3.createNewImage = _this3.createNewImage.bind(_this3);

        setInterval(_this3.rollTheMoles, 100);
        return _this3;
    }

    _createClass(Molegame, [{
        key: "rollTheMoles",
        value: function rollTheMoles() {
            if (!this.state.gameOver) {
                var rerolled = [];
                var popChance = 0.9 + 1 / (12 + this.state.score); // Function Range (0.9, 0.983], tapering downwards
                for (var i = 0; i < 5; i++) {

                    rerolled.push(this.state.moles[i] || Math.random() > popChance);
                }
                this.setState({ moles: rerolled });
                this.setState(function (state) {
                    return { timeRemaining: state.timeRemaining - 0.1 };
                });
                if (this.state.timeRemaining <= 0) {
                    this.endGame();
                }
            }
        }
    }, {
        key: "newGame",
        value: function newGame() {
            this.setState({ score: 0, gameOver: false, moles: [false, false, false, false, false], timeRemaining: 30 });
        }
    }, {
        key: "endGame",
        value: function endGame() {
            this.setState({ gameOver: true, moles: [false, false, false, false, false], timeRemaining: 0 });
        }
    }, {
        key: "whackMole",
        value: function whackMole(moleidx) {
            if (this.state.moles[moleidx]) {
                this.state.moles[moleidx] = false;
                this.setState(function (state) {
                    return { score: state.score + 1 };
                });
                if (this.state.score >= this.state.highscore) {
                    this.setState(function (state) {
                        return { highscore: state.score };
                    });
                }
            } else {
                this.endGame();
            }
        }
    }, {
        key: "renderMole",
        value: function renderMole(index, isLow, aboveground) {
            var _this4 = this;

            return React.createElement(Mole, {
                low: isLow,
                gameOver: this.state.gameOver,
                aboveground: aboveground,
                onClick: function onClick() {
                    _this4.whackMole(index);
                },
                imageurl: this.state.imageurl
            });
        }
    }, {
        key: "createNewImage",
        value: function createNewImage(imgprompt) {
            var _this5 = this;

            // Replaces image with given argument. Also restarts game.

            var settings = {
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
                    "seed": imgprompt
                }
            };

            $.ajax(settings).done(function (response) {
                // idk why but axios and fetch both fail to work for some reason
                _this5.setState({ imageurl: response.avatar_url });
            });

            this.newGame();
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "div",
                        { id: "topBar" },
                        React.createElement(InputBar, {
                            onSub: this.createNewImage
                        }),
                        React.createElement(
                            "div",
                            { id: "scoreBar" },
                            React.createElement(
                                "div",
                                { id: "score" },
                                "Score: ",
                                this.state.score
                            ),
                            React.createElement(
                                "div",
                                { id: "highscore" },
                                "High Score: ",
                                this.state.highscore
                            )
                        )
                    ),
                    React.createElement("br", null),
                    React.createElement(
                        "button",
                        { onClick: this.newGame },
                        "New Game"
                    )
                ),
                React.createElement(
                    "h1",
                    null,
                    Math.round(this.state.timeRemaining * 10) / 10
                ),
                React.createElement(
                    "div",
                    { className: "moleChain" },
                    this.renderMole(0, false, this.state.moles[0]),
                    this.renderMole(1, true, this.state.moles[1]),
                    this.renderMole(2, false, this.state.moles[2]),
                    this.renderMole(3, true, this.state.moles[3]),
                    this.renderMole(4, false, this.state.moles[4])
                )
            );
        }
    }]);

    return Molegame;
}(React.Component);

var InputBar = function (_React$Component3) {
    _inherits(InputBar, _React$Component3);

    function InputBar(props) {
        _classCallCheck(this, InputBar);

        var _this6 = _possibleConstructorReturn(this, (InputBar.__proto__ || Object.getPrototypeOf(InputBar)).call(this, props));

        _this6.state = {
            value: ''
        };
        _this6.handleChange = _this6.handleChange.bind(_this6);
        _this6.handleSubmit = _this6.handleSubmit.bind(_this6);
        return _this6;
    }

    _createClass(InputBar, [{
        key: "handleChange",
        value: function handleChange(event) {
            this.setState({ value: event.target.value });
        }
    }, {
        key: "handleSubmit",
        value: function handleSubmit(event) {
            event.preventDefault();
            if (this.state.value !== '') {
                this.props.onSub(this.state.value);
                this.setState({ value: '' });
            }
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "inputBar" },
                React.createElement(
                    "form",
                    { onSubmit: this.handleSubmit },
                    React.createElement(
                        "label",
                        null,
                        "Enter target to whack:",
                        React.createElement("input", { type: "text", value: this.state.value, onChange: this.handleChange })
                    ),
                    React.createElement("input", { type: "submit", value: "Begin!" })
                )
            );
        }
    }]);

    return InputBar;
}(React.Component);

function ChatWindow(props) {
    var formattedLog = props.chatlog.map(function (message, index) {
        return React.createElement(
            "p",
            { key: index },
            message
        );
    });
    return React.createElement(
        "div",
        { className: "chatWindow" },
        formattedLog
    );
}

var FullChatExperience = function (_React$Component4) {
    _inherits(FullChatExperience, _React$Component4);

    function FullChatExperience(props) {
        _classCallCheck(this, FullChatExperience);

        var _this7 = _possibleConstructorReturn(this, (FullChatExperience.__proto__ || Object.getPrototypeOf(FullChatExperience)).call(this, props));

        _this7.state = {
            chatlog: []
        };
        _this7.addToChatLog = _this7.addToChatLog.bind(_this7);
        return _this7;
    }

    _createClass(FullChatExperience, [{
        key: "addToChatLog",
        value: function addToChatLog(message) {
            var _this8 = this;

            this.setState(function (state) {
                return { chatlog: state.chatlog.concat("You: " + message) };
            });

            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "https://twinword-sentiment-analysis.p.rapidapi.com/analyze/?text=" + processTextIntoURL(message),
                "method": "GET",
                "headers": {
                    "x-rapidapi-key": "18ee963a5amsh2946620d8c9b77bp196c4ajsn08e65d11ba5a",
                    "x-rapidapi-host": "twinword-sentiment-analysis.p.rapidapi.com"
                }
            };

            $.ajax(settings).done(function (response) {
                var opinion = response.type;
                if (opinion === "positive") {
                    _this8.setState(function (state) {
                        return { chatlog: state.chatlog.concat("Mole: How a-mole-zing! Would you like some marsh-mole-ows?") };
                    });
                } else if (opinion === "negative") {
                    _this8.setState(function (state) {
                        return { chatlog: state.chatlog.concat("Mole: Moley Shit! How could you be so molean?") };
                    });
                } else {
                    _this8.setState(function (state) {
                        return { chatlog: state.chatlog.concat("Mole: mole bottom text") };
                    });
                }
            });
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                null,
                React.createElement(ChatWindow, { chatlog: this.state.chatlog }),
                React.createElement(ChatInput, { onSub: this.addToChatLog })
            );
        }
    }]);

    return FullChatExperience;
}(React.Component);

var ChatInput = function (_React$Component5) {
    _inherits(ChatInput, _React$Component5);

    function ChatInput(props) {
        _classCallCheck(this, ChatInput);

        var _this9 = _possibleConstructorReturn(this, (ChatInput.__proto__ || Object.getPrototypeOf(ChatInput)).call(this, props));

        _this9.state = {
            value: ''
        };
        _this9.handleSubmit = _this9.handleSubmit.bind(_this9);
        _this9.handleChange = _this9.handleChange.bind(_this9);
        return _this9;
    }

    _createClass(ChatInput, [{
        key: "handleSubmit",
        value: function handleSubmit(event) {
            event.preventDefault();
            this.props.onSub(this.state.value);
        }
    }, {
        key: "handleChange",
        value: function handleChange(event) {
            this.setState({ value: event.target.value });
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "form",
                { onSubmit: this.handleSubmit },
                React.createElement(
                    "div",
                    { className: "chatForm" },
                    React.createElement("textarea", { cols: "70", rows: "4", className: "chatInput", value: this.state.value, onChange: this.handleChange }),
                    React.createElement("input", { className: "sendButton", type: "submit", value: "Send" })
                )
            );
        }
    }]);

    return ChatInput;
}(React.Component);

function WeatherTop(props) {
    return React.createElement(
        "div",
        { className: "weatherTop" },
        React.createElement(
            "div",
            { className: "sunContainer" },
            React.createElement("img", { src: "sun.png", alt: "sun" })
        ),
        React.createElement(
            "h5",
            null,
            "Disclaimer: It may or may not actually be sunny outside."
        )
    );
}

function WeatherBody(props) {
    return React.createElement(
        "div",
        null,
        React.createElement(
            "p",
            null,
            "Feels Like: ",
            props.feelsLike,
            "\u02DAC"
        ),
        React.createElement(
            "p",
            null,
            "Temperature: ",
            props.reallyIs,
            "\u02DAC"
        ),
        React.createElement(
            "p",
            null,
            "Humidity: ",
            props.humidity,
            "%"
        ),
        React.createElement(
            "h5",
            null,
            "Moles prefer warm (but not hot) weather, around 20\u02DAC."
        )
    );
}

var WeatherInfoBox = function (_React$Component6) {
    _inherits(WeatherInfoBox, _React$Component6);

    function WeatherInfoBox(props) {
        _classCallCheck(this, WeatherInfoBox);

        var _this10 = _possibleConstructorReturn(this, (WeatherInfoBox.__proto__ || Object.getPrototypeOf(WeatherInfoBox)).call(this, props));

        _this10.state = {
            feelsLike: -1,
            reallyIs: -1,
            humidity: -1
        };
        _this10.getWeather();
        return _this10;
    }

    _createClass(WeatherInfoBox, [{
        key: "getWeather",
        value: function getWeather() {
            var _this11 = this;

            var locationSettings = {
                "method": 'GET',
                url: 'http://www.geoplugin.net/json.gp'
            };

            $.ajax(locationSettings).done(function (location) {
                var weatherSettings = {
                    "async": true,
                    "crossDomain": true,
                    "url": "https://community-open-weather-map.p.rapidapi.com/weather?q=" + location.geoplugin_city + "%2C" + location.geoplugin_countryCode + "&lat=" + location.geoplugin_latitude + "&lon=" + location.geoplugin_longitude + "&lang=null&units=%22metric%22%20or%20%22imperial%22",
                    "method": "GET",
                    "headers": {
                        "x-rapidapi-key": "18ee963a5amsh2946620d8c9b77bp196c4ajsn08e65d11ba5a",
                        "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com"
                    }
                };
                $.ajax(weatherSettings).done(function (response) {
                    console.log(response);
                    _this11.setState({
                        feelsLike: (Math.round(response.main.feels_like * 100) - 27300) / 100,
                        reallyIs: (Math.round(response.main.temp * 100) - 27300) / 100,
                        humidity: response.main.humidity
                    });
                });
            });
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "weatherInfoBox" },
                React.createElement(WeatherTop, null),
                React.createElement(WeatherBody, {
                    feelsLike: this.state.feelsLike,
                    reallyIs: this.state.reallyIs,
                    humidity: this.state.humidity
                })
            );
        }
    }]);

    return WeatherInfoBox;
}(React.Component);

var App = function (_React$Component7) {
    _inherits(App, _React$Component7);

    function App() {
        _classCallCheck(this, App);

        return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
    }

    _createClass(App, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    { className: "column" },
                    React.createElement(Molegame, null),
                    React.createElement(FullChatExperience, null)
                ),
                React.createElement(
                    "div",
                    { className: "column" },
                    React.createElement(WeatherInfoBox, null)
                )
            );
        }
    }]);

    return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));