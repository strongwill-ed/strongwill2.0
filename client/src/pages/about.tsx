import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Award, Target, Users, Zap } from "lucide-react";

export default function About() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About <span className="font-logo italic">Strongwillsports</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              We're passionate about creating premium custom athletic apparel that empowers athletes 
              and teams to perform at their best while looking their finest.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Founded in 2018, Strongwill Sports emerged from a simple observation: athletes deserved better 
                  custom apparel options. Our founders, former collegiate wrestlers and designers, were frustrated 
                  by the limited customization options and lengthy processes available in the market.
                </p>
                <p>
                  We set out to revolutionize the custom athletic apparel industry by combining cutting-edge 
                  design technology with premium materials and manufacturing processes. Our mission was clear: 
                  make custom athletic apparel accessible, affordable, and exceptional.
                </p>
                <p>
                  Today, we've equipped thousands of athletes, teams, and organizations with high-performance 
                  custom gear. From youth wrestling clubs to professional sports teams, our commitment to 
                  quality and innovation continues to drive everything we do.
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Athletes in custom gear" 
                className="rounded-lg shadow-lg w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-lg">
                <div className="text-2xl font-bold text-black">5000+</div>
                <div className="text-sm text-gray-600">Happy Athletes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These core values guide every decision we make and every product we create.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-4">Excellence</h3>
                <p className="text-gray-600">
                  We never compromise on quality. Every product meets our rigorous standards for 
                  performance, durability, and aesthetic appeal.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-4">Innovation</h3>
                <p className="text-gray-600">
                  We continuously push the boundaries of what's possible in custom apparel design 
                  and manufacturing technology.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-4">Community</h3>
                <p className="text-gray-600">
                  We're committed to supporting athletes and teams at every level, fostering 
                  a community of champions.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-4">Purpose</h3>
                <p className="text-gray-600">
                  Every athlete deserves gear that empowers their performance and reflects 
                  their unique identity and aspirations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet the passionate individuals behind Strongwill Sports who make it all possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300" 
                alt="Team member" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover grayscale"
              />
              <h3 className="text-xl font-semibold text-black mb-2">Alex Rodriguez</h3>
              <p className="text-gray-600 mb-3">Founder & CEO</p>
              <p className="text-sm text-gray-600">
                Former Division I wrestler with 10+ years in athletic apparel design and manufacturing.
              </p>
            </div>

            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1494790108755-2616b72e69c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300" 
                alt="Team member" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover grayscale"
              />
              <h3 className="text-xl font-semibold text-black mb-2">Sarah Chen</h3>
              <p className="text-gray-600 mb-3">Head of Design</p>
              <p className="text-sm text-gray-600">
                Award-winning designer specializing in athletic wear with a passion for functional aesthetics.
              </p>
            </div>

            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300" 
                alt="Team member" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover grayscale"
              />
              <h3 className="text-xl font-semibold text-black mb-2">Mike Thompson</h3>
              <p className="text-gray-600 mb-3">VP of Operations</p>
              <p className="text-sm text-gray-600">
                Operations expert ensuring every order meets our high standards for quality and delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">5000+</div>
              <div className="text-gray-300">Athletes Equipped</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <div className="text-gray-300">Teams Served</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
              <div className="text-gray-300">Product Types</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">98%</div>
              <div className="text-gray-300">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
            Ready to Create Something Amazing?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of athletes who trust Strongwill Sports for their custom apparel needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="btn-primary"
              onClick={() => setLocation("/design-tool")}
            >
              Start Designing
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="btn-secondary"
              onClick={() => setLocation("/contact")}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
