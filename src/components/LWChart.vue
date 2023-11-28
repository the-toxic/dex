<template>
	<div class="fill-height fill-width" ref="chartContainer"></div>
</template>

<script>
import { createChart } from 'lightweight-charts';

// Lightweight Chart instances are stored as normal JS variables
// If you need to use a ref then it is recommended that you use `shallowRef` instead
let series;
let chart;

// Function to get the correct series constructor name for current series type.
function getChartSeriesConstructorName(type) {
	return `add${type.charAt(0).toUpperCase() + type.slice(1)}Series`;
}

// Creates the chart series and sets the data.
const addSeriesAndData = (type, seriesOptions, data) => {
	const seriesConstructor = getChartSeriesConstructorName(type);
	series = chart[seriesConstructor](seriesOptions);
	series.setData(data);
};

// Auto resizes the chart when the browser window is resized.
const resizeHandler = container => {
	if (!chart || !container) return;
	const dimensions = container.getBoundingClientRect();
	chart.resize(dimensions.width, dimensions.height);
};

const defaultChartOptions = {
	layout: {
		background: {
			type: 'solid',
			color: '#2B2B43',
		},
		lineColor: '#2B2B43',
		textColor: '#D9D9D9',
	},
	// localization: {
	// 	priceFormatter: Intl.NumberFormat('en-US', {
	// 		style: "currency",
	// 		currency: "USD", // Currency for data points
	// 	}).format,
	// },
	watermark: {
		color: 'rgba(0, 0, 0, 0)',
	},
	crosshair: {
		color: '#758696',
	},
	grid: {
		vertLines: {
			color: '#2B2B43',
		},
		horzLines: {
			color: '#363C4E',
		},
	}
}
const defaultAreaSeriesOptions = {
	topColor: 'rgba(148,32,226,0.56)',
	bottomColor: 'rgba(171,32,226,0.04)',
	lineColor: 'rgb(178,32,226)',
	lineWidth: 2,
	priceFormat: {
		type: 'volume', // format number to 1K 1M...
	},
}

export default {
	name: 'LWChart',
	props: {
		type: {
			type: String,
			default: 'area',
		},
		data: {
			type: Array,
			required: true,
		},
		autosize: {
			default: true,
			type: Boolean,
		},
		chartOptions: {
			type: Object,
		},
		seriesOptions: {
			type: Object,
		},
		timeScaleOptions: {
			type: Object,
		},
		priceScaleOptions: {
			type: Object,
		},
	},
	mounted() {
		// Create the Lightweight Charts Instance using the container ref.
		chart = createChart(this.$refs.chartContainer, this.chartOptions );
		chart.applyOptions(defaultChartOptions)
		addSeriesAndData(this.type, this.seriesOptions, this.data);
		series.applyOptions(defaultAreaSeriesOptions)

		if (this.priceScaleOptions) {
			chart.priceScale().applyOptions(this.priceScaleOptions);
		}

		if (this.timeScaleOptions) {
			chart.timeScale().applyOptions(this.timeScaleOptions);
		}

		chart.timeScale().fitContent();

		if (this.autosize) {
			window.addEventListener('resize', () =>
				resizeHandler(this.$refs.chartContainer)
			);
		}
	},
	unmounted() {
		if (chart) {
			chart.remove();
			chart = null;
		}
		if (series) {
			series = null;
		}
		window.removeEventListener('resize', resizeHandler);
	},
	/*
	 * Watch for changes to any of the component properties.
	 *
	 * If an options property is changed then we will apply those options
	 * on top of any existing options previously set (since we are using the
	 * `applyOptions` method).
	 *
	 * If there is a change to the chart type, then the existing series is removed
	 * and the new series is created, and assigned the data.
	 *
	 */
	watch: {
		autosize(enabled) {
			if (!enabled) {
				window.removeEventListener('resize', () =>
					resizeHandler(this.$refs.chartContainer)
				);
				return;
			}
			window.addEventListener('resize', () =>
				resizeHandler(this.$refs.chartContainer)
			);
		},
		type(newType) {
			if (series && chart) {
				chart.removeSeries(series);
			}
			addSeriesAndData(this.type, this.seriesOptions, this.data);
		},
		data(newData) {
			if (!series) return;
			series.setData(newData);
		},
		chartOptions(newOptions) {
			if (!chart) return;
			chart.applyOptions(newOptions);
			this.fitContent()
		},
		seriesOptions(newOptions) {
			if (!series) return;
			series.applyOptions(newOptions);
		},
		priceScaleOptions(newOptions) {
			if (!chart) return;
			chart.priceScale().applyOptions(newOptions);
		},
		timeScaleOptions(newOptions) {
			if (!chart) return;
			chart.timeScale().applyOptions(newOptions);
		},
	},
	methods: {
		fitContent() {
			if (!chart) return;
			chart.timeScale().fitContent();
		},
		getChart() {
			return chart;
		},
	},
	expose: ['fitContent', 'getChart'],
};
</script>
