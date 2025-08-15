'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Edit, 
  Users, 
  Calendar,
  Euro
} from "lucide-react";

interface ContributionPlan {
  id: string;
  title: string;
  amount: number;
  frequency: 'monthly' | 'annual' | 'quarterly';
  status: 'active' | 'inactive';
  assignedTo: string[];
  memberCount: number;
  description: string;
}

// Mock data for contribution plans
const mockPlans: ContributionPlan[] = [
  {
    id: '1',
    title: 'Youth Membership',
    amount: 29.99,
    frequency: 'monthly',
    status: 'active',
    assignedTo: ['youth', 'students'],
    memberCount: 156,
    description: 'Monthly membership for youth members (under 18)'
  },
  {
    id: '2',
    title: 'Adult Membership',
    amount: 49.99,
    frequency: 'monthly',
    status: 'active',
    assignedTo: ['adults'],
    memberCount: 234,
    description: 'Standard monthly membership for adult members'
  },
  {
    id: '3',
    title: 'Family Plan',
    amount: 89.99,
    frequency: 'monthly',
    status: 'active',
    assignedTo: ['families'],
    memberCount: 67,
    description: 'Family membership for up to 4 family members'
  },
  {
    id: '4',
    title: 'Annual Premium',
    amount: 499.99,
    frequency: 'annual',
    status: 'active',
    assignedTo: ['premium'],
    memberCount: 23,
    description: 'Annual premium membership with additional benefits'
  },
  {
    id: '5',
    title: 'Student Discount',
    amount: 19.99,
    frequency: 'monthly',
    status: 'inactive',
    assignedTo: ['students'],
    memberCount: 0,
    description: 'Discounted rate for verified students'
  }
];

export function ContributionPlanList() {
  const [plans] = useState<ContributionPlan[]>(mockPlans);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'monthly':
        return 'Monthly';
      case 'annual':
        return 'Annual';
      case 'quarterly':
        return 'Quarterly';
      default:
        return frequency;
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="space-y-4">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Current Plans</h3>
          <p className="text-sm text-gray-600">
            {plans.filter(p => p.status === 'active').length} active plans
          </p>
        </div>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Plan
        </Button>
      </div>

      {/* Plans List */}
      <div className="space-y-3">
        {plans.map((plan) => (
          <Card key={plan.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-medium text-gray-900">{plan.title}</h4>
                    <Badge className={getStatusColor(plan.status)}>
                      {plan.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Euro className="w-4 h-4" />
                      <span className="font-medium">{formatCurrency(plan.amount)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{getFrequencyLabel(plan.frequency)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{plan.memberCount} members</span>
                    </div>
                  </div>
                  
                  <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
                  
                  <div className="mt-2 flex flex-wrap gap-1">
                    {plan.assignedTo.map((group) => (
                      <Badge key={group} variant="outline" className="text-xs">
                        {group}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {plans.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Contribution Plans</h3>
            <p className="text-gray-600 mb-4">
              Create your first contribution plan to start managing memberships.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create First Plan
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 