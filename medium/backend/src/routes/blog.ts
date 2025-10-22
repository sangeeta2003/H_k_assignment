import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { createBlogInput, updateBlogInput } from "@sangeeta_/medium-common";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL?: string;
    DATABASE_URL_ACCELERATE?: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

function getDatasourceUrl(env: any): string {
  let datasourceUrl =
    env.DATABASE_URL_ACCELERATE ?? env.DATABASE_URL ?? "" as string;
  if (datasourceUrl.startsWith("postgres")) {
    datasourceUrl = datasourceUrl.replace(/^postgres(?:ql)?:\/\//i, "prisma+postgres://");
  }
  return datasourceUrl;
}

// JWT Middleware
blogRouter.use("*", async (c, next) => {
  const authHeader = c.req.header("authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "");

  try {
    const user = await verify(token, c.env.JWT_SECRET);
    c.set("userId", user.id as string);
    return next();
  } catch {
    c.status(401);
    return c.json({ message: "unauthorized" });
  }
});

// Create Blog
blogRouter.post("/", async (c) => {
  const body = await c.req.json();
  const authorId = c.get("userId");
  const parsed = createBlogInput.safeParse(body);

  if (!parsed.success) {
    c.status(400);
    return c.json({ error: "Invalid input" });
  }

  const datasourceUrl = getDatasourceUrl(c.env);
  const prisma = new PrismaClient({ datasourceUrl }).$extends(withAccelerate());

  try {
    const blog = await prisma.blog.create({
      data: {
        title: body.title,
        content: body.content,
        authorId,
      },
    });
    return c.json({ id: blog.id });
  } catch {
    c.status(500);
    return c.json({ error: "Failed to create blog" });
  }
});

// Update Blog
blogRouter.put("/", async (c) => {
  const body = await c.req.json();
  const parsed = updateBlogInput.safeParse(body);

  if (!parsed.success) {
    c.status(400);
    return c.json({ error: "Invalid input" });
  }

  const datasourceUrl = getDatasourceUrl(c.env);
  const prisma = new PrismaClient({ datasourceUrl }).$extends(withAccelerate());

  try {
    const blog = await prisma.blog.update({
      where: { id: body.id },
      data: {
        title: body.title,
        content: body.content,
      },
    });
    return c.json({ id: blog.id });
  } catch {
    c.status(500);
    return c.json({ error: "Failed to update blog" });
  }
});

// Get All Blogs
blogRouter.get("/bulk", async (c) => {
  const datasourceUrl = getDatasourceUrl(c.env);
  const prisma = new PrismaClient({ datasourceUrl }).$extends(withAccelerate());
  const blogs = await prisma.blog.findMany();
  return c.json({ blogs });
});

// Get Blog by ID
blogRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const datasourceUrl = getDatasourceUrl(c.env);
  const prisma = new PrismaClient({ datasourceUrl }).$extends(withAccelerate());

  try {
    const blog = await prisma.blog.findUnique({ where: { id } });
    return c.json({ blog });
  } catch {
    c.status(411);
    return c.json({ message: "Error while fetching blog post" });
  }
});
