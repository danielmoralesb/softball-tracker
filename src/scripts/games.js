console.clear();

function formatDate(date) {
  let ms = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${date.getDate()} of ${ms[date.getMonth()]} ${date.getFullYear()}`;
};

let currentDate = new Date();

new Vue({
  el: '.game',
  data: {
    meta: {
      league: 'Wednesday Adult Medium',
      field: 'Spanish River Field',
      gameDate: formatDate(currentDate)
    },
    teams: {
      home: {
        name: 'Yankees',
        runs: 0,
        hits: 0,
        errors: 0
      },
      away: {
        name: 'Marlins',
        runs: 0,
        hits: 0,
        errors: 0
      }
    },
    currentInning: 0,
    innings: []
  },
  created: function() {
    for(let i = 0; i < 7; i++){
      this.innings.push({home: 0, away: 0, isActive: false})
    }
    this.updateInning(this.currentInning);
  },
  methods: {
    getDate(datetime) {
      let date = new Date(datetime).toJSON().slice(0,10).replace(/-/g,'/')
      return Date
    },
    updateScore: function(team, index) {
      this.teams[team].runs++;
      this.innings[index][team]++;
    },
    updateHits: function(team){
      this.teams[team].hits++;
    },
    updateErrors: function(team){
      this.teams[team].errors++;
    },
    updateInning: function(index){
      this.currentInning = index;
      for(let i = 0; i < this.innings.length; i++){
        this.innings[i].isActive = false;
        if(index == i) {
          this.innings[i].isActive = true;
        }
      }
    },
    decrementRuns: function(team) {
      if( this.innings[this.currentInning][team] > 0 ){
        this.teams[team].runs = (this.teams[team].runs - 1 <= 0) ? 0 : this.teams[team].runs - 1 ;
        this.innings[this.currentInning][team] = this.innings[this.currentInning][team] - 1 < 0 ? 0 : this.innings[this.currentInning][team] - 1;
      }
    },
    clearScore: function(home, away) {
      localStorage.clear();
      this.teams[home].runs = 0;
      this.teams[away].runs = 0;
      this.teams[home].hits = 0;
      this.teams[away].hits = 0;
      this.teams[home].errors = 0;
      this.teams[away].errors = 0;

      for (let i = 0; i < this.innings.length; i++) {
        this.innings[i][home] = 0;
        this.innings[i][away] = 0;
      }
    }
  },
  mounted() {
    if (localStorage.getItem('this.teams')) this.teams = JSON.parse(localStorage.getItem('this.teams'));
    if (localStorage.getItem('this.innings')) this.innings = JSON.parse(localStorage.getItem('this.innings'));
  },
  watch: {
    teams: {
      handler() {
        localStorage.setItem('this.teams', JSON.stringify(this.teams));
      },
      deep: true,
    },
    innings: {
      handler() {
        localStorage.setItem('this.innings', JSON.stringify(this.innings));
      },
      deep: true,
    }
  }
})

