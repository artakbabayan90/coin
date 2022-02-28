import MockAdapter from "axios-mock-adapter";

export default {
  state(){
    return {
      currencies: [],
      pairRates: []
    }
  },
  actions: {
    async fetch({commit}) {
      const mock = new MockAdapter(this.$axios);
      const currenciesList = ['USD', 'RUB', 'EUR', 'AMD'];
      const commissionsList = [1, 2, 3, 4, 5];
      const arrCurrencies = [];
      const arrPairRates = [];
      currenciesList.forEach(item => {
        currenciesList.forEach(value => {
          if (item !== value) {
            let commission = commissionsList[Math.floor(Math.random() * commissionsList.length)];
            arrCurrencies.push({
              "base_currency": item,
              "quote_currency": value,
              "commission": commission
            })
          }
        })
      })
      for (let i = 0; i < currenciesList.length; i++) {
        for (let j = i + 1; j < currenciesList.length; j++) {
          arrPairRates.push({
            'pair': currenciesList[i] + '/' + currenciesList[j],
            'rate': Math.floor(Math.random() * (100 - 10)) + 10
          })
        }
      }
      mock.onGet("/currencies").reply(200, {
        currencies: arrCurrencies,
      });

      mock.onGet("/pair").reply(200, {
        pair: arrPairRates,
      });

      const currencies = this.$axios.get("/currencies")
      const pairRates = this.$axios.get('/pair')
      Promise.all([currencies, pairRates]).then(function(values) {
        commit('updateCurrencies',values[0].data.currencies);
        commit('updatePairRates',values[1].data.pair);
      });

    }
  },

  mutations: {
    updateCurrencies(state, currencies) {
      state.currencies = currencies
    },
    updatePairRates(state, pairRates) {
      state.pairRates = pairRates
    }
  },

  getters: {
    currencies(state) {
      return state.currencies
    },
    pairRates(state) {
      return state.pairRates
    }
  }
}
