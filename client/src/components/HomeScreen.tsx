// import { useAuth } from "../contexts/AuthContext";
// import { Card, CardContent } from "./ui/card";
// import { Button } from "./ui/button";
// import { Badge } from "./ui/badge";
// import { Sparkles, BookOpen, User, Palette, Play } from "lucide-react";
// import { useLocation } from "wouter";
// import { PsychographeLogo } from "./ui/psychographe-logo";

// export const HomeScreen = () => {
//   const { user } = useAuth();
//   const [, setLocation] = useLocation();

//   const getGreeting = () => {
//     const hour = new Date().getHours();
//     if (hour < 12) return "Bonjour";
//     if (hour < 18) return "Bon après-midi";
//     return "Bonsoir";
//   };

//   const getDisplayName = () => {
//     if (!user) return "Créateur";
//     if (user.firstName) return user.firstName;
//     return user.username;
//   };

//   return (
//     <div className="text-center space-y-8">
//       <div className="max-w-4xl mx-auto">
//         {/* Welcome Section */}
//         <div className="mb-12">
//           <div className="mx-auto mb-8 flex items-center justify-center">
//             <PsychographeLogo size="xl" animate={true} />
//           </div>

//           <div className="space-y-4">
//             <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
//               {getGreeting()}, {getDisplayName()}
//             </h1>
//             <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
//               Transformez votre vécu, souvenir, rêve... en{" "}
//               <span className="text-slate-300 font-medium">psychographie</span>{" "}
//               uniques à travers un processus d'IA collaborative dans le Studio
//               Psychographique.
//             </p>
//             <div className="flex flex-wrap justify-center gap-2 mt-4">
//               <Badge
//                 variant="secondary"
//                 className="bg-blue-600/20 text-blue-300 border-blue-600"
//               >
//                 Studio Psychographique
//               </Badge>
//               <Badge
//                 variant="secondary"
//                 className="bg-purple-600/20 text-purple-300 border-purple-600"
//               >
//                 IA Collaborative
//               </Badge>
//               <Badge
//                 variant="secondary"
//                 className="bg-emerald-600/20 text-emerald-300 border-emerald-600"
//               >
//                 Brainstorming Projectif
//               </Badge>
//             </div>
//           </div>
//         </div>

//         {/* Process Steps */}
//         <div className="grid md:grid-cols-3 gap-6 mb-12">
//           <Card className="border-blue-700/30 bg-blue-950/20 backdrop-blur-sm hover:bg-blue-950/30 transition-colors">
//             <CardContent className="p-8 text-center">
//               <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
//                 1
//               </div>
//               <h3 className="font-semibold text-blue-200 mb-2">
//                 Saisie Initiale
//               </h3>
//               <p className="text-slate-400 text-sm leading-relaxed">
//                 Exprimez votre ressenti avec votre voix ou par écrit :
//                 <span className="block mt-2 text-slate-300">
//                   "Quelles idées (vécu, souvenir, rêve... souhaitez-vous
//                   psychographier ?"
//                 </span>
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="border-purple-700/30 bg-purple-950/20 backdrop-blur-sm hover:bg-purple-950/30 transition-colors">
//             <CardContent className="p-8 text-center">
//               <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
//                 2
//               </div>
//               <h3 className="font-semibold text-purple-200 mb-2">
//                 Labo Psychographique
//               </h3>
//               <p className="text-slate-400 text-sm leading-relaxed">
//                 L'IA génère 6 prompts d'enrichissement, choisissez jusqu'à 4 :
//                 <span className="block mt-2 text-slate-300">
//                   Paramètres • Style • Usage • Chaos
//                 </span>
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="border-emerald-700/30 bg-emerald-950/20 backdrop-blur-sm hover:bg-emerald-950/30 transition-colors">
//             <CardContent className="p-8 text-center">
//               <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
//                 3
//               </div>
//               <h3 className="font-semibold text-emerald-200 mb-2">
//                 Génération & Sauvegarde
//               </h3>
//               <p className="text-slate-400 text-sm leading-relaxed">
//                 Création finale avec preview temps réel :
//                 <span className="block mt-2 text-slate-300">
//                   Psychothèque • Partage • Votes
//                 </span>
//               </p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Quick Actions */}
//         <div className="grid md:grid-cols-3 gap-4 mb-8">
//           <Button
//             variant="outline"
//             onClick={() => (window.location.href = "/")}
//             className="border-slate-700 text-slate-300 hover:bg-slate-800 h-16 flex flex-col gap-1"
//           >
//             <Palette className="w-5 h-5" />
//             <span className="text-sm">Studio</span>
//           </Button>

//           <Button
//             variant="outline"
//             onClick={() => setLocation("/psychotheque")}
//             className="border-slate-700 text-slate-300 hover:bg-slate-800 h-16 flex flex-col gap-1"
//           >
//             <BookOpen className="w-5 h-5" />
//             <span className="text-sm">Psychothèque</span>
//           </Button>

//           <Button
//             variant="outline"
//             onClick={() => setLocation("/profile")}
//             className="border-slate-700 text-slate-300 hover:bg-slate-800 h-16 flex flex-col gap-1"
//           >
//             <User className="w-5 h-5" />
//             <span className="text-sm">Profil</span>
//           </Button>
//         </div>

//         {/* Main CTA */}
//         <div className="space-y-4">
//           <Button
//             onClick={() => (window.location.href = "/")}
//             size="lg"
//             className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 hover:from-blue-700 hover:via-purple-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-lg px-8 py-4 h-auto"
//           >
//             <Play className="w-5 h-5 mr-3" />
//             Entrer au Studio Psychographique
//           </Button>

//           <p className="text-sm text-slate-500">
//             Transformez vos ressentis en créations psychographiques uniques
//           </p>
//         </div>

//         {/* Philosophical Note */}
//         <div className="mt-16 max-w-2xl mx-auto">
//           <blockquote className="text-slate-500 text-sm italic leading-relaxed border-l-2 border-blue-800 pl-4">
//             "Le Studio Psychographique transforme le brainstorming en un voyage
//             projectif et résonant, où l'IA collaborative révèle les connexions
//             créatives cachées dans vos ressentis les plus profonds."
//           </blockquote>
//         </div>
//       </div>
//     </div>
//   );
// };
