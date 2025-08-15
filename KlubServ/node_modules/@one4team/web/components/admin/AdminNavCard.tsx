import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface AdminNavCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
  badge?: string;
}

export function AdminNavCard({ 
  title, 
  description, 
  icon: Icon, 
  href, 
  color, 
  badge 
}: AdminNavCardProps) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer group">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${color} text-white`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {title}
                </CardTitle>
                {badge && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {badge}
                  </span>
                )}
              </div>
              <CardDescription className="text-sm text-gray-600 mt-1">
                {description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
} 