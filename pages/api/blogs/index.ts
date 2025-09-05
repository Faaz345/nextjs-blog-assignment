import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllBlogs, createBlog } from '@/lib/data/blogService';
import type { CreateBlogInput } from '@/lib/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const blogs = await getAllBlogs();
      return res.status(200).json({ data: blogs });
    }

    if (req.method === 'POST') {
      const body = req.body as Partial<CreateBlogInput>;
      if (!body?.title || !body?.content || !Array.isArray(body?.categoryIds) || !Array.isArray(body?.tagIds) || !body?.authorId) {
        return res.status(400).json({ error: 'Invalid payload. Required: title, content, categoryIds[], tagIds[], authorId' });
      }

      const created = await createBlog({
        title: body.title,
        content: body.content,
        imageUrl: body.imageUrl,
        categoryIds: body.categoryIds,
        tagIds: body.tagIds,
        authorId: body.authorId,
      });
      return res.status(201).json({ data: created });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

