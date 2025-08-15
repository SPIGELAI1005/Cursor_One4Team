"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingBag, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Sample products from the existing shop data
const sampleProducts = [
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
    name: "Team Jacket",
    description: "Warm team jacket for cold weather training",
    price: 49.99,
    category: "Outerwear",
    imageUrl: "/placeholder.svg",
    rating: 4.9,
    reviews: 78,
    isNew: true
  }
]

export default function GuestShopPreview() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Club Shop Preview
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sell your club merchandise, equipment, and tickets through your own branded online shop. 
            Everything you need to generate revenue and promote your club.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {sampleProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-blue-200 overflow-hidden">
              <div className="relative">
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.isNew && (
                      <Badge className="bg-blue-600 text-white text-xs">New</Badge>
                    )}
                    {product.isOnSale && (
                      <Badge className="bg-red-600 text-white text-xs">Sale</Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {product.category}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">{product.rating}</span>
                    <span className="text-sm text-gray-500">({product.reviews})</span>
                  </div>
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                  {product.name}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <CardDescription className="text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </CardDescription>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {product.isOnSale && product.salePrice ? (
                      <>
                        <span className="text-lg font-bold text-red-600">
                          €{product.salePrice}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          €{product.price}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        €{product.price}
                      </span>
                    )}
                  </div>
                  
                  <Button size="sm" variant="outline" className="group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300">
                    <ShoppingBag className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Start Selling?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Create your own branded shop to sell merchandise, equipment, and tickets. 
              No setup fees, no monthly costs - just a small commission on sales.
            </p>
            <Link href="/shop">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Visit the Shop
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
} 