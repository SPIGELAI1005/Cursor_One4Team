"use client";

import { SignedIn } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from "lucide-react";

// Mock data - replace with actual API calls
const mockAnalytics = {
  totalRevenue: 12450.75,
  totalOrders: 156,
  totalCustomers: 89,
  totalProducts: 24,
  revenueChange: 20.1,
  ordersChange: 15.3,
  customersChange: 8.7,
  productsChange: 12.5
};

const mockTopProducts = [
  { name: "Club Jersey", sales: 32, revenue: 959.68 },
  { name: "Training Shorts", sales: 28, revenue: 699.72 },
  { name: "Club Cap", sales: 25, revenue: 399.75 },
  { name: "Training Shirt", sales: 22, revenue: 549.78 },
  { name: "Sports Bag", sales: 18, revenue: 359.82 }
];

const mockRecentSales = [
  { orderNumber: "ORD-001", customer: "Thomas Weber", amount: 89.99, date: "2024-01-17" },
  { orderNumber: "ORD-002", customer: "Maria Schmidt", amount: 45.50, date: "2024-01-16" },
  { orderNumber: "ORD-003", customer: "Anna Müller", amount: 29.99, date: "2024-01-15" },
  { orderNumber: "ORD-004", customer: "Hans Bauer", amount: 67.98, date: "2024-01-14" },
  { orderNumber: "ORD-005", customer: "Lisa Wagner", amount: 34.99, date: "2024-01-13" }
];

export default function AnalyticsPage() {
  return (
    <SignedIn>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Shop Analytics</h1>
            <p className="text-muted-foreground">
              Track your shop's performance and sales metrics
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="30">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{mockAnalytics.totalRevenue.toLocaleString()}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {mockAnalytics.revenueChange > 0 ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
                )}
                {Math.abs(mockAnalytics.revenueChange)}% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAnalytics.totalOrders}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {mockAnalytics.ordersChange > 0 ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
                )}
                {Math.abs(mockAnalytics.ordersChange)}% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAnalytics.totalCustomers}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {mockAnalytics.customersChange > 0 ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
                )}
                {Math.abs(mockAnalytics.customersChange)}% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAnalytics.totalProducts}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {mockAnalytics.productsChange > 0 ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
                )}
                {Math.abs(mockAnalytics.productsChange)}% from last month
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>
                Best performing products by sales volume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTopProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.sales} units sold
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">€{product.revenue.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">
                        €{(product.revenue / product.sales).toFixed(2)} avg
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Sales */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>
                Latest orders from your shop
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecentSales.map((sale) => (
                  <div key={sale.orderNumber} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{sale.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {sale.customer} • {sale.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">€{sale.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Analytics Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                €{(mockAnalytics.totalRevenue / mockAnalytics.totalOrders).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Per order average
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.2%</div>
              <p className="text-xs text-muted-foreground">
                Visitors to customers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Return Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.1%</div>
              <p className="text-xs text-muted-foreground">
                Product returns
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </SignedIn>
  );
} 