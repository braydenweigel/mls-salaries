"use client"

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";


export default function HomePageError() {
    return (
    <div className="grid place-items-center h-screen w-full">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold">404 - Page Not Found</h1>
        <Button>
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Return to Home
          </Link>
        </Button>
      </div>
    </div>
     
      
    );
  }
  