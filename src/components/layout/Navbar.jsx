import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Leaf, TrendingUp, Truck, Warehouse, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { href: "/buyer/marketplace", label: "Marketplace", icon: TrendingUp },
  { href: "/logistics", label: "Logistics", icon: Truck },
  { href: "/storage", label: "Storage", icon: Warehouse },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return "/";
    switch (user.role) {
      case 'farmer': return "/farmer/dashboard";
      case 'buyer': return "/buyer/marketplace";
      case 'logistics': return "/logistics";
      case 'storage': return "/storage";
      default: return "/";
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Leaf className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-serif text-xl font-bold text-foreground">
            KisanBazaar
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${location.pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground"
                }`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <User className="h-4 w-4" />
                  {user.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(getDashboardLink())}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <div className="flex flex-col gap-6 pt-6">
              <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                  <Leaf className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="font-serif text-xl font-bold">KisanBazaar</span>
              </Link>

              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent ${location.pathname === link.href
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground"
                      }`}
                  >
                    <link.icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="flex flex-col gap-3 border-t border-border pt-4">
                {user ? (
                  <>
                    <div className="px-2 text-sm font-medium text-muted-foreground">Signed in as {user.name}</div>
                    <Button variant="outline" className="w-full justify-start gap-2" onClick={() => {
                      navigate(getDashboardLink());
                      setIsOpen(false);
                    }}>
                      <User className="h-4 w-4" />
                      Dashboard
                    </Button>
                    <Button variant="destructive" className="w-full justify-start gap-2" onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}>
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        Login
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsOpen(false)}>
                      <Button className="w-full justify-start gap-2">
                        Register
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
