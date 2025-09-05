import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold">404 – Not Found</h1>
      <p className="mt-2 text-gray-600">The page you are looking for does not exist.</p>
      <Link href="/blogs" className="btn btn-primary mt-6">Go to Blogs</Link>
    </div>
  );
}

