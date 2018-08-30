const urlParams = new URLSearchParams(window.location.search);
const gameId = urlParams.get('id');
const game = `http://localhost:4000/games?id=${gameId}`;

new Vue({
  el: '.game',
  data: {
    game: {
      'meta': {
        'day': '',
        'date': '',
        'time': ''
      },
      'innings': [],
      'division': {
        'id': '',
        'name': ''
      },
      'teams': {
        'away': {
          'id': '',
          'name': '',
          'runs': '',
          'hits': '',
          'errors': ''
        },
        'home': {
          'id': '',
          'name': '',
          'runs': '',
          'hits': '',
          'errors': ''
        }
      },
      'id': ''
    },
  },
  created: function () {
    // for(let i = 0; i < 7; i++){
    //   this.game.innings.push({home: 0, away: 0, isActive: false})
    // }
    // this.updateInning(this.game.currentInning);
    this.getGame();
  },
  methods: {
    getGame: function () {
      fetch(game)
        .then(resp => resp.json())
        .then(json => {
          this.game = json[0]
        })
    },
    updateScore: function (team, index) {
      this.game.teams[team].runs++;
      this.game.innings[index][team]++;
    },
    updateHits: function (team) {
      this.game.teams[team].hits++;
    },
    updateErrors: function (team) {
      this.game.teams[team].errors++;
    },
    updateInning: function (index) {
      this.game.currentInning = index;
      for (let i = 0; i < this.game.innings.length; i++) {
        this.game.innings[i].isActive = false;
        if (index == i) {
          this.game.innings[i].isActive = true;
        }
      }
    },
    decrementRuns: function (team) {
      if (this.game.innings[this.game.currentInning][team] > 0) {
        this.game.teams[team].runs = (this.game.teams[team].runs - 1 <= 0) ? 0 : this.game.teams[team].runs - 1;
        this.game.innings[this.game.currentInning][team] = this.game.innings[this.game.currentInning][team] - 1 < 0 ? 0 : this.game.innings[this.game.currentInning][team] - 1;
      }
    },
    clearScore: function (home, away) {
      localStorage.clear();
      this.game.teams[home].runs = 0;
      this.game.teams[away].runs = 0;
      this.game.teams[home].hits = 0;
      this.game.teams[away].hits = 0;
      this.game.teams[home].errors = 0;
      this.game.teams[away].errors = 0;

      for (let i = 0; i < this.game.innings.length; i++) {
        this.game.innings[i][home] = 0;
        this.game.innings[i][away] = 0;
      }
    },
    saveGame: function () {
      fetch(game, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.game)
        })
        .then(resp => resp.json())
        .then(json => {
          this.game = json[0];
          console.log('Game Saved')
        })
        .catch(err => console.log(err))
    }
  },
  mounted() {
    // if (localStorage.getItem('this.game.teams')) this.game.teams = JSON.parse(localStorage.getItem('this.game.teams'));
    // if (localStorage.getItem('this.game.innings')) this.game.innings = JSON.parse(localStorage.getItem('this.game.innings'));
  },
  watch: {
    teams: {
      handler() {
        //localStorage.setItem('this.game.teams', JSON.stringify(this.game.teams));
      },
      deep: true,
    },
    innings: {
      handler() {
        //localStorage.setItem('this.game.innings', JSON.stringify(this.game.innings));
      },
      deep: true,
    }
  }
})