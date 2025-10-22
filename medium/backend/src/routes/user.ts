import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import { signupInput, signinInput } from "@sangeeta_/medium-common";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL?: string;
    DATABASE_URL_ACCELERATE?: string;
    JWT_SECRET: string;
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

// Signup
userRouter.post("/signup", async (c) => {
  const datasourceUrl = getDatasourceUrl(c.env);
  const prisma = new PrismaClient({ datasourceUrl }).$extends(withAccelerate());
  const body = await c.req.json();

  const parsed = signupInput.safeParse(body);
  if (!parsed.success) {
    c.status(400);
    return c.json({ error: "Invalid input" });
  }

  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        name: body.name || "",
      },
    });

    const token = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ jwt: token });
  } catch {
    c.status(403);
    return c.json({ error: "Error while signing up" });
  }
});

// Signin
userRouter.post("/signin", async (c) => {
  const datasourceUrl = getDatasourceUrl(c.env);
  const prisma = new PrismaClient({ datasourceUrl }).$extends(withAccelerate());
  const body = await c.req.json();

  const parsed = signinInput.safeParse(body);
  if (!parsed.success) {
    c.status(400);
    return c.json({ error: "Invalid input" });
  }

  const user = await prisma.user.findUnique({
    where: { email: body.email },
  });

  if (!user || user.password !== body.password) {
    c.status(403);
    return c.json({ error: "Invalid credentials" });
  }

  const token = await sign({ id: user.id }, c.env.JWT_SECRET);
  return c.json({ jwt: token });
});
