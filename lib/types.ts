export type ID = string;

export type ISODateString = string;

export interface Author {
  id: ID;
  name: string;
  bio?: string;
}

export interface Category {
  id: ID;
  name: string;
}

export interface Tag {
  id: ID;
  name: string;
}

export interface Blog {
  id: ID;
  slug: string;
  title: string;
  imageUrl?: string;
  content: string;
  categoryIds: ID[];
  tagIds: ID[];
  authorId: ID;
  createdAt: ISODateString;
}

export interface ExpandedBlog {
  blog: Blog;
  categories: Category[];
  tags: Tag[];
  author: Author;
}

export interface CreateBlogInput {
  title: string;
  imageUrl?: string;
  content: string;
  categoryIds: ID[];
  tagIds: ID[];
  authorId: ID;
}

export interface CreateTaxonomyInput {
  name: string;
}

export type SortBy = 'date' | 'title';
export type SortOrder = 'asc' | 'desc';

export interface FiltersState {
  q: string;
  categoryIds: ID[];
  tagIds: ID[];
  authorId: ID | null;
  sortBy: SortBy;
  sortOrder: SortOrder;
  page: number;
}

