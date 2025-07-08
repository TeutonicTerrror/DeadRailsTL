import { serve } from "https://deno.land/std@0.201.0/http/server.ts";
import { serveFile } from "https://deno.land/std@0.201.0/http/file_server.ts";

const PUBLIC_DIR = "./public";

serve(async (req) => {
  try {
    const url = new URL(req.url);
    let filepath = decodeURIComponent(url.pathname);

    if (filepath.includes("..")) {
      return new Response("Forbidden", { status: 403 });
    }

    if (filepath === "/" || filepath.endsWith("/")) {
      filepath += "index.html";
    }

    const fullPath = `${PUBLIC_DIR}${filepath}`;

    return await serveFile(req, fullPath);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return new Response("404 Not Found", { status: 404 });
    }
    return new Response("Internal Server Error", { status: 500 });
  }
});
