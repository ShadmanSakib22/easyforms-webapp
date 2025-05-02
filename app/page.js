export default function Home() {
  return (
    <>
      <div className="container mx-auto flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-2xl font-bold text-warning">Hey!</h1>
        <p className="font-mono pb-[10rem]">Build in Progress...</p>

        <a
          href="#"
          className="text-primary text-xs font-mono capitalize hover:underline underline-offset-2"
        >
          Login to test out what's coming next!
        </a>
      </div>
    </>
  );
}
