// src/pages/CommunityForum.tsx

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, MessageCircle, Users, PlusCircle, Search, ArrowRight } from "lucide-react";

const sampleDiscussions = [
  {
    id: 1,
    title: "How to register an NGO in India?",
    author: "Amit Kumar",
    replies: 5,
    views: 48,
    tags: ["NGO", "Registration"],
    lastReply: "1 hour ago",
  },
  {
    id: 2,
    title: "Tenant rights in Maharashtra",
    author: "Sneha Reddy",
    replies: 12,
    views: 110,
    tags: ["Rental Law", "Rights"],
    lastReply: "25 mins ago",
  },
  {
    id: 3,
    title: "Legal process for mutual divorce",
    author: "Priya Singh",
    replies: 9,
    views: 97,
    tags: ["Divorce", "Family Law"],
    lastReply: "2 hours ago",
  },
  {
    id: 4,
    title: "What is the procedure for property will?",
    author: "Arjun Patel",
    replies: 4,
    views: 38,
    tags: ["Will", "Property Law"],
    lastReply: "40 mins ago",
  },
];

const CommunityForum: React.FC = () => {
  const [search, setSearch] = useState("");

  const filtered = sampleDiscussions.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10 min-h-screen">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-teal-600 mb-1 flex items-center justify-center gap-2">
          <Users className="h-7 w-7 text-teal-400" />
          Community Forum
        </h1>
        <p className="text-base text-slate-700 max-w-xl mx-auto">
          Ask questions, share experiences, and get advice from our legal community.  
          You can browse topics, start new discussions, and connect with peers.
        </p>
      </div>

      {/* Search and Post */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
        <div className="w-full md:w-1/2 relative">
          <Search className="absolute left-3 top-3 text-slate-400 h-5 w-5" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-teal-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-200"
            placeholder="Search discussions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold px-5 py-2 rounded-lg shadow transition">
          <PlusCircle className="h-5 w-5" />
          Start Discussion
        </button>
      </div>

      {/* Discussion List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <Card className="text-center p-8">
            <CardContent>
              <MessageCircle className="h-10 w-10 text-slate-400 mx-auto mb-2" />
              <div className="text-lg font-semibold mb-1">No discussions found</div>
              <div className="text-slate-500">Try searching for another topic or start a new discussion.</div>
            </CardContent>
          </Card>
        ) : (
          filtered.map((discussion) => (
            <Card key={discussion.id} className="transition hover:shadow-lg hover:border-teal-200 cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex flex-col">
                  <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-teal-400" />
                    {discussion.title}
                  </CardTitle>
                  <div className="text-xs text-slate-500 mt-1 flex gap-2 flex-wrap">
                    {discussion.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded bg-teal-50 text-teal-600 font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-teal-200" />
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between pt-0 pb-2">
                <div className="text-slate-600 text-sm">
                  <User className="inline-block mr-1 h-4 w-4" />
                  {discussion.author} &nbsp;•&nbsp;
                  <span className="text-teal-600">{discussion.lastReply}</span>
                </div>
                <div className="flex gap-4 text-xs mt-2 md:mt-0">
                  <span>
                    <MessageCircle className="inline-block mr-1 h-4 w-4 text-slate-400" />
                    {discussion.replies} replies
                  </span>
                  <span>
                    👁️ {discussion.views} views
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CommunityForum;