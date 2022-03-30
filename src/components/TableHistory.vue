<template>
  <v-simple-table fixed-header height="300px" >
    <thead>
    <tr>
      <th class="text-left">Date</th>
      <th class="text-left">Type</th>
      <th class="text-left">Price USD</th>
      <th class="text-left">Price BNB</th>
      <th class="text-left">Amount ETH</th>
      <th class="text-left">Total BUSD</th>
      <th class="text-left">Total BNB</th>
      <th class="text-left">Maker</th>
      <th class="text-left">Others</th>
    </tr>
    </thead>
    <tbody>
    <tr v-if="!rows.length"><td colspan="9" class="text-center">No activity</td></tr>
    <tr v-for="(item, idx) in rows" :key="idx" >
      <td>{{ item.date }}</td>
      <td>{{ item.type }}</td>
      <td>${{ item.price_usd }}</td>
      <td>{{ item.price_bnb }}</td>
      <td>{{ item.amount_eth }}</td>
      <td>{{ item.total_busd }}</td>
      <td>{{ item.total_bnb }}</td>
      <td>{{ item.maker }}</td>
      <td><a :href="`https://bscscan.com/tx/${item.tx}`" target="_blank">Show Tx</a></td>
    </tr>
    </tbody>
  </v-simple-table>
</template>

<script>
export default {
  name: "TableHistory",
  data() {return {
    rows: [
    //   {
    //   'tx': '0x2edf205e6a556fde5de54391bc022ab8ec07394a36f1615159ec623f0c2df1cf',
    //   'date': '2022-03-23 17:34:08',
    //   'type': 'buy',
    //   'price_usd': '0.093834',
    //   'price_bnb': '0.000233',
    //   'amount_eth': '221.423',
    //   'total_busd': '20.777',
    //   'total_bnb': '0.051583',
    //   'maker': '0xd8...2fd5',
    // },
    //   {
    //   'tx': '0x2edf205e6a556fde5de54391bc022ab8ec07394a36f1615159ec623f0c2df1cf',
    //   'date': '2022-03-23 17:28:53',
    //   'type': 'sell',
    //   'price_usd': '0.09334',
    //   'price_bnb': '0.0002314',
    //   'amount_eth': '356.634',
    //   'total_busd': '33.2883',
    //   'total_bnb': '0.082513',
    //   'maker': '0xd8...2fd5',
    // },
    //   {
    //   'tx': '0x2edf205e6a556fde5de54391bc022ab8ec07394a36f1615159ec623f0c2df1cf',
    //   'date': '2022-03-23 17:34:08',
    //   'type': 'buy',
    //   'price_usd': '0.093834',
    //   'price_bnb': '0.000233',
    //   'amount_eth': '221.423',
    //   'total_busd': '20.777',
    //   'total_bnb': '0.051583',
    //   'maker': '0xd8...2fd5',
    // },
    //   {
    //   'tx': '0x2edf205e6a556fde5de54391bc022ab8ec07394a36f1615159ec623f0c2df1cf',
    //   'date': '2022-03-23 17:28:53',
    //   'type': 'sell',
    //   'price_usd': '0.09334',
    //   'price_bnb': '0.0002314',
    //   'amount_eth': '356.634',
    //   'total_busd': '33.2883',
    //   'total_bnb': '0.082513',
    //   'maker': '0xd8...2fd5',
    // },
    //   {
    //   'tx': '0x2edf205e6a556fde5de54391bc022ab8ec07394a36f1615159ec623f0c2df1cf',
    //   'date': '2022-03-23 17:34:08',
    //   'type': 'buy',
    //   'price_usd': '0.093834',
    //   'price_bnb': '0.000233',
    //   'amount_eth': '221.423',
    //   'total_busd': '20.777',
    //   'total_bnb': '0.051583',
    //   'maker': '0xd8...2fd5',
    // },
    //   {
    //   'tx': '0x2edf205e6a556fde5de54391bc022ab8ec07394a36f1615159ec623f0c2df1cf',
    //   'date': '2022-03-23 17:28:53',
    //   'type': 'sell',
    //   'price_usd': '0.09334',
    //   'price_bnb': '0.0002314',
    //   'amount_eth': '356.634',
    //   'total_busd': '33.2883',
    //   'total_bnb': '0.082513',
    //   'maker': '0xd8...2fd5',
    // },
    ]
  }}
}
</script>
