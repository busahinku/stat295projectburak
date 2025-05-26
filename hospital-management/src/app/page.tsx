'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Stethoscope, Calendar, Users, Shield, Clock, Heart } from 'lucide-react'
import LoginModal from '@/components/auth/LoginModal'
import RegisterModal from '@/components/auth/RegisterModal'

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const router = useRouter()

  const features = [
    {
      icon: Users,
      title: "Multi-Role Management",
      description: "Complete user system supporting Founders, Doctors (Hospital & Private), Patients, Pharmacists, and Assistants with role-specific dashboards"
    },
    {
      icon: Calendar,
      title: "Static Scheduling System",
      description: "Advanced appointment management with 30-minute time slots from 9:00-17:00, weekday scheduling, and automated cost calculation"
    },
    {
      icon: Stethoscope,
      title: "Medical Records & Prescriptions",
      description: "Comprehensive patient medical history, prescription management, lab results, and diagnoses recording by doctors"
    },
    {
      icon: Shield,
      title: "Room & Equipment Management",
      description: "Multiple room types (Radiology, MR, Donating), patient assignment, and equipment tracking for different departments"
    },
    {
      icon: Heart,
      title: "Inventory & Stock Monitoring",
      description: "Real-time medication tracking, medical inventory analysis, and automated stock monitoring for pharmacists"
    },
    {
      icon: Clock,
      title: "Billing & Financial Reports",
      description: "Automated cost calculation, insurance integration (coming soon), and comprehensive financial reporting for founders"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="nav-pastel shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img 
                src="/images/logos/logo.png" 
                alt="SirLewis Hospital" 
                className="h-8 w-auto"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogin(true)}
                className="btn-pastel btn-pastel-blue text-sm"
              >
                Sign In
              </button>
              <button
                onClick={() => setShowRegister(true)}
                className="btn-pastel btn-pastel-purple text-sm"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16" style={{
        background: 'linear-gradient(135deg, var(--pastel-bg-secondary) 0%, var(--pastel-bg-tertiary) 100%)'
      }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">
                <span className="gradient-text-pastel">WE HATE VIBE CODING</span>
                <br />
                sirLewis&Hamilton
              </h2>
              <p className="text-xl text-gray-700 mb-4 leading-relaxed font-medium">
                "The Way Your Healthy Life, The New Era of Digital Healthcare"
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                A real-world Java healthcare application that connects 
                <span style={{color: 'var(--pastel-purple-dark)'}} className="font-medium"> hospitals</span>, 
                <span style={{color: 'var(--pastel-blue-dark)'}} className="font-medium"> private practices</span>, and 
                <span style={{color: 'var(--pastel-pink-dark)'}} className="font-medium"> local healthcare businesses</span> to help them grow and find new patients. Built with Object-Oriented Programming for comprehensive healthcare management.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => setShowRegister(true)}
                  className="btn-pastel btn-pastel-pink px-8 py-4 text-lg"
                >
                  Book Your Appointment
                </button>
                <button
                  onClick={() => setShowLogin(true)}
                  className="btn-pastel btn-pastel-green px-8 py-4 text-lg"
                >
                  Access Your Account
                </button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="card-pastel p-8 bg-gradient-to-br from-white to-purple-50">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1646369506164-f8f24d4d6d81?q=80&w=2662&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="Happy patient with doctor - SirLewis & Hamilton Healthcare" 
                    className="w-full h-80 object-cover rounded-lg shadow-lg"
                  />
                  
                  {/* Floating Elements */}
                  <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg animate-float-pastel">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center shadow-lg animate-float-pastel" style={{animationDelay: '1s'}}>
                    <Stethoscope className="h-8 w-8 text-white" />
                  </div>
                  
                  <div className="absolute top-4 -right-4 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg animate-float-pastel" style={{animationDelay: '2s'}}>
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                </div>
                
                {/* Patient Testimonial Overlay */}
                <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=100&h=100&fit=crop&crop=face&auto=format&q=80" 
                        alt="Happy Patient" 
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 italic">
                        "Best healthcare experience ever! The platform is so easy to use."
                      </p>
                      <p className="text-xs text-gray-500 mt-1">- Berat Ozkan, Patient</p>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-sm">★</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Partners Section */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Supported By</h3>
            <p className="text-sm text-gray-500">Trusted by leading healthcare organizations and technology partners</p>
          </div>
          
          {/* Sliding Logos Container */}
          <div className="relative overflow-hidden">
            <div className="flex animate-slide-logos-infinite items-center">
              {/* Continuous logo stream - each logo is 224px wide (w-40 + space-x-16) */}
              {[...Array(3)].map((_, setIndex) => (
                <div key={setIndex} className="flex space-x-16 items-center flex-shrink-0" style={{ minWidth: '1792px' }}>
                  {/* Microsoft */}
                  <div className="flex items-center justify-center h-16 w-40 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100 flex-shrink-0">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/512px-Microsoft_logo.svg.png" 
                      alt="Microsoft" 
                      className="h-8 w-auto object-contain"
                    />
                  </div>

                  {/* Google */}
                  <div className="flex items-center justify-center h-16 w-40 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100 flex-shrink-0">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/512px-Google_2015_logo.svg.png" 
                      alt="Google" 
                      className="h-8 w-auto object-contain"
                    />
                  </div>

                  {/* Amazon */}
                  <div className="flex items-center justify-center h-16 w-40 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100 flex-shrink-0">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/512px-Amazon_logo.svg.png" 
                      alt="Amazon" 
                      className="h-8 w-auto object-contain"
                    />
                  </div>

                  {/* Apple */}
                  <div className="flex items-center justify-center h-16 w-40 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100 flex-shrink-0">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/512px-Apple_logo_black.svg.png" 
                      alt="Apple" 
                      className="h-8 w-auto object-contain"
                    />
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-center h-16 w-40 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100 flex-shrink-0">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/512px-Meta_Platforms_Inc._logo.svg.png" 
                      alt="Meta" 
                      className="h-8 w-auto object-contain"
                    />
                  </div>

                  {/* Netflix */}
                  <div className="flex items-center justify-center h-16 w-40 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100 flex-shrink-0">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/512px-Netflix_2015_logo.svg.png" 
                      alt="Netflix" 
                      className="h-8 w-auto object-contain"
                    />
                  </div>

                  {/* Tesla */}
                  <div className="flex items-center justify-center h-16 w-40 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100 flex-shrink-0">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Tesla_T_symbol.svg/512px-Tesla_T_symbol.svg.png" 
                      alt="Tesla" 
                      className="h-8 w-auto object-contain"
                    />
                  </div>

                  {/* Spotify */}
                  <div className="flex items-center justify-center h-16 w-40 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100 flex-shrink-0">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/512px-Spotify_logo_without_text.svg.png" 
                      alt="Spotify" 
                      className="h-8 w-auto object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16" style={{
        background: 'linear-gradient(135deg, var(--pastel-bg-primary) 0%, var(--pastel-bg-quinary) 100%)'
      }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4 text-gray-900">
              Complete Healthcare <span className="gradient-text-pastel">Ecosystem</span>
            </h3>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Built with 
              <span style={{color: 'var(--pastel-green-dark)'}} className="font-medium"> Object-Oriented Programming</span>, our platform supports 
              <span style={{color: 'var(--pastel-orange-dark)'}} className="font-medium"> hospitals and local healthcare businesses</span> with comprehensive management tools for growth and exceptional patient care.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const colors = ['purple', 'blue', 'green', 'orange', 'pink', 'rose']
              const color = colors[index % colors.length]
              return (
                <div key={index} className="card-pastel text-center p-6">
                  <div className={`bg-gradient-to-br from-pastel-${color} to-pastel-${color === 'purple' ? 'indigo' : color === 'blue' ? 'indigo' : color === 'green' ? 'mint' : color === 'orange' ? 'peach' : color === 'pink' ? 'rose' : 'pink'} p-4 rounded-lg w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-sm`} style={{
                    background: `linear-gradient(135deg, var(--pastel-${color}) 0%, var(--pastel-${color === 'purple' ? 'indigo' : color === 'blue' ? 'indigo' : color === 'green' ? 'mint' : color === 'orange' ? 'peach' : color === 'pink' ? 'rose' : 'pink'}) 100%)`
                  }}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Happy Patients Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Happy Patients, <span className="gradient-text-pastel">Healthy Lives</span>
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              See the smiles of our satisfied patients who trust SirLewis & Hamilton for their healthcare journey. 
              <span style={{color: 'var(--pastel-purple-dark)'}} className="font-medium"> Real people</span>, 
              <span style={{color: 'var(--pastel-blue-dark)'}} className="font-medium"> real results</span>, 
              <span style={{color: 'var(--pastel-pink-dark)'}} className="font-medium"> real care</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Patient 1 */}
            <div className="card-pastel p-6 text-center group hover:scale-105 transition-all duration-300">
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="Happy Patient - Mehmet" 
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Heart className="h-4 w-4 text-white" />
                </div>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Mehmet A.</h4>
              <p className="text-sm text-gray-500 mb-3">Cardiology Patient</p>
              <p className="text-gray-600 text-sm italic">
                "The appointment booking was so easy! Dr. Özkaya Eren provided excellent care and the whole experience was seamless."
              </p>
              <div className="flex justify-center mt-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
            </div>

            {/* Patient 2 */}
            <div className="card-pastel p-6 text-center group hover:scale-105 transition-all duration-300">
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1615109398623-88346a601842?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="Happy Patient - Miradil" 
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Stethoscope className="h-4 w-4 text-white" />
                </div>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Miradil A.</h4>
              <p className="text-sm text-gray-500 mb-3">Neurology Patient</p>
              <p className="text-gray-600 text-sm italic">
                "Prof. Dr. Aysen Akkaya's expertise in neurology is outstanding. The platform made managing my appointments effortless."
              </p>
              <div className="flex justify-center mt-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
            </div>

            {/* Patient 3 */}
            <div className="card-pastel p-6 text-center group hover:scale-105 transition-all duration-300">
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-100 to-yellow-100 flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://plus.unsplash.com/premium_photo-1672239496290-5061cfee7ebb?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="Happy Patient - Enes" 
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Enes Furkan Y.</h4>
              <p className="text-sm text-gray-500 mb-3">Regular Check-up</p>
              <p className="text-gray-600 text-sm italic">
                "Love how I can access my medical records anytime. The staff is incredibly helpful and the doctors are top-notch!"
              </p>
              <div className="flex justify-center mt-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
            </div>
          </div>

          {/* Statistics Row */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">1,200+</div>
              <div className="text-sm text-gray-600">Happy Patients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-sm text-gray-600">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-sm text-gray-600">Support Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">15+</div>
              <div className="text-sm text-gray-600">Medical Specialties</div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <p className="text-lg text-gray-600 mb-6">
              Join thousands of patients who have chosen SirLewis & Hamilton for their healthcare needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowRegister(true)}
                className="btn-pastel btn-pastel-purple px-6 py-3"
              >
                Book Your First Appointment
              </button>
              <button
                onClick={() => setShowLogin(true)}
                className="btn-pastel btn-pastel-blue px-6 py-3"
              >
                Access Patient Portal
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Startup Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                From Java Application to 
                <span className="gradient-text-pastel"> Healthcare Revolution</span>
              </h3>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                SirLewis & Hamilton started as a comprehensive Java application built with Object-Oriented Programming principles. 
                Our mission is simple: <span className="font-semibold text-purple-600">"The Way Your Healthy Life"</span>.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600">
                    <span className="font-medium">Not just a hospital</span> - we support local healthcare businesses and help them grow by finding new patients
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600">
                    <span className="font-medium">Complete ecosystem</span> - from appointment scheduling to inventory management, billing, and financial reporting
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600">
                    <span className="font-medium">Real-world application</span> - built by healthcare professionals who understand the industry's challenges
                  </p>
                </div>
              </div>
            </div>
            <div className="card-pastel p-8 bg-gradient-to-br from-purple-50 to-pink-50">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Platform Highlights</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">5+</div>
                  <div className="text-sm text-gray-600">User Roles</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">30min</div>
                  <div className="text-sm text-gray-600">Time Slots</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">9-17</div>
                  <div className="text-sm text-gray-600">Working Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">OOP</div>
                  <div className="text-sm text-gray-600">Java Built</div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-600 italic">
                  "We do not know any security stuff" - but we're learning and growing! 
                  This platform represents our journey from a simple Java terminal application to a comprehensive web-based healthcare solution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16" style={{
        background: 'linear-gradient(135deg, var(--pastel-purple) 0%, var(--pastel-pink) 50%, var(--pastel-rose) 100%)'
      }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            Ready to Transform Healthcare Management?
          </h3>
          <p className="text-lg text-white opacity-90 mb-6 max-w-3xl mx-auto leading-relaxed">
            This is the our reaction to the vibe coding challenge.  
            <span className="text-white font-medium"> sirLewis & Hamilton web application</span> - mostly created by AI tools. If we do not do things like this, it is not because we cannot, it is because we do not want to.
          </p>
          <button
            onClick={() => setShowRegister(true)}
            className="btn-pastel btn-pastel-yellow px-8 py-4 text-lg"
          >
            Start Your Journey Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="nav-pastel py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img 
                  src="/images/logos/logo.png" 
                  alt="SirLewis Hospital" 
                  className="h-8 w-auto"
                />
              </div>
              <p className="text-gray-600 leading-relaxed">
                A real-world Java healthcare startup connecting hospitals and local businesses to help them grow while providing exceptional patient care.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-lg mb-4 text-gray-900">Platform Features</h5>
              <ul className="space-y-2 text-gray-600">
                <li className="hover:text-purple-600 transition-colors cursor-pointer">Multi-Role Management</li>
                <li className="hover:text-purple-600 transition-colors cursor-pointer">Static Scheduling System</li>
                <li className="hover:text-purple-600 transition-colors cursor-pointer">Medical Records</li>
                <li className="hover:text-purple-600 transition-colors cursor-pointer">Room & Inventory Management</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-lg mb-4 text-gray-900">User Roles</h5>
              <ul className="space-y-2 text-gray-600">
                <li className="hover:text-purple-600 transition-colors cursor-pointer">Founder (Hospital Management)</li>
                <li className="hover:text-purple-600 transition-colors cursor-pointer">Doctors (Hospital & Private)</li>
                <li className="hover:text-purple-600 transition-colors cursor-pointer">Patients</li>
                <li className="hover:text-purple-600 transition-colors cursor-pointer">Pharmacists & Assistants</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-lg mb-4 text-gray-900">Technical Details</h5>
              <ul className="space-y-2 text-gray-600">
                <li className="hover:text-purple-600 transition-colors">
                  <span className="font-medium">Built with:</span> Java OOP
                </li>
                <li className="hover:text-purple-600 transition-colors">
                  <span className="font-medium">Web Version:</span> Next.js + TypeScript
                </li>
                <li className="hover:text-blue-600 transition-colors">
                  <span className="font-medium">Database:</span> PostgreSQL + Supabase
                </li>
                <li className="hover:text-blue-600 transition-colors">
                  <span className="font-medium">Mission:</span> "The Way Your Healthy Life"
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-gray-600">
              &copy; 2025 
              <span className="text-blue-600 font-medium">
                {' '}SirLewis & Hamilton Healthcare Platform
              </span>
              . A real-world Java application for healthcare management.
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showLogin && (
        <LoginModal 
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => {
            setShowLogin(false)
            setShowRegister(true)
          }}
        />
      )}
      
      {showRegister && (
        <RegisterModal 
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => {
            setShowRegister(false)
            setShowLogin(true)
          }}
        />
      )}
    </div>
  )
}
