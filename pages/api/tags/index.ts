import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllTags, createTag } from '@/lib/data/tagService';

// /api/tags
// GET: list
// POST: create (idempotent by name)
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const tags = await getAllTags();
      return res.status(200).json({ data: tags });
    }

    if (req.method === 'POST') {
      const { name } = req.body as { name?: string };
      if (!name || !name.trim()) return res.status(400).json({ error: 'Name is required' });
      const tag = await createTag(name);
      return res.status(201).json({ data: tag });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

