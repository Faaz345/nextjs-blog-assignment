import type { NextApiRequest, NextApiResponse } from 'next';
import { getBlogBySlug, deleteBlogBySlug } from '@/lib/data/blogService';

// /api/blogs/[slug]
// GET: get single blog by slug
// DELETE: delete by slug
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const slug = req.query.slug as string;
  try {
    if (req.method === 'GET') {
      const blog = await getBlogBySlug(slug);
      if (!blog) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json({ data: blog });
    }

    if (req.method === 'DELETE') {
      const ok = await deleteBlogBySlug(slug);
      if (!ok) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json({ data: { deleted: true } });
    }

    res.setHeader('Allow', 'GET, DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

