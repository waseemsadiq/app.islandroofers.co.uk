import './index.css'
import { Calculator } from "lucide-react"
import QuoteForm from './components/QuoteForm'

function App() {
  return (
    <div className="min-h-screen">

      <section className="bg-sky-500 text-white py-20 print:hidden">
          <div className="container mx-auto px-4 text-center">
              <div className="flex items-center gap-2 mb-4 mx-auto">
                <Calculator className="w-12 h-12 text-white-600" />
                <h1 className="text-4xl md:text-6xl font-bold mb-6">Roof Quote Calculator</h1>
              </div>
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