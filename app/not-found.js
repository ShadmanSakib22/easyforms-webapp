export default function NotFound() {
  return (
    <div className="container mx-auto p-4 text-center my-[5rem]">
      <h1 className="text-2xl font-bold text-error">Page Not Found - 404</h1>
      <p className="font-mono pb-[10rem]">No page found at this location</p>
      <a
        href="#"
        className="text-primary text-xs font-mono capitalize hover:underline underline-offset-2"
      >
        Contact support for assistance
      </a>
    </div>
  );
}
