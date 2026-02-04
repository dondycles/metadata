export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  const response = await fetch("https://payhip.com/b/F6ZhG");
  const html = await response.text();

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
}
