<template>
  <input type="text" :ref="pickerName" :placeholder="placeholder" class="datePickerInput" />
</template>

<script>
import moment from 'moment-timezone/builds/moment-timezone-with-data-10-year-range'
import { AmpPlugin, easepick, PresetPlugin, RangePlugin, TimePlugin } from "@easepick/bundle";

export default {
	name: 'Datepicker',
	props: {
		pickerName: {
      type: String,
      default: 'datepicker'
    },
    initPeriod: {
      type: Array, // Date[]
      default: [null, null]
    },
    placeholder: String
	},
	data() { return {
    period: [null, null],
	}},
  mounted() {
    if(this.initPeriod[0] && this.initPeriod[1])
      this.$refs[this.pickerName].value = this.initPeriod.map(i => moment(i).format("YYYY-MM-DD HH:mm")).join(' - ')

    const _this = this
    window[this.pickerName] = new easepick.create({
      // https://easepick.com/packages/core.html
      element: _this.$refs[_this.pickerName],
      autoApply: false,
      resetBtn: true,
      zIndex: 10,
      format: 'YYYY-MM-DD HH:mm',
      plugins: [ AmpPlugin, RangePlugin, PresetPlugin, TimePlugin ],
      AmpPlugin: { resetButton: true, dropdown: { minYear: 2011, maxYear: null, months: true, years: true }},
      PresetPlugin: { customPreset: _this.customDatepickerPreset() },
      css: [ 'https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.1/dist/index.css' ],
      setup(picker) {
        picker.on('select', (e) => {
          const { end, start } = e.detail;
          // _this.period = [ start.toISOString().slice(0, 19).replace('T', ' ') || '', end.toISOString().slice(0, 19).replace('T', ' ') || '' ]
          _this.period = [ start || null, end || null ]
          console.log(_this.pickerName, _this.period)
          _this.$emit('update', _this.period)
        });
        picker.on('clear', (e) => {
          _this.period = [ null, null ]
          _this.$emit('update', _this.period)
        })
      },
    });
    // window[this.pickerName].getDate()
    // window[this.pickerName].clear()
    // window[this.pickerName].setDate('2023-01-01 - 2023-08-08');
  },
  unmounted() {
    window[this.pickerName].destroy()
    window[this.pickerName] = null
  },
  methods: {
    customDatepickerPreset() {
      return {
        'This Month': [moment().set('date', 1).startOf("day").toDate(), moment().endOf("day").toDate()],
        'Prev Month': [moment().subtract(1, 'months').startOf('month').startOf("day").toDate(), moment().subtract(1, 'months').endOf('month').toDate()],
        'Last 7 Days': [moment().subtract(7, 'days').startOf("day").toDate(), moment().endOf("day").toDate()],
        'Last 14 Days': [moment().subtract(14, 'days').startOf("day").toDate(), moment().endOf("day").toDate()],
        'Last 1 Month': [moment().subtract(1, 'months').startOf("day").toDate(), moment().endOf("day").toDate()],
        'Last 3 Months': [moment().subtract(3, 'months').startOf("day").toDate(), moment().endOf("day").toDate()],
        'Last 6 Months': [moment().subtract(6, 'months').startOf("day").toDate(), moment().endOf("day").toDate()],
        'Last 12 Months': [moment().subtract(1, 'years').startOf("day").toDate(), moment().endOf("day").toDate()],
      }
    }
	}
}
</script>
