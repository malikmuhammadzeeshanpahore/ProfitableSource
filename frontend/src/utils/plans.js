export function generatePlans() {
  // We produce exactly 15 plans starting at Rs 200, ending at Rs 200,000.
  const prices = [
    200,400,800,1600,3200,6400,12800,25600,51200,64000,80000,100000,125000,150000,200000
  ]

  // exact dailyClaim for seeds provided by the user
  const seedDaily = {
    200: 35,
    400: 75,
    800: 155,
    1600: 320,
    3200: 650,
    6400: 1310
  }

  const icons = ['ri-flash-line','ri-fire-line','ri-rocket-line','ri-sparkles-line','ri-star-line']
  const names = [
    'START PLAN','BRONZE','SILVER','GOLD','PLATINUM','DIAMOND',
    'TITAN 12800','TITAN PRO 25600','STAR 51200','ALPHA 64000','OMEGA 80000',
    'CENTURION 100000','ASCEND 125000','SUMMIT 150000','LEGACY 200000'
  ]

  const plans = prices.map((price, idx) => {
    const daily = seedDaily[price] ?? Math.round((price * 35) / 200)
    // Lock any plan that is Rs 100,000 or above
    const locked = price >= 100000
    const name = names[idx] || `Plan ${price}`
    const icon = 'ri-flash-line'
    const duration = 90 // per user's example (Plan Life 90)
    const depositCommission = 19
    const totalProfit = daily * duration
    const desc = `${name} plan`
    return { id: `plan-${price}`, price, cost: price, dailyClaim: daily, dailyProfit: daily, name, desc, icon, duration, depositCommission, totalProfit, locked }
  })

  return plans
}

