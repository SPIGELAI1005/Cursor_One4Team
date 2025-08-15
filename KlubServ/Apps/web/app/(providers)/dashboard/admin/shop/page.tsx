import { SignedIn } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ShoppingCart, BarChart3, Plus } from "lucide-react";
import Link from "next/link";

export default function AdminShopDashboard() {
  return (
    <SignedIn>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Shop Management</h1>
            <p className="text-muted-foreground">
              Manage your club's merchandise and track sales performance
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                Active products in store
              </p>
              <div className="mt-4">
                <Link href="/dashboard/admin/shop/products">
                  <Button size="sm" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Manage Products
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">
                Orders this month
              </p>
              <div className="mt-4">
                <Link href="/dashboard/admin/shop/orders">
                  <Button size="sm" variant="outline" className="w-full">
                    View Orders
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€12,450</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
              <div className="mt-4">
                <Link href="/dashboard/admin/shop/analytics">
                  <Button size="sm" variant="outline" className="w-full">
                    View Analytics
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Latest orders from your shop
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">#ORD-001</p>
                    <p className="text-sm text-muted-foreground">Thomas Weber</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">€89.99</p>
                    <p className="text-sm text-green-600">Delivered</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">#ORD-002</p>
                    <p className="text-sm text-muted-foreground">Maria Schmidt</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">€45.50</p>
                    <p className="text-sm text-blue-600">Processing</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
              <CardDescription>
                Best selling items this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Club Jersey</p>
                    <p className="text-sm text-muted-foreground">32 units sold</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">€29.99</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Training Shorts</p>
                    <p className="text-sm text-muted-foreground">28 units sold</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">€24.99</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SignedIn>
  );
} 