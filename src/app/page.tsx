import Link from "next/link";
import Card from "@/components/Card";
import Button from "@/components/Button";

export default function Home() {
  return (
      <div className="bg-gray-100 min-h-screen">
        <Card>
          <h2 className="text-gray-500 text-sm mb-2">Home</h2>
          <h1 className="text-3xl font-bold text-center">ClaimPilot</h1>
          <p className="text-center text-gray-600 mt-2">Simple, fast and secure auto claims.</p>
          <div className="flex flex-col items-center mt-6 space-y-4">
            <Link href="/submit-claim">
              <Button>Submit a New Claim</Button>
            </Link>
            <Link href="/track-claim">
              <Button>Track My Claim</Button>
            </Link>
          </div>
        </Card>
      </div>
  );
}