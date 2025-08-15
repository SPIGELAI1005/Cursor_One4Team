'use client';

import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Download, 
  FileText, 
  CreditCard,
  Users,
  Settings,
  BarChart3,
  Calendar
} from "lucide-react";

export function FinanceToolbar() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex flex-wrap gap-3">
        {/* Quick Actions */}
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          New Invoice
        </Button>
        
        <Button variant="outline">
          <Users className="w-4 h-4 mr-2" />
          Manage Plans
        </Button>
        
        <Button variant="outline">
          <CreditCard className="w-4 h-4 mr-2" />
          Payment Settings
        </Button>
        
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
        
        <Button variant="outline">
          <FileText className="w-4 h-4 mr-2" />
          Generate Reports
        </Button>
        
        <Button variant="outline">
          <BarChart3 className="w-4 h-4 mr-2" />
          Analytics
        </Button>
        
        <Button variant="outline">
          <Calendar className="w-4 h-4 mr-2" />
          Fiscal Period
        </Button>
        
        <Button variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Finance Settings
        </Button>
      </div>
    </div>
  );
} 