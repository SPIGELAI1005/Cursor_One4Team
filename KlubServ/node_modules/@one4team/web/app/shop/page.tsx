"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, ShoppingCart, Star, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isOnSale?: boolean;
  salePrice?: number;
}

// Mock data - replace with actual API calls
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Club Jersey",
    description: "Official club jersey with team colors and player number",
    price: 29.99,
    category: "Jerseys",
    imageUrl: "/placeholder.svg",
    rating: 4.8,
    reviews: 124,
    isNew: true
  },
  {
    id: "2",
    name: "Training Shorts",
    description: "Comfortable training shorts for practice sessions",
    price: 24.99,
    category: "Shorts",
    imageUrl: "/placeholder.svg",
    rating: 4.6,
    reviews: 89
  },
  {
    id: "3",
    name: "Club Cap",
    description: "Official club baseball cap with embroidered logo",
    price: 15.99,
    category: "Accessories",
    imageUrl: "/placeholder.svg",
    rating: 4.4,
    reviews: 67,
    isOnSale: true,
    salePrice: 12.99
  },
  {
    id: "4",
    name: "Training Shirt",
    description: "Moisture-wicking training shirt for optimal performance",
    price: 19.99,
    category: "Shirts",
    imageUrl: "/placeholder.svg",
    rating: 4.7,
    reviews: 156
  },
  {
    id: "5",
    name: "Sports Bag",
    description: "Durable sports bag with club branding",
    price: 39.99,
    category: "Bags",
    imageUrl: "/placeholder.svg",
    rating: 4.5,
    reviews: 43
  },
  {
    id: "6",
    name: "Team Jacket",
    description: "Warm team jacket for cold weather training",
    price: 49.99,
    category: "Outerwear",
    imageUrl: "/placeholder.svg",
    rating: 4.9,
    reviews: 78,
    isNew: true
  }
];

const categories = ["All", "Jerseys", "Shorts", "Shirts", "Accessories", "Bags", "Outerwear"];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      default:
        return 0;
    }
  });

  const addToCart = (productId: string) => {
    // TODO: Implement cart functionality
    console.log("Adding to cart:", productId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Club Shop</h1>
            <p className="text-xl mb-8">
              Official merchandise and equipment for our club members
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/shop/cart">
                <Button size="lg" variant="secondary">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  View Cart
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters and Search */}
        <div className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="md:col-span-2">
                  <Label htmlFor="search">Search Products</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search for products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="sort">Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="relative">
                  <div className="aspect-square relative overflow-hidden rounded-lg">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1">
                    {product.isNew && (
                      <Badge className="bg-green-500">New</Badge>
                    )}
                    {product.isOnSale && (
                      <Badge className="bg-red-500">Sale</Badge>
                    )}
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                    <span className="text-sm text-muted-foreground">
                      ({product.reviews})
                    </span>
                  </div>
                  <Badge variant="outline">{product.category}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {product.isOnSale && product.salePrice ? (
                      <>
                        <span className="text-lg font-bold">€{product.salePrice}</span>
                        <span className="text-sm text-muted-foreground line-through">
                          €{product.price}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold">€{product.price}</span>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => addToCart(product.id)}
                    className="flex items-center gap-1"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground text-center">
                Try adjusting your search or filter criteria
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 