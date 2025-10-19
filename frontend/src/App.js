import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-earth">
      {/* Header */}
      <header className="glass-effect sticky top-0 z-50">
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-medium text-gradient animate-fade-in">VHA Atelier</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-12">
              <a href="#" className="nav-link text-earth-700 hover:text-warm-terracotta transition-all duration-300 relative group">
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-warm-terracotta transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#" className="nav-link text-earth-700 hover:text-warm-terracotta transition-all duration-300 relative group">
                Women
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-warm-terracotta transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#" className="nav-link text-earth-700 hover:text-warm-terracotta transition-all duration-300 relative group">
                Men
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-warm-terracotta transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#" className="nav-link text-earth-700 hover:text-warm-terracotta transition-all duration-300 relative group">
                Accessories
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-warm-terracotta transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#" className="nav-link text-earth-700 hover:text-warm-terracotta transition-all duration-300 relative group">
                Sale
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-warm-terracotta transition-all duration-300 group-hover:w-full"></span>
              </a>
            </nav>
            <div className="flex items-center space-x-6">
              <button className="p-3 text-earth-700 hover:text-warm-terracotta transition-all duration-300 hover:scale-110">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="p-3 text-earth-700 hover:text-warm-terracotta transition-all duration-300 hover:scale-110">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button className="p-3 text-earth-700 hover:text-warm-terracotta transition-all duration-300 hover:scale-110 relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-warm-terracotta text-white text-xs rounded-full flex items-center justify-center animate-pulse">3</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="section-padding relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-warm-terracotta/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-warm-ochre/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-warm-sage/5 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="container-custom">
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-medium text-earth-900 mb-8 animate-slide-up">
              Discover Your
              <span className="text-gradient block mt-4 animate-text-reveal">Perfect Style</span>
            </h1>
            <p className="text-xl md:text-2xl text-earth-700 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{animationDelay: '0.3s'}}>
              VHA Atelier brings you the latest fashion trends with AI-powered styling advice. 
              Find your perfect look with our intelligent chatbot assistant.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-scale-in" style={{animationDelay: '0.6s'}}>
              <button className="btn btn-primary btn-lg group shimmer-effect">
                <span className="flex items-center">
                  Shop Now
                  <svg className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              <button className="btn btn-secondary btn-lg group">
                <span className="flex items-center">
                  Learn More
                  <svg className="w-5 h-5 ml-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding-sm bg-earth-100/50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-warm-terracotta/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-warm-terracotta/20 transition-all duration-500 group-hover:scale-110">
                <svg className="w-10 h-10 text-warm-terracotta group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-medium text-earth-900 mb-4 group-hover:text-warm-terracotta transition-colors duration-300">AI Styling Assistant</h3>
              <p className="text-earth-700 leading-relaxed">Get personalized fashion advice from our intelligent chatbot that understands your style preferences</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-warm-ochre/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-warm-ochre/20 transition-all duration-500 group-hover:scale-110">
                <svg className="w-10 h-10 text-warm-ochre group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-2xl font-medium text-earth-900 mb-4 group-hover:text-warm-ochre transition-colors duration-300">QR Payment</h3>
              <p className="text-earth-700 leading-relaxed">Quick and secure payments with QR code technology, making checkout effortless and fast</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-warm-sage/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-warm-sage/20 transition-all duration-500 group-hover:scale-110">
                <svg className="w-10 h-10 text-warm-sage group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-2xl font-medium text-earth-900 mb-4 group-hover:text-warm-sage transition-colors duration-300">Fast Delivery</h3>
              <p className="text-earth-700 leading-relaxed">Quick delivery across Vietnam with real-time tracking and premium packaging</p>
            </div>
          </div>
        </div>
      </section>

      {/* Status Section */}
      <section className="section-padding-sm">
        <div className="container-custom">
          <div className="text-center">
            <div className="inline-flex items-center px-8 py-4 bg-warm-sage/10 text-warm-sage rounded-2xl mb-6 glass-effect">
              <div className="w-3 h-3 bg-warm-sage rounded-full mr-3 animate-pulse"></div>
              <span className="text-lg font-medium">Frontend is running successfully!</span>
            </div>
            <p className="text-earth-700 text-xl">
              🚀 React app is live and ready for development
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-earth-900 text-earth-100">
        <div className="container-custom py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-2xl font-medium mb-6 text-gradient">VHA Atelier</h3>
              <p className="text-earth-300 mb-6 leading-relaxed">
                Your premier destination for fashion and style in Vietnam. 
                Discover your perfect look with our AI-powered styling assistant.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-earth-800 rounded-xl flex items-center justify-center text-earth-300 hover:text-warm-terracotta hover:bg-earth-700 transition-all duration-300 hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-earth-800 rounded-xl flex items-center justify-center text-earth-300 hover:text-warm-terracotta hover:bg-earth-700 transition-all duration-300 hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-earth-800 rounded-xl flex items-center justify-center text-earth-300 hover:text-warm-terracotta hover:bg-earth-700 transition-all duration-300 hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-6 text-earth-200">Shop</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-earth-300 hover:text-warm-terracotta transition-colors duration-300">Women</a></li>
                <li><a href="#" className="text-earth-300 hover:text-warm-terracotta transition-colors duration-300">Men</a></li>
                <li><a href="#" className="text-earth-300 hover:text-warm-terracotta transition-colors duration-300">Accessories</a></li>
                <li><a href="#" className="text-earth-300 hover:text-warm-terracotta transition-colors duration-300">Sale</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-6 text-earth-200">Support</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-earth-300 hover:text-warm-terracotta transition-colors duration-300">Contact Us</a></li>
                <li><a href="#" className="text-earth-300 hover:text-warm-terracotta transition-colors duration-300">Size Guide</a></li>
                <li><a href="#" className="text-earth-300 hover:text-warm-terracotta transition-colors duration-300">Shipping</a></li>
                <li><a href="#" className="text-earth-300 hover:text-warm-terracotta transition-colors duration-300">Returns</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-6 text-earth-200">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-earth-300 hover:text-warm-terracotta transition-colors duration-300">About Us</a></li>
                <li><a href="#" className="text-earth-300 hover:text-warm-terracotta transition-colors duration-300">Careers</a></li>
                <li><a href="#" className="text-earth-300 hover:text-warm-terracotta transition-colors duration-300">Privacy</a></li>
                <li><a href="#" className="text-earth-300 hover:text-warm-terracotta transition-colors duration-300">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-earth-800 mt-12 pt-8 text-center">
            <p className="text-earth-400">
              © 2024 VHA Atelier. All rights reserved. Built with ❤️ in Vietnam.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
