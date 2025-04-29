import { useState, useEffect } from "react"
import { ArrowRight, ArrowLeft, Printer } from "lucide-react"
import RoofShapeSelector from "./RoofShapeSelector"
import AddressAutocomplete from "./AddressAutocomplete"
import RoofDimensionDiagram from "./RoofDimensionDiagram"
import type React from "react" // Added import for React

interface QuoteData {
  shape: string
  // Rectangle
  length: number
  width: number
  // L-Shape additional
  lengthB?: number
  widthB?: number
  // H-Shape additional
  lengthC?: number
  widthC?: number
  // Common properties
  complexity: string
  material: string
  unit: "mm" | "cm" | "m"
  // Contact details
  name: string
  email: string
  phone: string
  address: string
  latitude?: number
  longitude?: number
  distanceToKA56PT?: number
}

type Step = "shape" | "dimensions" | "complexity" | "material" | "contact" | "quote"

interface MaterialOption {
  id: string
  name: string
  pricePerSqm: number
}

async function getRoadDistance(fromLat: number, fromLon: number, toLat: number, toLon: number) {
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${fromLon},${fromLat};${toLon},${toLat}?overview=false`,
    )
    const data = await response.json()
    if (data.routes && data.routes[0]) {
      // Convert meters to miles
      return data.routes[0].distance / 1609.34
    }
    return null
  } catch (error) {
    console.error("Error getting road distance:", error)
    return null
  }
}

const convertMeasurements = (from: string, to: string, value: number) => {
  if (from === to) return value
  if (from === "m" && to === "cm") return value * 100
  if (from === "m" && to === "mm") return value * 1000
  if (from === "cm" && to === "m") return value / 100
  if (from === "cm" && to === "mm") return value * 10
  if (from === "mm" && to === "m") return value / 1000
  if (from === "mm" && to === "cm") return value / 10
  return value
}

export default function QuoteForm() {
  const [currentStep, setCurrentStep] = useState<Step>(() => {
    const savedStep = localStorage.getItem("currentStep")
    return (savedStep as Step) || "shape"
  })

  const [furthestStep, setFurthestStep] = useState<Step>(() => {
    const savedFurthestStep = localStorage.getItem("furthestStep")
    return (savedFurthestStep as Step) || "shape"
  })

  const [quoteData, setQuoteData] = useState<QuoteData>(() => {
    const savedData = localStorage.getItem("quoteData")
    return savedData
      ? JSON.parse(savedData)
      : {
          shape: "rectangle",
          length: 0,
          width: 0,
          complexity: "simple",
          material: "large-tile",
          unit: "m",
          name: "",
          email: "",
          phone: "",
          address: "",
        }
  })

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("quoteData", JSON.stringify(quoteData))
  }, [quoteData])

  // Save current step and furthest step to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("currentStep", currentStep)
    localStorage.setItem("furthestStep", furthestStep)
  }, [currentStep, furthestStep])

  // KA5 6PT coordinates
  const KA56PT = {
    latitude: 55.5141,
    longitude: -4.3857,
  }

  const steps: Step[] = ["shape", "dimensions", "complexity", "material", "contact", "quote"]

  const isStepAccessible = (step: Step) => {
    const stepIndex = steps.indexOf(step)
    const furthestStepIndex = steps.indexOf(furthestStep)

    if (stepIndex > furthestStepIndex) {
      return false
    }

    if (stepIndex > 1) {
      // Check for steps after "dimensions"
      if (!validateMeasurements()) {
        return false
      }
    }

    if (stepIndex > 4) {
      // Check for steps after "contact"
      if (!validateContactDetails()) {
        return false
      }
    }

    return true
  }

useEffect(() => {
// Ensure both latitude and longitude are defined numbers
if (
    quoteData.latitude !== undefined &&
    quoteData.longitude !== undefined &&
    typeof quoteData.latitude === 'number' &&
    typeof quoteData.longitude === 'number'
) {
    const fetchDistance = async () => {
    const distance = await getRoadDistance(
        quoteData.latitude as number,
        quoteData.longitude as number,
        KA56PT.latitude,
        KA56PT.longitude,
    )

    if (distance !== null) {
        setQuoteData((prev) => ({
        ...prev,
        distanceToKA56PT: distance,
        }))
    }
    }

    fetchDistance()
}
}, [quoteData.latitude, quoteData.longitude])

  const complexityMultiplier = {
    simple: 1,
    medium: 1.3,
    complex: 1.6,
  }

  const materials: MaterialOption[] = [
    { id: "large-tile", name: "Large tile", pricePerSqm: 110 },
    { id: "large-tile-reboard", name: "Large tile + re-board", pricePerSqm: 130 },
    { id: "plain-tile", name: "Plain tile", pricePerSqm: 205 },
    { id: "plain-tile-reboard", name: "Plain tile + re-board", pricePerSqm: 230 },
    { id: "slating", name: "Slating", pricePerSqm: 180 },
    { id: "slating-resarking", name: "Slating + re-sarking", pricePerSqm: 230 },
  ]

  const convertToMeters = (value: number) => {
    switch (quoteData.unit) {
      case "mm":
        return value / 1000
      case "cm":
        return value / 100
      case "m":
        return value
      default:
        return value
    }
  }

  const calculateArea = () => {
    switch (quoteData.shape) {
      case "rectangle":
        return (
          convertToMeters(quoteData.length) * convertToMeters(quoteData.width)
        ) * 2 // Adjust for roof pitch
      case "l-shape": // Add A + B
        return (
          convertToMeters(quoteData.length) * convertToMeters(quoteData.width) +
          convertToMeters(quoteData.lengthB || 0) * convertToMeters(quoteData.widthB || 0)
        ) * 2 // Adjust for roof pitch
      case "c-shape": // Subtract A - B
        return (
          convertToMeters(quoteData.length) * convertToMeters(quoteData.width) -
          convertToMeters(quoteData.lengthB || 0) * convertToMeters(quoteData.widthB || 0)
        ) * 2 // Adjust for roof pitch
      case "h-shape": // Add A + B + C
        return (
          convertToMeters(quoteData.length) * convertToMeters(quoteData.width) +
          convertToMeters(quoteData.lengthB || 0) * convertToMeters(quoteData.widthB || 0) +
          convertToMeters(quoteData.lengthC || 0) * convertToMeters(quoteData.widthC || 0)
        ) * 2 // Adjust for roof pitch
      default:
        return 0
    }
  }

  const calculateTravelExpenses = (distance: number) => {
    // Calculate round trip cost at 45p per mile
    const mileageCost = distance * 2 * 0.45
    // Return the greater of £90 or the mileage cost
    return Math.max(90, mileageCost)
  }

  const calculateQuote = () => {
    const area = calculateArea()
    const selectedMaterial = materials.find((m) => m.id === quoteData.material)
    const materialCost = selectedMaterial ? selectedMaterial.pricePerSqm : 0
    const multiplier = complexityMultiplier[quoteData.complexity as keyof typeof complexityMultiplier]
    let subtotal = area * materialCost * multiplier

    // Calculate days needed (15 square meters per day, rounded up)
    const daysNeeded = Math.ceil(area / 15)

    // Add travel expenses to the subtotal only if distance is greater than 60 miles
    if (quoteData.distanceToKA56PT && quoteData.distanceToKA56PT > 60) {
      const travelExpenses = calculateTravelExpenses(quoteData.distanceToKA56PT)
      //const accommodationExpenses = (daysNeeded >= 2) ? 100 * daysNeeded || 0 // £100 per day for accommodation
      const accommodationExpenses = 200 * daysNeeded // £200 per day for accommodation
      subtotal += travelExpenses + accommodationExpenses
    }

    const vat = subtotal * 0.2
    const total = subtotal + vat

    return {
      subtotal: subtotal.toFixed(2),
      daysNeeded,
      vat: vat.toFixed(2),
      total: total.toFixed(2),
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name === "unit") {
      const oldUnit = quoteData.unit
      const newUnit = value as "mm" | "cm" | "m"

      setQuoteData((prev) => {
        const updatedData: QuoteData = {
          ...prev,
          unit: newUnit,
          length: prev.length ? convertMeasurements(oldUnit, newUnit, prev.length) : 0,
          width: prev.width ? convertMeasurements(oldUnit, newUnit, prev.width) : 0,
          lengthB: prev.lengthB ? convertMeasurements(oldUnit, newUnit, prev.lengthB) : 0,
          widthB: prev.widthB ? convertMeasurements(oldUnit, newUnit, prev.widthB) : 0,
          lengthC: prev.lengthC ? convertMeasurements(oldUnit, newUnit, prev.lengthC) : 0,
          widthC: prev.widthC ? convertMeasurements(oldUnit, newUnit, prev.widthC) : 0,
        }
        return updatedData
      })
    } else if (name === "material" || name === "name" || name === "email" || name === "phone") {
      setQuoteData((prev) => ({
        ...prev,
        [name]: value,
      }))
    } else {
      setQuoteData((prev) => ({
        ...prev,
        [name]: name === "shape" ? value : Number(value) || 0,
      }))
    }
  }

  const handleAddressChange = (address: string, latitude?: number, longitude?: number) => {
    setQuoteData((prev) => ({
      ...prev,
      address,
      latitude,
      longitude,
    }))
  }

  const handleShapeSelect = (shape: string) => {
    let complexity = "simple"
    if (shape === "l-shape") {
      complexity = "medium"
    } else if (shape === "h-shape" || shape === "c-shape") {
      complexity = "complex"
    }

    setQuoteData((prev) => ({
      ...prev,
      shape,
      complexity,
      length: 0,
      width: 0,
      lengthB: 0,
      widthB: 0,
      lengthC: 0,
      widthC: 0,
    }))
    // Automatically advance to the next step
    const currentIndex = steps.indexOf(currentStep)
    const nextStep = steps[currentIndex + 1] as Step
    setCurrentStep(nextStep)
    setFurthestStep((prev) => {
      const prevIndex = steps.indexOf(prev)
      return prevIndex < currentIndex + 1 ? nextStep : prev
    })
  }

  const goToStep = (step: Step) => {
    if (isStepAccessible(step)) {
      setCurrentStep(step)
    }
  }

  const validateMeasurements = () => {
    const { shape, length, width, lengthB, widthB, lengthC, widthC } = quoteData

    if (length === 0 || width === 0) return false

    if (shape === "l-shape" || shape === "h-shape" || shape === "c-shape") {
      if (lengthB === 0 || widthB === 0) return false
    }

    if (shape === "h-shape") {
      if (lengthC === 0 || widthC === 0) return false
    }

    return true
  }

  const validateContactDetails = () => {
    const { name, email, phone, address } = quoteData
    return name.trim() !== "" && email.trim() !== "" && phone.trim() !== "" && address.trim() !== ""
  }

  const nextStep = () => {
    if (currentStep === "dimensions" && !validateMeasurements()) {
      alert("Please fill in all required measurements before proceeding.")
      return
    }
    if (currentStep === "contact" && !validateContactDetails()) {
      alert("Please fill in all contact details before proceeding.")
      return
    }

    const currentIndex = steps.indexOf(currentStep)
    const nextStep = steps[currentIndex + 1] as Step
    setCurrentStep(nextStep)

    // Only update furthestStep if the current step is valid
    if (
      (currentStep !== "dimensions" || validateMeasurements()) &&
      (currentStep !== "contact" || validateContactDetails())
    ) {
      setFurthestStep((prev) => {
        const prevIndex = steps.indexOf(prev)
        return prevIndex < currentIndex + 1 ? nextStep : prev
      })
    }
  }

  const prevStep = () => {
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1] as Step)
    }
  }

  const renderDimensionInputs = () => {
    return (
      <div className="space-y-6">
        {/* Diagram at the top */}
        <div className="mb-6">
          <RoofDimensionDiagram shape={quoteData.shape} unit={quoteData.unit} />
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-center italic text-sm text-gray-600">
              Your roof from above
            </p>
          </div>
        </div>

        {/* Unit selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Unit of Measurement</label>
          <select
            name="unit"
            value={quoteData.unit}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="m">Meters</option>
            <option value="cm">Centimeters</option>
            <option value="mm">Millimeters</option>
          </select>
        </div>

        {/* Two column layout for inputs */}
        <div className="grid grid-cols-2 gap-6">
          {/* Main section dimensions */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-blue-600 mb-3">Main Section</h3>
            <div>
              <label className="block text-sm font-medium text-blue-600 mb-1">Main Length</label>
              <input
                type="number"
                name="length"
                value={quoteData.length || ""}
                onChange={handleChange}
                min="0"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Length in ${quoteData.unit}`}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-600 mb-1">Main Width</label>
              <input
                type="number"
                name="width"
                value={quoteData.width || ""}
                onChange={handleChange}
                min="0"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Width in ${quoteData.unit}`}
                required
              />
            </div>
          </div>

          {/* Additional sections */}
          <div className="space-y-4">
            {(quoteData.shape === "l-shape" || quoteData.shape === "h-shape" || quoteData.shape === "c-shape") && (
              <>
                <h3 className="text-sm font-medium text-green-600 mb-3">Section B</h3>
                <div>
                  <label className="block text-sm font-medium text-green-600 mb-1">Length B</label>
                  <input
                    type="number"
                    name="lengthB"
                    value={quoteData.lengthB || ""}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder={`Length in ${quoteData.unit}`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-600 mb-1">Width B</label>
                  <input
                    type="number"
                    name="widthB"
                    value={quoteData.widthB || ""}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder={`Width in ${quoteData.unit}`}
                    required
                  />
                </div>
              </>
            )}
          </div>

          {/* H-Shape additional section */}
          {quoteData.shape === "h-shape" && (
            <div className="space-y-4 col-span-2">
              <h3 className="text-sm font-medium text-purple-600 mb-3">Section C</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-purple-600 mb-1">Length C</label>
                  <input
                    type="number"
                    name="lengthC"
                    value={quoteData.lengthC || ""}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder={`Length in ${quoteData.unit}`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-600 mb-1">Width C</label>
                  <input
                    type="number"
                    name="widthC"
                    value={quoteData.widthC || ""}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder={`Width in ${quoteData.unit}`}
                    required
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Enter all measurements in {quoteData.unit}. For accurate quotes, please measure carefully.
          </p>
        </div>
      </div>
    )
  }

  const formatMeasurement = (value: number) => {
    return `${value} ${quoteData.unit}`
  }

  const renderStep = () => {
    switch (currentStep) {
      case "shape":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Looking at your roof from above, what shape is it?</h2>
            <RoofShapeSelector selectedShape={quoteData.shape} onShapeSelect={handleShapeSelect} />
          </div>
        )

      case "dimensions":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Measure your building and enter the dimensions</h2>
            {renderDimensionInputs()}
          </div>
        )

      case "complexity":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Complexity - how many angles or valleys etc your roof has</h2>
            <select
              name="complexity"
              value={quoteData.complexity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
              disabled
            >
              <option value="simple">Simple (Basic Layout)</option>
              <option value="medium">Medium (Some Angles)</option>
              <option value="complex">Complex (Multiple Angles)</option>
            </select>
            <p className="mt-2 text-sm text-gray-600">The complexity is automatically set based on your roof shape.</p>
          </div>
        )

      case "material":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">What materials would you like your roof finished in?</h2>
            <div className="space-y-3">
              {materials.map((material) => (
                <label
                  key={material.id}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    quoteData.material === material.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="material"
                    value={material.id}
                    checked={quoteData.material === material.id}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <span
                    className={`font-medium ${quoteData.material === material.id ? "text-blue-600" : "text-gray-700"}`}
                  >
                    {material.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )

      case "contact":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Contact Details</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (validateContactDetails()) {
                  nextStep()
                } else {
                  alert("Please fill in all required fields correctly.")
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={quoteData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Jock Thompson"
                  pattern="[A-Za-z\s]{2,}" 
                  title="Only letters and spaces allowed"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={quoteData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="jock@email.scot"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={quoteData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="07123456789"
                  pattern="^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$" 
                  title="Enter a valid UK phone number (e.g., 07123456789)"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <AddressAutocomplete value={quoteData.address} onChange={handleAddressChange} />
              </div>
            </form>
          </div>
        )

      case "quote":
        const quote = calculateQuote()
        const selectedMaterial = materials.find((m) => m.id === quoteData.material)

        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4"><img src="https://www.islandroofers.co.uk/images/ir-logo.png" alt="Island Roofers Logo" className="h-24 w-auto object-contain hidden print:inline-block mr-2" />Your Estimated Quote</h2>

            {/* Contact Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3 print:hidden">Contact Information</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <p className="font-medium">{quoteData.name}</p>
                </div>
                <div className="print:hidden">
                  <span className="text-gray-600">Email:</span>
                  <p className="font-medium">{quoteData.email}</p>
                </div>
                <div className="print:hidden">
                  <span className="text-gray-600">Phone:</span>
                  <p className="font-medium">{quoteData.phone}</p>
                </div>
                <div>
                  <span className="text-gray-600">Address:</span>
                  <p className="font-medium">{quoteData.address}</p>
                </div>
              </div>
            </div>

            {/* Project Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Project Summary</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Roof Shape:</span>
                    <p className="font-medium capitalize">{quoteData.shape.replace("-", " ")}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Estimated Total Area:</span>
                    <p className="font-medium">{calculateArea().toFixed(2)} m²</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Complexity:</span>
                    <p className="font-medium capitalize">{quoteData.complexity}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Material:</span>
                    <p className="font-medium">{selectedMaterial?.name}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600">Estimated Duration:</span>
                    <p className="font-medium">{quote.daysNeeded} days</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Measurements */}
            <div className="bg-gray-50 rounded-lg p-4 print:hidden">
              <h3 className="text-lg font-medium mb-3">Measurements</h3>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">Main Length:</span>
                    <p className="font-medium">{formatMeasurement(quoteData.length)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Main Width:</span>
                    <p className="font-medium">{formatMeasurement(quoteData.width)}</p>
                  </div>
                  {(quoteData.shape === "l-shape" || quoteData.shape === "c-shape" || quoteData.shape === "h-shape") &&
                    quoteData.lengthB &&
                    quoteData.widthB && (
                      <>
                        <div>
                          <span className="text-gray-600">Section B Length:</span>
                          <p className="font-medium">{formatMeasurement(quoteData.lengthB)}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Section B Width:</span>
                          <p className="font-medium">{formatMeasurement(quoteData.widthB)}</p>
                        </div>
                      </>
                    )}
                  {quoteData.shape === "h-shape" && quoteData.lengthC && quoteData.widthC && (
                    <>
                      <div>
                        <span className="text-gray-600">Section C Length:</span>
                        <p className="font-medium">{formatMeasurement(quoteData.lengthC)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Section C Width:</span>
                        <p className="font-medium">{formatMeasurement(quoteData.widthC)}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="text-lg font-medium mb-3">Cost Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Materials and Labour:</span>
                  <span className="font-medium">£{quote.subtotal}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">VAT:</span>
                  <span className="font-medium">£{quote.vat}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                  <span>Total:</span>
                  <span>£{quote.total}</span>
                </div>
              </div>
            </div>

            <div className="bg-sky-50 rounded-lg border border-sky-100 text-sky-600 italic px-4 py-3" role="alert">
              <p className="text-sm">*This is an estimate based on the information provided</p>
              <p className="text-sm">Final price may vary based on site inspection and additional requirements.</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg print:shadow-none">
      <div className="mb-8 print:hidden">
        <div className="flex justify-between mb-2">
          {steps.map((step, index) => (
            <div key={step} className={`flex items-center ${index !== 0 ? "flex-1" : ""}`}>
              <button
                onClick={() => goToStep(step)}
                disabled={!isStepAccessible(step)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors
                  ${
                    step === currentStep
                      ? "bg-blue-600 text-white"
                      : isStepAccessible(step)
                        ? "bg-gray-200 text-gray-600 hover:bg-gray-300 cursor-pointer"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
              >
                {index + 1}
              </button>
              {index !== steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 ${isStepAccessible(steps[index + 1]) ? "bg-blue-200" : "bg-gray-200"}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="min-h-[300px]">{renderStep()}</div>
      <div className="flex justify-between mt-8 print:hidden">
        {currentStep !== "shape" && (
          <button onClick={prevStep} className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
        )}
        {currentStep !== "quote" && currentStep !== "shape" && (
          <button
            onClick={nextStep}
            disabled={
              (currentStep === "dimensions" && !validateMeasurements()) ||
              (currentStep === "contact" && !validateContactDetails())
            }
            className={`flex items-center px-4 py-2 text-white rounded-md ml-auto ${
              (currentStep === "dimensions" && !validateMeasurements()) ||
              (currentStep === "contact" && !validateContactDetails())
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        )}
        {currentStep === "quote" && (
          <a
            href="javascript:if(window.print)window.print()"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ml-auto"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </a>
        )}
      </div>
    </div>
  )
}