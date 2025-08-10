import { Link, useLocation } from "wouter";
import { Button } from "./ui/button";
import { User, Library, Home, LogOut } from "lucide-react";

export const Header = () => {
  const [location] = useLocation();

  const navigation = [
    { href: "/", label: "Accueil", icon: Home },
    { href: "/psychotheque", label: "Psychothèque", icon: Library },
    { href: "/profile", label: "Profil", icon: User },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            {navigation.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <Button
                  variant={location === href ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Actions utilisateur */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};