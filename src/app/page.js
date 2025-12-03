// import { getPosts } from "@/actions/postActions";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// // import { Badge } from "@/components/ui/badge";
// import Link from "next/link";
// import { Plus } from "lucide-react";

// export default async function CreatePost() {
//   const result = await getPosts();
//   const posts = result.data || [];

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4">
//       <div className="max-w-4xl mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Posts</h1>
//             <p className="text-gray-600 mt-1">Manage your blog posts</p>
//           </div>
//           <Link href="/posts/create">
//             <Button>
//               <Plus className="mr-2 h-4 w-4" />
//               Create Post
//             </Button>
//           </Link>
//         </div>

//         {posts.length === 0 ? (
//           <Card>
//             <CardContent className="py-12 text-center">
//               <p className="text-gray-500 mb-4">No posts yet</p>
//               <Link href="/posts/create">
//                 <Button>Create your first post</Button>
//               </Link>
//             </CardContent>
//           </Card>
//         ) : (
//           <div className="space-y-4">
//             {posts.map((post) => (
//               <Card key={post.id}>
//                 <CardHeader>
//                   <div className="flex justify-between items-start">
//                     <div className="flex-1">
//                       <CardTitle className="text-xl">{post.title}</CardTitle>
//                       {post.content && (
//                         <CardDescription className="mt-2 line-clamp-2">
//                           {post.content}
//                         </CardDescription>
//                       )}
//                     </div>
//                     <span variant={post.published ? "default" : "secondary"}>
//                       {post.published ? "Published" : "Draft"}
//                     </span>
//                   </div>
//                 </CardHeader>
//               </Card>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// import Link from 'next/link'

// export default function HomePage() {
//   return (
//     <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
//       <div className="text-center">
//         <h1 className="text-4xl font-bold text-gray-900 mb-4">
//           Simple Invoice Manager
//         </h1>
//         <p className="text-lg text-gray-600 mb-8">
//           Invoice management + Email Reminder Automation
//         </p>
//         <Link
//           href="/invoices"
//           className="inline-block px-8 py-3 bg-blue-600 text-white text-lg rounded-md hover:bg-blue-700"
//         >
//           View Invoices
//         </Link>
//       </div>
//     </div>
//   )
// }

"use client"
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
     

      <div className="text-center relative z-10 px-4">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6 animate-fade-in">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          Automated Invoice Management
        </div>

        {/* Main heading with gradient */}
        <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-slide-up">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Simple Invoice
          </span>
          <br />
          <span className="text-gray-900">Manager</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-slide-up animation-delay-200">
          Streamline your invoicing workflow with automated email reminders
          <br />
          <span className="text-base text-gray-500">Never miss a payment again</span>
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-10 animate-slide-up animation-delay-400">
          <div className="px-4 py-2 bg-white rounded-full shadow-sm text-sm text-gray-700 border border-gray-200">
            ⚡ Quick Setup
          </div>
          <div className="px-4 py-2 bg-white rounded-full shadow-sm text-sm text-gray-700 border border-gray-200">
            📧 Auto Reminders
          </div>
          <div className="px-4 py-2 bg-white rounded-full shadow-sm text-sm text-gray-700 border border-gray-200">
            📊 Track Status
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href="/invoices"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 animate-slide-up animation-delay-600"
        >
          Get Started
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>

      </div>

     
    </div>
  )
}