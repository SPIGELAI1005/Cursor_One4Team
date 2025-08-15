import { redirect } from 'next/navigation';

export default function ForbiddenRedirect() {
  redirect('/forbidden');
} 