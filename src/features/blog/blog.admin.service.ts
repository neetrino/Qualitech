import type { AdminBlogCreateInput, AdminBlogPatchInput } from "@/features/blog/blog.admin.schemas";
import {
  adminCreateBlogPost,
  adminDeleteBlogPost,
  adminGetBlogPostById,
  adminListBlogPosts,
  adminUpdateBlogPost,
} from "@/features/blog/blog.admin.repository";

export async function listBlogPostsForAdmin() {
  return adminListBlogPosts();
}

export async function getBlogPostForAdmin(id: string) {
  return adminGetBlogPostById(id);
}

export async function createBlogPostForAdmin(data: AdminBlogCreateInput) {
  return adminCreateBlogPost(data);
}

export async function updateBlogPostForAdmin(id: string, patch: AdminBlogPatchInput) {
  return adminUpdateBlogPost(id, patch);
}

export async function deleteBlogPostForAdmin(id: string): Promise<boolean> {
  return adminDeleteBlogPost(id);
}
