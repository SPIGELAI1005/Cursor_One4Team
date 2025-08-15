import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { MemberNav } from "@/components/member/MemberNav";
import { MemberHeader } from "@/components/member/MemberHeader";

interface MemberLayoutProps {
  children: React.ReactNode;
}

export default async function MemberLayout({ children }: MemberLayoutProps) {
  const { userId } = await auth();
  const user = await currentUser();
  
  if (!userId) {
    redirect("/sign-in");
  }

  // Check if user has any valid role (admin, trainer, member, or player)
  const userRoles = user?.publicMetadata?.user_role;
  const hasValidRole = Array.isArray(userRoles) 
    ? userRoles.some(role => ['admin', 'trainer', 'member', 'player'].includes(role))
    : ['admin', 'trainer', 'member', 'player'].includes(userRoles as string);
    
  if (!hasValidRole) {
    redirect("/403");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <div className="w-64 fixed inset-y-0 bg-white border-r border-gray-200">
          <MemberNav />
        </div>
        <div className="ml-64 flex-1">
          <MemberHeader />
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <MemberHeader />
        <main className="pb-20">
          {children}
        </main>
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
          <MemberNav />
        </div>
      </div>
    </div>
  );
} 