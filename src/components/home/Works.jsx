
import { steps } from "@/constants/work_step";
import { CheckCircle } from "lucide-react";
const Works = () => {
  return (
    <section className="w-full h-full  px-4 py-24 bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
      
      {/* Heading */}
     <h1 className="text-2xl sigmar font-[900] text-center w-full mb-12 relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 animate-text">
  How It Works
  <span className="absolute bottom-[-16px] left-1/2 transform -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 rounded-full animate-pulse"></span>
</h1>



      
      {/* Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
  {steps.map((step) => (
    <div
      key={step.id}
      className="bg-white rounded-xl shadow-md hover:scale-105 transition-transform hover:shadow-xl duration-300 p-6 w-full max-w-lg text-center group cursor-pointer"
    >
      <div className="w-12 h-12 mx-auto bg-gradient-to-tr from-blue-500 via-purple-500 to-orange-500 rounded-full flex items-center justify-center mb-6 text-white text-2xl">
        <CheckCircle className="w-8 h-8" />
      </div>
      <h2 className="text-md font-[800] mb-3 text-gray-800 group-hover:text-purple-600 transition-colors duration-500">
        {step.title}
      </h2>
      <p className="text-gray-600 text-sm nunito">
        {step.description}
      </p>
    </div>

        ))}
      </div>
    </section>
  )
}

export default Works