"use client"

import { useState } from "react"
import { ArrowLeft, MapPin, Phone, Mail, Globe, Star, Building, Wifi, Car, Coffee, BookOpen, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import Image from "next/image"

// Mock data for college details
const collegeData = {
  id: 1,
  name: "St. Xavier's College of Engineering",
  location: "Mumbai, Maharashtra",
  type: "Private",
  established: 1998,
  rating: 4.2,
  reviews: 1247,
  fees: "₹1.2L - ₹1.8L per year",
  placement: 85,
  averagePackage: "₹4.5L",
  highestPackage: "₹12L",
  accreditation: ["NAAC A+", "NBA"],
  images: [
    "/modern-college-campus.jpg",
    "/college-library-interior.jpg",
    "/engineering-laboratory.jpg",
    "/college-hostel-building.jpg",
  ],
  description:
    "St. Xavier's College of Engineering is a premier institution known for its excellence in technical education and industry-oriented curriculum. With state-of-the-art facilities and experienced faculty, we prepare students for successful careers in engineering and technology.",
  courses: [
    { name: "Computer Science Engineering", duration: "4 years", fees: "₹1.8L/year", seats: 120 },
    { name: "Electronics & Communication", duration: "4 years", fees: "₹1.6L/year", seats: 60 },
    { name: "Mechanical Engineering", duration: "4 years", fees: "₹1.5L/year", seats: 90 },
    { name: "Civil Engineering", duration: "4 years", fees: "₹1.4L/year", seats: 60 },
    { name: "Information Technology", duration: "4 years", fees: "₹1.7L/year", seats: 60 },
  ],
  facilities: [
    { name: "Library", icon: BookOpen, description: "24/7 digital library with 50,000+ books" },
    { name: "WiFi Campus", icon: Wifi, description: "High-speed internet throughout campus" },
    { name: "Parking", icon: Car, description: "Secure parking for 500+ vehicles" },
    { name: "Cafeteria", icon: Coffee, description: "Multi-cuisine food court and cafeteria" },
    { name: "Hostels", icon: Building, description: "Separate hostels for boys and girls" },
    { name: "Sports Complex", icon: Award, description: "Indoor and outdoor sports facilities" },
  ],
  placements: {
    2023: { placed: 89, companies: 45, highest: "₹15L", average: "₹4.8L" },
    2022: { placed: 85, companies: 42, highest: "₹12L", average: "₹4.5L" },
    2021: { placed: 78, companies: 38, highest: "₹10L", average: "₹4.2L" },
  },
  topRecruiters: ["TCS", "Infosys", "Wipro", "Accenture", "IBM", "Microsoft", "Amazon", "Google"],
  contact: {
    phone: "+91 98765 43210",
    email: "admissions@stxaviers.edu.in",
    website: "www.stxaviers.edu.in",
    address: "123 College Road, Andheri West, Mumbai - 400058",
  },
}

export default function CollegePage({ params }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isSaved, setIsSaved] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/search">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Search
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{collegeData.name}</h1>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {collegeData.location}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {collegeData.rating} ({collegeData.reviews} reviews)
                </div>
                <Badge variant="secondary">{collegeData.type}</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant={isSaved ? "default" : "outline"} onClick={() => setIsSaved(!isSaved)}>
                {isSaved ? "Saved" : "Save College"}
              </Button>
              <Button>Apply Now</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <Card className="mb-6">
              <CardContent className="p-0">
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <Image
                    src={collegeData.images[selectedImage] || "/placeholder.svg"}
                    alt={collegeData.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex gap-2 overflow-x-auto">
                    {collegeData.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 ${
                          selectedImage === index ? "border-primary" : "border-gray-200"
                        }`}
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${collegeData.name} ${index + 1}`}
                          width={80}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs Content */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="courses">Courses</TabsTrigger>
                <TabsTrigger value="placements">Placements</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About the College</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{collegeData.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{collegeData.established}</div>
                        <div className="text-sm text-gray-600">Established</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{collegeData.placement}%</div>
                        <div className="text-sm text-gray-600">Placement Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{collegeData.averagePackage}</div>
                        <div className="text-sm text-gray-600">Avg Package</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{collegeData.highestPackage}</div>
                        <div className="text-sm text-gray-600">Highest Package</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {collegeData.accreditation.map((acc) => (
                        <Badge key={acc} variant="outline">
                          {acc}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Facilities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {collegeData.facilities.map((facility) => (
                        <div key={facility.name} className="flex items-start gap-3">
                          <facility.icon className="h-5 w-5 text-primary mt-1" />
                          <div>
                            <h4 className="font-medium">{facility.name}</h4>
                            <p className="text-sm text-gray-600">{facility.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="courses" className="space-y-4">
                {collegeData.courses.map((course) => (
                  <Card key={course.name}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold">{course.name}</h3>
                        <Badge variant="secondary">{course.seats} seats</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>Duration: {course.duration}</div>
                        <div>Fees: {course.fees}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="placements" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Placement Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {Object.entries(collegeData.placements).map(([year, data]) => (
                        <div key={year}>
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">Year {year}</h4>
                            <Badge>{data.placed}% placed</Badge>
                          </div>
                          <Progress value={data.placed} className="mb-2" />
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Companies: </span>
                              <span className="font-medium">{data.companies}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Highest: </span>
                              <span className="font-medium">{data.highest}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Average: </span>
                              <span className="font-medium">{data.average}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Recruiters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {collegeData.topRecruiters.map((company) => (
                        <Badge key={company} variant="outline">
                          {company}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center py-8">
                      <p className="text-gray-600">Reviews will be integrated from the review system</p>
                      <Link href="/reviews">
                        <Button className="mt-4">View All Reviews</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Fees Range</h4>
                  <p className="text-lg font-semibold text-primary">{collegeData.fees}</p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{collegeData.contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{collegeData.contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span>{collegeData.contact.website}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5" />
                      <span>{collegeData.contact.address}</span>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Button className="w-full">Apply Now</Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    Download Brochure
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    Schedule Visit
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Similar Colleges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">Similar College {i}</h5>
                        <p className="text-xs text-gray-600">Mumbai, Maharashtra</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">4.{i}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
