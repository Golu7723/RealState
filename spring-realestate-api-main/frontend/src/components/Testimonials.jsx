import { motion } from 'framer-motion'

const testimonials = [
  {
    name: 'Ananya Sharma',
    role: 'First-time Buyer',
    quote:
      'The platform felt premium end-to-end. I shortlisted homes in Vijay Nagar and closed in two visits.',
  },
  {
    name: 'Rahul Jain',
    role: 'Rental Seeker',
    quote:
      'Finally, a listing experience that is both elegant and practical. I found a Palasia rental in three days.',
  },
  {
    name: 'Sana Khan',
    role: 'Property Investor',
    quote:
      'Transparent details, strong locality insights, and great agent support. It saves me hours every week.',
  },
]

function Testimonials() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Loved by home seekers and investors
        </h2>
        <p className="text-sm text-slate-600">
          Real stories from users finding their perfect space.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {testimonials.map((item, index) => (
          <motion.article
            key={item.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: index * 0.06 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm leading-relaxed text-slate-700">“{item.quote}”</p>
            <div className="mt-4">
              <div className="font-semibold text-slate-900">{item.name}</div>
              <div className="text-xs text-slate-500">{item.role}</div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

export default Testimonials

