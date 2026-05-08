import { useEffect, useState } from 'react'
import Alert from '../components/Alert.jsx'
import Button from '../components/Button.jsx'
import Input from '../components/Input.jsx'
import { fetchMyWallet, topUpWallet, transferWallet } from '../services/wallet.js'

function WalletPage() {
  const [wallet, setWallet] = useState(null)
  const [amount, setAmount] = useState('')
  const [transfer, setTransfer] = useState({ recipientUserId: '', amount: '', referenceId: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      setWallet(await fetchMyWallet())
    } catch (e) {
      setError(e.response?.data?.detail || 'Failed to load wallet.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const onTopUp = async (e) => {
    e.preventDefault()
    await topUpWallet(Number(amount))
    setAmount('')
    await load()
  }

  const onTransfer = async (e) => {
    e.preventDefault()
    await transferWallet({
      recipientUserId: Number(transfer.recipientUserId),
      amount: Number(transfer.amount),
      referenceId: transfer.referenceId,
    })
    setTransfer({ recipientUserId: '', amount: '', referenceId: '' })
    await load()
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Wallet</h1>
      {error ? <Alert type="error">{error}</Alert> : null}
      <div className="section-shell p-5">
        <div className="text-sm text-slate-500">Available Balance</div>
        <div className="mt-2 text-3xl font-bold text-slate-900">
          {wallet ? `${wallet.currency} ${wallet.balance}` : loading ? 'Loading...' : '—'}
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <form className="section-shell space-y-3 p-5" onSubmit={onTopUp}>
          <h2 className="font-semibold text-slate-900">Top-up Wallet</h2>
          <Input label="Amount" type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          <Button type="submit" className="w-full">Top-up</Button>
        </form>
        <form className="section-shell space-y-3 p-5" onSubmit={onTransfer}>
          <h2 className="font-semibold text-slate-900">Transfer</h2>
          <Input label="Recipient User ID" type="number" value={transfer.recipientUserId} onChange={(e) => setTransfer((s) => ({ ...s, recipientUserId: e.target.value }))} required />
          <Input label="Amount" type="number" min="1" value={transfer.amount} onChange={(e) => setTransfer((s) => ({ ...s, amount: e.target.value }))} required />
          <Input label="Reference ID" value={transfer.referenceId} onChange={(e) => setTransfer((s) => ({ ...s, referenceId: e.target.value }))} required />
          <Button type="submit" className="w-full">Transfer</Button>
        </form>
      </div>
    </section>
  )
}

export default WalletPage
