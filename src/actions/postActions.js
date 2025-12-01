"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createPost(formData) {
  try {
    const title = formData.get("title");
    const content = formData.get("content");
    const published = formData.get("published") === "on";

    // Validation
    if (!title || title.trim() === "") {
      return {
        success: false,
        error: "Title is required",
      };
    }

    // Create post
    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        content: content?.trim() || null,
        published,
      },
    });

    // Revalidate the posts page
    revalidatePath("/posts");

    return {
      success: true,
      data: post,
    };
  } catch (error) {
    console.error("Error creating post:", error);
    return {
      success: false,
      error: "Failed to create post. Please try again.",
    };
  }
}

export async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        id: "desc",
      },
    });

    return {
      success: true,
      data: posts,
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return {
      success: false,
      error: "Failed to fetch posts",
      data: [],
    };
  }
}