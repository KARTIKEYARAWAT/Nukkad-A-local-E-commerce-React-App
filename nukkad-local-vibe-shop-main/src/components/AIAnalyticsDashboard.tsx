import { useState, useEffect } from 'react';
import { TrendingUp, Info, Eye, TrendingDown, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const AIAnalyticsDashboard = ({ stores }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    generateInsights();
  }, [stores]);

  const generateInsights = async () => {
    // Mock analytics insights with detailed hover content
    setTimeout(() => {
      const mockInsights = {
        trends: [
          { 
            category: "Groceries", 
            insight: "30% increase in organic product demand",
            details: "Customer preference shifting towards organic vegetables, fruits, and dairy products. Peak demand on weekends.",
            impact: "High",
            growth: "+30%"
          },
          { 
            category: "Pharmacy", 
            insight: "Higher demand for health supplements",
            details: "Increased interest in vitamins, protein supplements, and immunity boosters post-pandemic.",
            impact: "Medium",
            growth: "+18%"
          },
          { 
            category: "Cafés", 
            insight: "Peak hours shifted to 3-5 PM",
            details: "Work-from-home culture changed customer patterns. Afternoon coffee breaks more popular than morning rush.",
            impact: "Medium",
            growth: "+12%"
          }
        ],
        topPerformers: [
          { 
            name: "Fresh Market", 
            metric: "4.8★ rating",
            details: "Consistently high customer satisfaction with fresh produce quality and competitive pricing.",
            reviews: 248,
            category: "Groceries"
          },
          { 
            name: "MedPlus Pharmacy", 
            metric: "Fastest delivery",
            details: "Average delivery time of 12 minutes. 24/7 availability and emergency medicine service.",
            reviews: 189,
            category: "Pharmacy"
          },
          { 
            name: "Green Café", 
            metric: "Most reviews",
            details: "Popular study spot with free WiFi, quiet ambiance, and affordable menu. Strong social media presence.",
            reviews: 134,
            category: "Café"
          }
        ],
        recommendations: [
          {
            text: "Grocery stores should expand organic sections",
            reason: "30% increase in organic product searches and 25% higher spending on organic items.",
            impact: "Revenue increase potential: 15-20%"
          },
          {
            text: "Cafés could offer afternoon study packages",
            reason: "Peak hours shifted to 3-5 PM with 40% of customers staying 2+ hours for work/study.",
            impact: "Customer retention improvement: 25%"
          },
          {
            text: "Pharmacies should promote health consultations",
            reason: "Growing interest in preventive healthcare and wellness services among local customers.",
            impact: "Service diversification opportunity"
          }
        ]
      };
      
      setInsights(mockInsights);
      setLoading(false);
    }, 1000);
  };

  const TrendCard = ({ trend, index }) => (
    <div 
      className="relative"
      onMouseEnter={() => setHoveredCard(`trend-${index}`)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <div className="text-sm cursor-pointer hover:bg-green-50 p-2 rounded-lg transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-green-700 font-medium">{trend.category}:</span>
          <Badge variant="outline" className="text-xs">
            {trend.growth}
          </Badge>
        </div>
        <span className="text-green-600 ml-2">{trend.insight}</span>
      </div>
      
      {/* Hover Tooltip */}
      {hoveredCard === `trend-${index}` && (
        <div className="absolute z-10 bg-white border border-green-200 rounded-lg shadow-lg p-4 mt-2 w-80 left-0">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="font-semibold text-green-800">{trend.category} Analysis</span>
          </div>
          <p className="text-sm text-gray-700 mb-2">{trend.details}</p>
          <div className="flex justify-between text-xs">
            <span className="text-green-600">Impact: <strong>{trend.impact}</strong></span>
            <span className="text-green-600">Growth: <strong>{trend.growth}</strong></span>
          </div>
        </div>
      )}
    </div>
  );

  const PerformerCard = ({ performer, index }) => (
    <div 
      className="relative"
      onMouseEnter={() => setHoveredCard(`performer-${index}`)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <div className="flex items-center justify-between text-sm cursor-pointer hover:bg-green-50 p-2 rounded-lg transition-colors">
        <span className="text-green-700">{performer.name}</span>
        <Badge className="bg-green-100 text-green-700">
          {performer.metric}
        </Badge>
      </div>

      {/* Hover Tooltip */}
      {hoveredCard === `performer-${index}` && (
        <div className="absolute z-10 bg-white border border-green-200 rounded-lg shadow-lg p-4 mt-2 w-80 right-0">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="h-4 w-4 text-green-600" />
            <span className="font-semibold text-green-800">{performer.name}</span>
          </div>
          <p className="text-sm text-gray-700 mb-2">{performer.details}</p>
          <div className="flex justify-between text-xs">
            <span className="text-green-600">Category: <strong>{performer.category}</strong></span>
            <span className="text-green-600">Reviews: <strong>{performer.reviews}</strong></span>
          </div>
        </div>
      )}
    </div>
  );

  const RecommendationItem = ({ recommendation, index }) => (
    <div 
      className="relative"
      onMouseEnter={() => setHoveredCard(`rec-${index}`)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <li className="text-sm text-green-700 flex items-start cursor-pointer hover:bg-green-50 p-2 rounded-lg transition-colors">
        <span className="text-green-500 mr-2">•</span>
        <span>{recommendation.text}</span>
        <Info className="h-3 w-3 ml-2 mt-0.5 text-green-400" />
      </li>

      {/* Hover Tooltip */}
      {hoveredCard === `rec-${index}` && (
        <div className="absolute z-10 bg-white border border-green-200 rounded-lg shadow-lg p-4 mt-2 w-80 left-6">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="font-semibold text-green-800">Recommendation Details</span>
          </div>
          <p className="text-sm text-gray-700 mb-2"><strong>Why:</strong> {recommendation.reason}</p>
          <p className="text-sm text-green-600"><strong>Expected Impact:</strong> {recommendation.impact}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
          <TrendingUp className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-green-900">AI Market Insights</h3>
          <p className="text-sm text-green-600">Data-driven analysis of local market trends (Hover for details)</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white/70 rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Market Trends */}
          <div className="bg-white/70 rounded-xl p-4 relative">
            <div className="flex items-center space-x-2 mb-3">
              <h4 className="font-semibold text-green-800">📈 Market Trends</h4>
              <Badge variant="outline" className="text-xs">
                <Eye className="h-3 w-3 mr-1" />
                Hover to explore
              </Badge>
            </div>
            <div className="space-y-2">
              {insights?.trends?.map((trend, idx) => (
                <TrendCard key={idx} trend={trend} index={idx} />
              ))}
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white/70 rounded-xl p-4 relative">
            <div className="flex items-center space-x-2 mb-3">
              <h4 className="font-semibold text-green-800">🏆 Top Performers</h4>
              <Badge variant="outline" className="text-xs">
                <Eye className="h-3 w-3 mr-1" />
                Hover to explore
              </Badge>
            </div>
            <div className="space-y-2">
              {insights?.topPerformers?.map((performer, idx) => (
                <PerformerCard key={idx} performer={performer} index={idx} />
              ))}
            </div>
          </div>

          {/* Opportunities */}
          <div className="bg-white/70 rounded-xl p-4 md:col-span-2 relative">
            <div className="flex items-center space-x-2 mb-3">
              <h4 className="font-semibold text-green-800">💡 AI Recommendations</h4>
              <Badge variant="outline" className="text-xs">
                <Eye className="h-3 w-3 mr-1" />
                Hover for insights
              </Badge>
            </div>
            <ul className="space-y-2">
              {insights?.recommendations?.map((rec, idx) => (
                <RecommendationItem key={idx} recommendation={rec} index={idx} />
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};