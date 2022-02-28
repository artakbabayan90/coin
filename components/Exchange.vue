<template lang="pug">
  .header
    h1 Crypto Exchange
    .grid-container
      .coll
        h2  Exchange {{baseCurrencies[indexBase]}} to {{quoteCurrencies[indexQuote]}}
        hr
        .inpues
          span You Pay
          .form-groups
            input(type='number' placeholder='Pay Amount' class='form-field' v-model='baseRate')
            select(v-model='indexBase')
              option(v-for='(baseCurrency,index) in baseCurrencies' :value='index') {{baseCurrency}}
          span You Get
          .form-groups
            input(type='number' placeholder='Pay Amount' class='form-field' v-model='quoteRate')
            select(v-model='indexQuote')
              option(v-for='(quoteCurrency,index) in quoteCurrencies'  :value='index') {{quoteCurrency}}
      .coll
        h2  Summary
        hr
        .inpues
          span.left Your {{baseCurrencies[indexBase]}} Balance
          span.right {{baseRate}} {{baseCurrencies[indexBase]}}
          br
        .inpues
          span.left Your {{quoteCurrencies[indexQuote]}} Balance
          span.right {{quoteRate}} {{quoteCurrencies[indexQuote]}}
          br
        .inpues
          span.left Exchange Rate
          span.right {{baseRate}} {{baseCurrencies[indexBase]}} = {{quoteRate/commission}} {{quoteCurrencies[indexQuote]}}

</template>

<script>

export default {
  name: 'NuxtExchange',
  data() {
    return {
      baseRate: 1,
      indexBase: 0,
      indexQuote: 0,
    }
  },
  computed: {
    currencies() {
      return this.$store.getters['currencies/currencies']
    },
    pairRates() {
      return this.$store.getters['currencies/pairRates']
    },
    baseCurrencies() {
      const baseCurrencies = []
      this.currencies.forEach(item => {
        if (baseCurrencies.indexOf(item.base_currency) === -1) {
          baseCurrencies.push(item.base_currency)
        }
      })
      return baseCurrencies;
    },
    quoteCurrencies() {
      const quoteCurrencies = []
      this.currencies.forEach(item => {
        if (quoteCurrencies.indexOf(item.quote_currency) === -1) {
          quoteCurrencies.push(item.quote_currency)
        }
      })
      return quoteCurrencies;
    },
    rate() {
      if (this.quoteCurrencies[this.indexQuote] === this.baseCurrencies[this.indexBase]) {
        return 1
      } else {
        const pairRate = this.pairRates.filter(item => {
          if (item.pair === this.quoteCurrencies[this.indexQuote] + '/' + this.baseCurrencies[this.indexBase]) {
            item.rate = 1 / item.rate
            return item
          } else if (item.pair === this.baseCurrencies[this.indexBase] + '/' + this.quoteCurrencies[this.indexQuote]) {
            return item
          }
        })
        return pairRate[0].rate
      }
    },
    quoteRate: {
      get() {
        return this.baseRate * this.rate
      },
      set(val) {
        this.baseRate = (1 / this.rate) * val
        return val
      }

    },
    commission() {
      let commission = 1
      this.currencies.forEach(item => {
        if (item.base_currency === this.baseCurrencies[this.indexBase] && item.quote_currency === this.quoteCurrencies[this.indexQuote]) {
          commission = item.commission
        }
      })
      return commission
    }
  },
  methods: {
    async fetch() {
      await this.$store.dispatch('currencies/fetch')
      setTimeout(this.fetch, 30000)
    }
  },
  async mounted() {
    await this.fetch()
  }

}
</script>

<style scoped lang="scss">
.grid-container {
  display: grid;
  grid-template-columns: auto auto;
  gap: 10px;
  padding: 10px;

  .coll {
    border: 1px solid #d0cbcb;
    border-radius: 10px;
    text-align: center;
    padding: 20px;

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    input[type=number] {
      -moz-appearance: textfield;
    }

    select {
      background-color: blue;

      option {
        background-color: white;
      }
    }

    .left {
      float: left;
    }

    .right {
      float: right;
    }
  }
}
</style>
