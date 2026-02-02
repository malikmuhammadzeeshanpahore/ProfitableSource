const express = require('express')
const router = express.Router()
const { models } = require('../models')
const { Op } = require('sequelize')
const { authenticate } = require('../middleware/auth')

router.get('/balance', authenticate, async (req, res) => {
  return res.json({ wallet: req.user.wallet })
})

router.get('/transactions', authenticate, async (req, res) => {
  const txs = await models.Transaction.findAll({ where: { userId: req.user.id }, order: [['createdAt', 'DESC']] })
  return res.json({ transactions: txs })
})

// request withdrawal (demo: creates a transaction with status pending in real app)
router.post('/withdraw', authenticate, async (req, res) => {
  const { amount } = req.body
  if (!req.user.isActive) return res.status(403).json({ error: 'Account not active. Withdrawals not allowed.' })
  // require payout details to be configured on profile
  if (!req.user.payoutName || !req.user.payoutMethod || !req.user.payoutAccount) return res.status(400).json({ error: 'Please add withdrawal account details in your profile before requesting a withdrawal.' })
  // minimum withdraw is 30 PKR
  if (!amount || amount < 30) return res.status(400).json({ error: 'Minimum withdraw is 30' })
  if (req.user.wallet < amount) return res.status(400).json({ error: 'Insufficient balance' })

  // Requirement: User must have an active plan to withdraw
  if (!req.user.currentPackageId) {
    return res.status(400).json({ error: 'You must have an active plan to request a withdrawal.' })
  }

  // WITHDRAWAL LOCK CHECK
  // Requirement: 3 referrals, at least 1 must have an approved deposit
  try {
    const referrals = await models.User.findAll({ where: { referredBy: req.user.id }, attributes: ['id'] })
    const referralCount = referrals.length

    let activeReferralCount = 0
    if (referralCount >= 3) {
      const referralIds = referrals.map(u => u.id)
      const activeDeposits = await models.Deposit.count({
        where: {
          userId: referralIds,
          status: 'approved'
        },
        distinct: true,
        col: 'userId'
      })
      activeReferralCount = activeDeposits
    }

    // Condition: Must have at least 3 referrals AND at least 1 active referral (who made a deposit)
    if (referralCount < 3 || activeReferralCount < 1) {
      return res.status(400).json({
        error: 'WITHDRAWAL_LOCKED',
        message: 'Withdrawal is locked',
        stats: { referrals: referralCount, active: activeReferralCount }
      })
    }
  } catch (e) {
    console.error('Withdrawal lock check failed', e)
    return res.status(500).json({ error: 'server error during verification' })
  }

  // No withdrawal limits - users can withdraw anytime, any number of times per day

  // apply 15% tax/fee (Updated from 10%)
  const fee = Math.round((amount * 0.15) * 100) / 100
  const net = Math.round((amount - fee) * 100) / 100
  // create pending withdrawal transaction and reduce wallet immediately; admin can approve/reject (reject will refund)
  req.user.wallet = Math.round(((req.user.wallet || 0) - amount) * 100) / 100
  await req.user.save()
  const tid = 't' + Date.now()
  // store the payout details that will be used by admin to process the payment
  await models.Transaction.create({ id: tid, userId: req.user.id, type: 'withdraw', amount, status: 'pending', meta: { payoutName: req.user.payoutName, payoutMethod: req.user.payoutMethod, payoutAccount: req.user.payoutAccount, fee, net } })
  return res.json({ ok: true, wallet: req.user.wallet, fee, net })
})

// claim registration bonus
router.post('/claim-registration', authenticate, async (req, res) => {
  try {
    const user = req.user
    if (!user.registrationBonusPending) return res.status(400).json({ error: 'No registration bonus available' })
    const bonus = 20
    user.wallet = (user.wallet || 0) + bonus
    user.registrationBonusPending = false
    user.registrationBonusClaimedAt = new Date()
    await user.save()
    await models.Transaction.create({ id: 't' + Date.now(), userId: user.id, type: 'registration_bonus', amount: bonus, meta: {} })
    return res.json({ ok: true, wallet: user.wallet, amount: bonus })
  } catch (e) { console.error('Claim registration failed', e); return res.status(500).json({ error: 'server' }) }
})

// daily claim
router.post('/claim', authenticate, async (req, res) => {
  try {
    const user = req.user
    if (!user.currentPackageId) return res.status(400).json({ error: 'No active package' })
    const pkg = await models.Package.findByPk(user.currentPackageId)
    if (!pkg) return res.status(400).json({ error: 'Package not found' })
    const now = new Date()
    const last = user.lastClaimedAt ? new Date(user.lastClaimedAt) : null
    // allow one claim per day (UTC date)
    const sameDay = last && last.getUTCFullYear() === now.getUTCFullYear() && last.getUTCMonth() === now.getUTCMonth() && last.getUTCDate() === now.getUTCDate()
    if (sameDay) return res.status(400).json({ error: 'Already claimed today' })
    // check package expiry
    if (user.packageExpiresAt && new Date(user.packageExpiresAt) < now) return res.status(400).json({ error: 'Package expired' })
    const amount = pkg.dailyClaim || 0
    if (!amount || amount <= 0) return res.status(400).json({ error: 'No daily reward for this package' })
    user.wallet = (user.wallet || 0) + amount
    user.lastClaimedAt = now
    await user.save()
    await models.Transaction.create({ id: 't' + Date.now(), userId: user.id, type: 'daily', amount, meta: { packageId: pkg.id } })
    return res.json({ ok: true, wallet: user.wallet, amount })
  } catch (e) { console.error('Claim error', e); return res.status(500).json({ error: 'server' }) }
})

// get recent activity (claims, deposits, withdrawals)
router.get('/recent-activity', authenticate, async (req, res) => {
  try {
    const userId = req.user.id
    const limit = 20 // Show last 20 activities

    // Fetch recent transactions (claims)
    const transactions = await models.Transaction.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: limit,
      attributes: ['id', 'type', 'amount', 'status', 'createdAt', 'meta']
    })

    // Fetch recent deposits
    const deposits = await models.Deposit.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: limit,
      attributes: ['id', 'amount', 'status', 'createdAt', 'method']
    })

    // Combine and format activities
    const activities = []

    // Add transactions (claims, withdrawals)
    transactions.forEach(tx => {
      activities.push({
        id: tx.id,
        type: tx.type,
        amount: tx.amount,
        status: tx.status || 'completed',
        createdAt: tx.createdAt,
        meta: tx.meta
      })
    })

    // Add deposits
    deposits.forEach(dep => {
      activities.push({
        id: dep.id,
        type: 'deposit',
        amount: dep.amount,
        status: dep.status,
        createdAt: dep.createdAt,
        meta: { method: dep.method }
      })
    })

    // Sort by createdAt descending and limit
    activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    const recentActivities = activities.slice(0, limit)

    return res.json({ activities: recentActivities })
  } catch (e) {
    console.error('Recent activity error', e)
    return res.status(500).json({ error: 'server' })
  }
})

module.exports = router
