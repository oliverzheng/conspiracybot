var RootComponent = React.createClass({
  getInitialState() {
    return {
      input: null,
      output: null,
      facts: [],
      seedWords: [],
      isConspiring: false,
    };
  },

  _onClick: function() {
    var input = this.refs.input.getDOMNode().value;
    var output = this.refs.output.getDOMNode().value;
    if (input === '') {
      this.refs.input.getDOMNode().focus();
      return;
    }
    if (output === '') {
      this.refs.output.getDOMNode().focus();
      return;
    }

    var self = this;
    this.setState({
      input: input,
      output: output,
      facts: [input],
      seedWords: [],
      isConspiring: true,
    }, function() {
      self._tryConspiring();
    });
  },

  _tryConspiring: function() {
    var self = this;
    $.getJSON(
      'conspire',
      {
        previousFacts: this.state.facts,
        seedWords: this.state.seedWords,
        output: this.state.output,
      }
    ).done(function(res) {
      self.state.facts.push(res.newFact);
      self.state.seedWords.push(res.newSeedWord);
      self.setState({
        facts: self.state.facts,
        seedWords: self.state.seedWords,
      }, function() {
        if (!res.didConspire) {
          self._tryConspiring();
        } else {
          self.setState({
            isConspiring: false,
          });
        }
      });
    });
  },

  render: function() {
    var facts = this.state.facts.map(function(fact) {
      return <li>{fact}</li>;
    });
    var loaderStyle = {};
    if (!this.state.isConspiring) {
      loaderStyle.display = 'none';
    }
    return (
      <div>
        <h1>Conspiracy Bot</h1>
        <p><em>Half-Life 3 confirmed!</em></p>
        <p>
          Enter a sentence as a starting point:
          <br />
          <input type="text" ref="input" disabled={this.state.isConspiring} />
        </p>
        <p>
          What conspiracy would you like to reach?
          <br />
          <input type="text" ref="output" disabled={this.state.isConspiring} />
        </p>
        <button onClick={this._onClick} disabled={this.state.isConspiring}>
          Conspire
        </button>
        <div className="loaderWrapper" style={loaderStyle}>
          <div className="loader">Loading...</div>
        </div>
        <ol>{facts}</ol>
      </div>
    );
  },
});

React.render(
  <RootComponent />,
  document.body
);
