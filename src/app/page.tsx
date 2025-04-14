'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, Activity, Upload, Headphones, ShieldCheck, Users, Settings, CheckCircle, BarChart } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="flex flex-col justify-center items-center text-center min-h-[30vh] px-4 pt-16">
        <h1 className="text-4xl font-bold mb-3">Welcome to ClaimPilot</h1>
        <p className="text-lg mb-6">Your trusted platform to file, track, and manage insurance claims seamlessly.</p>
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Link
            href="/submit-claim"
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition"
          >
            Submit a Claim
          </Link>
          <Link
            href="/track-claim"
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Track Claims
          </Link>
        </div>
      </section>

      {/* Policyholder Features */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard icon={<FileText className="h-10 w-10 text-primary mb-2" />} title="Easy Claim Submission" description="File your claims quickly with our streamlined process." href="/submit-claim"/>
            <FeatureCard icon={<Activity className="h-10 w-10 text-primary mb-2" />} title="Real-time Tracking" description="Monitor the status of your claims in real-time." href="/track-claim"/>
            <FeatureCard icon={<Upload className="h-10 w-10 text-primary mb-2" />} title="Secure Document Upload" description="Upload supporting documents securely and easily." />
            <FeatureCard icon={<Headphones className="h-10 w-10 text-primary mb-2" />} title="24/7 Support" description="Get help anytime with our round-the-clock support." />
          </div>
        </div>
      </section>

      {/* Admin Features */}
      <section className="py-10 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-6">Admin Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard icon={<Users className="h-10 w-10 text-primary mb-2" />} title="User Management" description="Manage adjusters, claims, and permissions effortlessly." href="/admin" />
            <FeatureCard icon={<ShieldCheck className="h-10 w-10 text-primary mb-2" />} title="Claim Oversight" description="Oversee all submitted claims and update their status securely." href="/admin" />
            <FeatureCard icon={<Settings className="h-10 w-10 text-primary mb-2" />} title="System Settings" description="Configure platform preferences and admin dashboards." />
          </div>
        </div>
      </section>

      {/* Adjuster Features */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-6">Tools for Adjusters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard icon={<CheckCircle className="h-10 w-10 text-primary mb-2" />} title="Assigned Claims" description="Access and manage claims assigned to you efficiently." href="/adjuster" />
            <FeatureCard icon={<Upload className="h-10 w-10 text-primary mb-2" />} title="Review Evidence" description="Review uploaded documents and make informed decisions." />
            <FeatureCard icon={<BarChart className="h-10 w-10 text-primary mb-2" />} title="Performance Insights" description="Track your performance metrics and claim resolution speed." />
          </div>
        </div>
      </section>
    </div>
  );
}

const FeatureCard = ({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href?: string;
}) => {
  const cardContent = (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition w-full max-w-sm mx-auto hover:cursor-pointer">
      <div className="flex justify-center items-center gap-2 mb-2">
        <span className="text-primary">{icon}</span>
        <h3 className="text-base font-semibold text-foreground text-center">{title}</h3>
      </div>
      <p className="text-center text-gray-600 dark:text-gray-300 text-sm">{description}</p>
    </div>
  );

  return href ? <Link href={href}>{cardContent}</Link> : cardContent;
};