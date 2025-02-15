import './index.css'
import QuoteForm from './components/QuoteForm'

function App() {
  return (
    <div className="min-h-screen">

      <section className="bg-sky-500 text-white py-20 print:hidden">
          <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Quote Calculator</h1>
              <p className="text-xl mb-4">Get an instant estimate for your roofing project</p>
          </div>
      </section>

      <div className="flex flex-col items-center bg-gray-100 py-12 px-4">
        <QuoteForm />
      </div>

    </div>
  )
}

export default App