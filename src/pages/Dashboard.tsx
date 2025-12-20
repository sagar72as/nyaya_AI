import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  MessageSquare,
  Users,
  Clock,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  UsersRound
} from 'lucide-react';

const quickActions = [
  {
    title: 'Start Legal Chat',
    description: 'AI chat',
    icon: MessageSquare,
    href: '/chat',
    bg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    ring: 'ring-blue-200'
  },
  {
    title: 'Find a Lawyer',
    description: 'Lawyer search',
    icon: Users,
    href: '/lawyers',
    bg: 'bg-green-50',
    iconColor: 'text-green-500',
    ring: 'ring-green-200'
  },
  {
    title: 'Legal Resources',
    description: 'Templates & guides',
    icon: BookOpen,
    href: '/resources',
    bg: 'bg-purple-50',
    iconColor: 'text-purple-500',
    ring: 'ring-purple-200'
  },
  {
    title: 'Community Forum',
    description: 'Ask & discuss with peers',
    icon: UsersRound,
    href: '/communityforum',
    bg: 'bg-pink-50',
    iconColor: 'text-pink-500',
    ring: 'ring-pink-200'
  }
];

const recentSessions = [
  {
    id: 1,
    type: 'Contract Review',
    status: 'completed',
    date: '2024-01-15',
    summary: 'Employment contract analysis completed with 3 key recommendations.'
  },
  {
    id: 2,
    type: 'Legal Consultation',
    status: 'in-progress',
    date: '2024-01-14',
    summary: 'Landlord-tenant dispute consultation in progress.'
  },
  {
    id: 3,
    type: 'Document Drafting',
    status: 'pending',
    date: '2024-01-13',
    summary: 'Small business incorporation documents pending review.'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'in-progress':
      return 'bg-yellow-100 text-yellow-800';
    case 'pending':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const Dashboard = () => {
  // Mock chat breakdown
  const totalChats = 12;
  const aiChats = 8;
  const lawyerChats = 4;
  const growth = 3; // +3 from last month

  return (
    <div className="min-h-screen bg-[#f8fbfc] flex flex-col">
      <main className="container mx-auto flex-1 py-8">
        {/* Welcome */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold mb-3">
            Welcome to <span className="text-teal-500">Nyaya.AI</span>
          </h1>
          <p className="text-lg text-slate-600 font-medium">
            Your intelligent legal assistant for accessible legal guidance
          </p>
        </div>

        {/* Stats & Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 items-stretch">
          {/* Chat Sessions (MATCHED HEIGHT, INFOGRAPHICS) */}
          <Card className="bg-gradient-to-br from-[#e0f7fa] to-white border-teal-100 shadow-md h-full flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold text-slate-800">
                Chat Sessions
              </CardTitle>
              <MessageSquare className="h-5 w-5 text-teal-400" />
            </CardHeader>
            <CardContent className="flex flex-col flex-1 justify-between">
              <div>
                <div className="text-3xl font-extrabold mb-1 text-slate-900">{totalChats}</div>
                <p className="text-sm text-slate-600 mb-2 font-semibold">This month</p>
                <p className="text-xs text-green-600 flex items-center font-medium mb-4">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{growth} from last month
                </p>
                {/* Mini line graph (SVG mock) */}
                <div className="w-full h-16 flex items-end mb-2">
                  <svg width="100%" height="60" viewBox="0 0 120 60" className="block">
                    <polyline
                      fill="none"
                      stroke="#14b8a6"
                      strokeWidth="3"
                      points="0,50 20,40 40,45 60,30 80,20 100,35 120,15"
                    />
                    <circle cx="120" cy="15" r="3" fill="#14b8a6" />
                  </svg>
                </div>
                {/* Horizontal bar for breakdown */}
                <div className="flex items-center w-full gap-2 mb-1">
                  <div className="flex-1 h-2 bg-blue-200 rounded-full mr-1 relative overflow-hidden">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${(aiChats / totalChats) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-blue-600">{aiChats} AI</span>
                  <span className="text-xs text-gray-400">|</span>
                  <span className="text-xs text-green-600">{lawyerChats} Lawyer</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>AI Chats</span>
                  <span>Lawyer Chats</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions (wider, span 2 cols on desktop) */}
          <Card className="bg-gradient-to-br from-[#e0f7fa] to-white border-teal-100 shadow-md col-span-1 md:col-span-2 flex flex-col justify-center h-full">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">Quick Actions</CardTitle>
              <CardDescription className="text-slate-600 font-medium">
                Get started with our most popular features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 justify-center items-stretch mt-2">
                {quickActions.map((action) => (
                  <Link
                    key={action.title}
                    to={action.href}
                    className="flex-1 min-w-[170px] max-w-[220px] group"
                  >
                    <div
                      className={`
                        flex flex-col items-center py-5 px-2 rounded-xl border border-teal-100
                        shadow-sm transition cursor-pointer h-full bg-white/70
                        hover:bg-teal-50 hover:shadow-lg
                      `}
                    >
                      {/* Icon Bubble */}
                      <div
                        className={`w-11 h-11 mb-2 rounded-full flex items-center justify-center
                        ${action.bg} ${action.ring} ring-2 group-hover:ring-4 transition-all`}
                      >
                        <action.icon className={`h-6 w-6 ${action.iconColor}`} />
                      </div>
                      <span className="font-bold text-base text-slate-800 group-hover:text-teal-600 text-center">
                        {action.title}
                      </span>
                      <span className="text-xs text-slate-500 text-center">{action.description}</span>
                      <ArrowRight className="h-4 w-4 mt-2 text-teal-300 group-hover:text-teal-600" />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Sessions */}
        <Card className="mb-12 bg-gradient-to-br from-[#e0f7fa] to-white border-teal-100 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-800">Recent Legal Sessions</CardTitle>
            <CardDescription className="text-slate-600 font-medium">
              Your latest interactions and their current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-start space-x-4 p-4 rounded-lg border border-teal-100 bg-white/50 
                    transition-all duration-200 
                    hover:shadow-lg hover:border-teal-400 hover:bg-[#e0f7fa]/60 cursor-pointer"
                  tabIndex={0}
                >
                  <div className="flex-shrink-0 pt-1">
                    {session.status === 'completed' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-teal-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-slate-800">{session.type}</h3>
                      <Badge className={getStatusColor(session.status)}>
                        {session.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-700 mt-1">{session.summary}</p>
                    <p className="text-xs text-slate-500 mt-2">{session.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* --- FOOTER --- */}
      <footer className="w-full bg-[#e0f7fa] pt-10 pb-4 border-t border-teal-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="rounded-2xl bg-white/70 p-6 md:p-10 shadow-sm border border-teal-100 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-sm">
              {/* Logo & About */}
              <div>
                <div className="font-bold text-2xl text-teal-600 mb-2">Nyaya.AI</div>
                <div className="text-slate-600">
                  Democratizing legal access <br /> through AI-powered assistance.
                </div>
              </div>
              {/* Company */}
              <div>
                <div className="font-semibold text-slate-700 mb-2">Company</div>
                <ul className="space-y-1">
                  <li><Link to="/about" className="hover:text-teal-700 transition">About</Link></li>
                  <li><Link to="/careers" className="hover:text-teal-700 transition">Careers</Link></li>
                </ul>
              </div>
              {/* Product */}
              <div>
                <div className="font-semibold text-slate-700 mb-2">Product</div>
                <ul className="space-y-1">
                  <li><Link to="/chat" className="hover:text-teal-700 transition">Legal Chat</Link></li>
                  <li><Link to="/lawyers" className="hover:text-teal-700 transition">Find Lawyers</Link></li>
                  <li><Link to="/review" className="hover:text-teal-700 transition">Document Review</Link></li>
                </ul>
              </div>
              {/* Resources */}
              <div>
                <div className="font-semibold text-slate-700 mb-2">Resources</div>
                <ul className="space-y-1">
                  <li><Link to="/guides" className="hover:text-teal-700 transition">Legal Guides</Link></li>
                  <li><Link to="/faq" className="hover:text-teal-700 transition">FAQ</Link></li>
                  <li><Link to="/blog" className="hover:text-teal-700 transition">Blog</Link></li>
                </ul>
              </div>
              {/* Legal */}
              <div>
                <div className="font-semibold text-slate-700 mb-2">Legal</div>
                <ul className="space-y-1">
                  <li><Link to="/privacy" className="hover:text-teal-700 transition">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="hover:text-teal-700 transition">Terms & Conditions</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="text-center text-xs text-slate-500">
            © 2024 Nyaya.AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;