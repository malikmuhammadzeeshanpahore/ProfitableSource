// Environment-aware API base selection (uses VITE_API_BASE when provided)
const runtimeBase = (typeof window !== 'undefined' && window.__API_BASE__) ? window.__API_BASE__ : null
const envBase = import.meta.env.VITE_API_BASE || null
const isDev = import.meta.env.MODE === 'development'

let configured = runtimeBase || envBase
if (!configured) {
  configured = '/api'
}
// ensure no trailing slash
const BASE = configured.replace(/\/$/, '')

// Export function to get full backend URL (for uploads, etc.)
export function getApiBase() {
  // In development, backend is on port 3000
  if (isDev && BASE === '/api') {
    return 'http://localhost:3000'
  }
  // In production or if custom base is set
  return BASE.replace('/api', '')
}

if (isDev) console.info('[api] running in development mode, API base =', BASE)

let token = localStorage.getItem('de_token') || null
let adminSecret = null

function authHeaders() {
  return token ? { 'Authorization': 'Bearer ' + token } : {}
}

async function f(url, options = {}) {
  const headers = Object.assign({}, authHeaders(), options.headers || {})
  const res = await fetch(BASE + url, Object.assign({}, options, { headers }))

  if (res.status === 401) {
    setToken(null)
    // Optional: trigger a real-time event to update UI immediately
    window.dispatchEvent(new CustomEvent('authError', { detail: { type: '401' } }))
    return { error: 'Session expired' }
  }

  return res.json()
}

export async function signup({ name, email, phone, password, referral }) {
  const publicIp = localStorage.getItem('de_public_ip') || null
  return f('/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, phone, password, referral, publicIp }) })
}

export async function login({ email, password }) {
  const publicIp = localStorage.getItem('de_public_ip') || null
  return f('/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, publicIp }) })
}

export async function me() {
  return f('/auth/me')
}

export async function getPackages() {
  return f('/packages')
}

export async function getMyPackages() {
  return f('/packages/mine')
}

export async function claimPackage(userPackageId) {
  return f(`/packages/${encodeURIComponent(userPackageId)}/claim`, { method: 'POST' })
}

export async function buyPackage(packageId) {
  return f('/packages/buy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ packageId }) })
}

export async function getBalance() {
  return f('/wallet/balance')
}

export async function getTransactions() {
  return f('/wallet/transactions')
}

export async function withdraw({ amount, method, account }) {
  return f('/wallet/withdraw', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount, method, account }) })
}

export async function updateMe(payload) {
  return f('/auth/me', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
}

export async function changePassword({ oldPassword, newPassword }) {
  return f('/auth/change-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ oldPassword, newPassword }) })
}

export async function claimDaily() {
  return f('/wallet/claim', { method: 'POST' })
}

export async function claimRegistration() {
  return f('/wallet/claim-registration', { method: 'POST' })
}

export async function getRecentActivity() {
  return f('/wallet/recent-activity')
}

export async function submitDeposit({ accountHolder, transactionId, amount, method, screenshotFile, packageId, sentWith }) {
  const form = new FormData()
  form.append('accountHolder', accountHolder || 'User')
  form.append('transactionId', transactionId)
  form.append('amount', amount)
  form.append('method', method)
  if (sentWith) form.append('sentWith', sentWith)
  if (packageId) form.append('packageId', packageId)
  if (screenshotFile) form.append('screenshot', screenshotFile)

  // Custom fetch for multipart
  const res = await fetch(BASE + '/deposits', { method: 'POST', headers: { ...authHeaders() }, body: form })
  if (res.status === 401) {
    setToken(null)
    return { error: 'Session expired' }
  }
  return res.json()
}

export const createDeposit = (amount, method, tid, file, sentWith) => submitDeposit({
  amount,
  method,
  transactionId: tid,
  screenshotFile: file,
  sentWith,
  accountHolder: 'User'
})

export function assetUrl(path) {
  if (!path) return ''
  return (configured ? configured : '') + path
}

export async function getMyDeposits() {
  return f('/deposits')
}

// admin
export async function adminApproveDeposit(id) {
  return f(`/admin/deposits/${id}/approve`, { method: 'POST' })
}

export async function adminRejectDeposit(id) {
  return f(`/admin/deposits/${id}/reject`, { method: 'POST' })
}

export function setAdminSecret(s) { adminSecret = s }

function adminHeaders() {
  const h = {}
  if (adminSecret) h['x-admin-secret'] = adminSecret
  return h
}

export async function adminGetDeposits() {
  return f('/admin/deposits', { headers: adminHeaders() })
}

export async function adminGetBlocked() {
  return f('/admin/blocked', { headers: adminHeaders() })
}

export async function adminUnblock(ip) {
  return f(`/admin/blocked/${encodeURIComponent(ip)}/unblock`, { method: 'POST', headers: adminHeaders() })
}

export async function adminGetWhitelist() {
  return f('/admin/whitelist', { headers: adminHeaders() })
}

export async function adminAddWhitelist({ ip, note }) {
  return f('/admin/whitelist', { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, adminHeaders()), body: JSON.stringify({ ip, note }) })
}

export async function adminRemoveWhitelist(ip) {
  return f(`/admin/whitelist/${encodeURIComponent(ip)}/remove`, { method: 'POST', headers: adminHeaders() })
}

export async function adminGetUsers() {
  return f('/admin/users', { headers: adminHeaders() })
}

export async function adminGetTransactions() {
  return f('/admin/transactions', { headers: adminHeaders() })
}

export async function adminGetUser(id) {
  return f(`/admin/users/${encodeURIComponent(id)}`, { headers: adminHeaders() })
}

export async function adminActivatePackage(userId, payload) {
  return f(`/admin/users/${encodeURIComponent(userId)}/activate-package`, { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, adminHeaders()), body: JSON.stringify(payload) })
}

export async function adminLinkReferral(payload) {
  return f(`/admin/users/link-referral`, { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, adminHeaders()), body: JSON.stringify(payload) })
}

export async function adminReconcileReferralBonuses(payload) {
  return f(`/admin/reconcile-referral-bonuses`, { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, adminHeaders()), body: JSON.stringify(payload) })
}

export async function adminReconcilePurchases() {
  return f('/admin/reconcile-purchases', { method: 'POST', headers: adminHeaders() })
}

export async function postEvent(payload) {
  try {
    let pub = localStorage.getItem('de_public_ip') || null
    if (!pub) {
      const controller = new AbortController()
      const id = setTimeout(() => controller.abort(), 1500)
      try {
        const r = await fetch('https://api.ipify.org?format=json', { signal: controller.signal })
        clearTimeout(id)
        if (r && r.ok) { const j = await r.json(); if (j && j.ip) { pub = j.ip; localStorage.setItem('de_public_ip', pub) } }
      } catch (e) { }
    }
    if (pub) payload = Object.assign({}, payload, { clientIp: pub })
  } catch (e) { }

  return f('/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
}

export async function adminGetEvents(limit) {
  const q = limit ? '?limit=' + encodeURIComponent(limit) : ''
  return f('/events/recent' + q, { headers: adminHeaders() })
}

export async function adminGetVisits(limit) {
  const q = limit ? '?limit=' + encodeURIComponent(limit) : ''
  return f('/admin/visits' + q, { headers: adminHeaders() })
}

export async function adminManualReferralBonus(payload) {
  return f(`/admin/manual-referral-bonus`, { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, adminHeaders()), body: JSON.stringify(payload) })
}

export async function adminUpdatePackage(id, payload) {
  return f(`/admin/packages/${encodeURIComponent(id)}/update`, { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, adminHeaders()), body: JSON.stringify(payload) })
}

export async function adminResetPackageClaims(userId) {
  return f(`/admin/users/${encodeURIComponent(userId)}/reset-package-claims`, { method: 'POST', headers: adminHeaders() })
}

export async function adminApproveWithdraw(id) {
  return f(`/admin/withdraws/${id}/approve`, { method: 'POST', headers: adminHeaders() })
}

export async function adminRejectWithdraw(id) {
  return f(`/admin/withdraws/${id}/reject`, { method: 'POST', headers: adminHeaders() })
}

export async function adminGetWithdraws() {
  return f('/admin/withdraws', { headers: adminHeaders() })
}

export async function adminMarkWithdrawSent(id) {
  return f(`/admin/withdraws/${id}/sent`, { method: 'POST', headers: adminHeaders() })
}

export async function adminConfirmWithdraw(id) {
  return f(`/admin/withdraws/${id}/complete`, { method: 'POST', headers: adminHeaders() })
}

export async function adminBanUser(userId) {
  return f(`/admin/users/${encodeURIComponent(userId)}/ban`, { method: 'POST', headers: adminHeaders() })
}

export async function adminUnbanUser(userId) {
  return f(`/admin/users/${encodeURIComponent(userId)}/unban`, { method: 'POST', headers: adminHeaders() })
}

export async function adminPromoteUser(userId) {
  return f(`/admin/users/${encodeURIComponent(userId)}/promote`, { method: 'POST', headers: adminHeaders() })
}

export async function adminDeleteUser(userId) {
  return f(`/admin/users/${encodeURIComponent(userId)}`, { method: 'DELETE', headers: adminHeaders() })
}

export async function adminSendBonus(userId, amount) {
  return f(`/admin/users/${encodeURIComponent(userId)}/bonus`, { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, adminHeaders()), body: JSON.stringify({ amount }) })
}

export async function adminManualActivatePackage(userId, packageId) {
  return f(`/admin/users/${encodeURIComponent(userId)}/manual-activate`, { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, adminHeaders()), body: JSON.stringify({ packageId }) })
}

export function setToken(t) { token = t; if (t) localStorage.setItem('de_token', t); else localStorage.removeItem('de_token') }

export async function getReferralStats() {
  return f('/auth/referrals')
}

export const getUserPackages = getMyPackages
export const getDeposits = getMyDeposits

export default {
  signup, login, me, getPackages, getMyPackages, getUserPackages, claimPackage, buyPackage,
  getBalance, getTransactions, withdraw, submitDeposit, createDeposit, getMyDeposits, getDeposits,
  claimDaily, claimRegistration, getRecentActivity,
  updateMe, getReferralStats,
  // admin helpers
  adminGetDeposits, adminApproveDeposit, adminRejectDeposit,
  adminGetBlocked, adminUnblock, adminGetUsers, adminGetTransactions,
  adminGetWhitelist, adminAddWhitelist, adminRemoveWhitelist,
  adminGetWithdraws, adminMarkWithdrawSent, adminConfirmWithdraw,
  adminApproveWithdraw, adminRejectWithdraw,
  adminGetUser, adminActivatePackage, adminLinkReferral, adminReconcileReferralBonuses, adminReconcilePurchases, adminManualReferralBonus, adminGetEvents, adminGetVisits,
  adminBanUser, adminUnbanUser, adminPromoteUser, adminDeleteUser, adminSendBonus, adminManualActivatePackage,
  // events & post
  postEvent,
  // secrets & auth
  assetUrl,
  setAdminSecret, setToken
}
