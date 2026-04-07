<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'vue-chartjs'
import FilterChartBar from './FilterChartBar.vue'

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend)

const currentDurationType = ref('daily') // currently showing
const durationTypes = ['daily', 'weekly', 'monthly'] // other dropdown to show

function updateDurationType(n) {
  currentDurationType.value = n
}

// brain behind the numbers coming
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// calculating date, revenue, profit
const generateChartData = () => {
  // using return so it would come in object
  return {
    // Creates an array of 7 empty slots → one for each day., and loops through them
    revenueProfit_daily: Array.from({ length: 7 }).map((_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i)) // the last 7 days of em
      return {
        date: date.toISOString().split('T')[0], // date format like 2025-04-12
        revenue: getRandomInt(10000, 50000),
        profit: getRandomInt(5000, 25000),
      }
    }),
    revenueProfit_weekly: Array.from({ length: 4 })
      .map((_, i) => {
        const week = 202540 - i // shortcut way of mocking week numbers
        return {
          week,
          revenue: getRandomInt(60000, 200000),
          profit: getRandomInt(30000, 100000),
        }
      })
      .reverse(),
    // creates 6 slots (one per month).
    revenueProfit_monthly: Array.from({ length: 6 }).map((_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - (5 - i)) // looping through the other month
      const month = date.toISOString().slice(0, 7) // YYYY-MM format
      return {
        month,
        revenue: getRandomInt(300000, 600000),
        profit: getRandomInt(150000, 350000),
      }
    }),
  }
}

const chartData = ref(generateChartData())

onMounted(() => {
  setInterval(
    () => {
      chartData.value = generateChartData()
    },
    24 * 60 * 60 * 1000, // reset after every 24 hours
  )
})

function formatWeekDescription(weekNumber) {
  const weekStr = weekNumber.toString() // e.g. 202540
  const year = weekStr.substring(0, 4) // "2025"
  const week = parseInt(weekStr.substring(4)) // 40
  return `Week ${week} of ${year}` // "Week 40 of 2025"
}

// date format
function formatDateLabel(dateString) {
  if (currentDurationType.value === 'daily') {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  } else if (currentDurationType.value === 'monthly') {
    const [year, month] = dateString.split('-')
    const date = new Date(year, parseInt(month) - 1)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }
  return dateString
}

const barData = computed(() => {
  let labels = []
  let revenueData = []
  let profitData = []

  if (currentDurationType.value === 'daily') {
    labels = chartData.value.revenueProfit_daily.map((item) => formatDateLabel(item.date))
    revenueData = chartData.value.revenueProfit_daily.map((item) => item.revenue)
    profitData = chartData.value.revenueProfit_daily.map((item) => item.profit)
  } else if (currentDurationType.value === 'weekly') {
    labels = chartData.value.revenueProfit_weekly.map(
      (item) => `${formatWeekDescription(item.week)}`, // "Week 40 of 2025"
    )
    revenueData = chartData.value.revenueProfit_weekly.map((item) => item.revenue)
    profitData = chartData.value.revenueProfit_weekly.map((item) => item.profit)
  } else if (currentDurationType.value === 'monthly') {
    labels = chartData.value.revenueProfit_monthly.map((item) => formatDateLabel(item.month))
    revenueData = chartData.value.revenueProfit_monthly.map((item) => item.revenue)
    profitData = chartData.value.revenueProfit_monthly.map((item) => item.profit)
  }

  return {
    labels,
    datasets: [
      {
        label: 'Revenue',
        data: revenueData,
        backgroundColor: 'rgb(105, 108, 255)',
        borderWidth: 1,
        borderColor: 'rgb(105, 108, 255)',
        barPercentage: 0.5,
      },
      {
        label: 'Profit',
        data: profitData,
        backgroundColor: '#71b1f8',
        borderWidth: 1,
        borderColor: '#71b1f8',
        barPercentage: 0.5,
      },
    ],
  }
})

// prevent the number from making the bar messy
function formatYAxisNumber(value) {
  if (value >= 1000000) {
    // If value is 1,000,000 or more → convert to millions (m)
    return (value / 1000000).toFixed(1) + 'm'
  } else if (value >= 1000) {
    // If value is 1,000 or more → convert to thousands (k)
    return (value / 1000).toFixed(1) + 'k'
  }
  // Otherwise → keep the raw number as a string
  return value.toString()
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      align: 'center',
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 20,
      },
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || ''
          if (label) {
            label += ': '
          }
          if (context.parsed.y !== null) {
            label += formatYAxisNumber(context.parsed.y)
          }
          return label
        },
      },
    },
  },
  scales: {
    x: {
      ticks: {
        display: true,
        autoSkip: true,
        maxTicksLimit: 10,
      },
      grid: {
        drawTicks: false,
        display: false,
      },
    },
    y: {
      grid: {
        display: true,
      },
      beginAtZero: true,
      ticks: {
        callback: function (value) {
          return formatYAxisNumber(value)
        },
      },
    },
  },
}
</script>

<template>
  <div class="flex flex-row flex-wrap gap-5 justify-between mb-4">
    <FilterChartBar :options="durationTypes" @change-cat="updateDurationType" />
  </div>

  <div class="w-full h-[300px]">
    <Bar class="h-full" :data="barData" :options="chartOptions" />
  </div>
</template>
