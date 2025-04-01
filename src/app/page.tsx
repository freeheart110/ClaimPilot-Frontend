import React from 'react';
import Link from 'next/link';
import { FileText, Activity, Upload, Headphones } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to ClaimPilot</h1>
        <p className="text-xl mb-8">Simplify your claims process with our intuitive platform</p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            href="/submit-claim"
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors duration-200"
          >
            Submit a Claim
          </Link>
          <Link
            href="/my-claims"
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors duration-200"
          >
            Track My Claims
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose ClaimPilot?</h2>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <FileText className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Easy Claim Submission</h3>
              <p className="text-gray-600 dark:text-gray-300">
                File your claims quickly with our streamlined process.
              </p>
            </div>
            {/* Feature Card 2 */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <Activity className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Real-time Tracking</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Monitor the status of your claims in real-time.
              </p>
            </div>
            {/* Feature Card 3 */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <Upload className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Secure Document Upload</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Upload supporting documents securely and easily.
              </p>
            </div>
            {/* Feature Card 4 */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadowtags-lg transition-shadow duration-200">
              <Headphones className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">24/7 Support</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get help anytime with our round-the-clock support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-4 text-center text-gray-500 dark:text-gray-400">
        <p>&copy; 2023 ClaimPilot. All rights reserved.</p>
      </footer>
    </div>
  );
}