export default function Layout({ children }) {
  return (
    <>
      <header></header>
      <main className="py-12">{children}</main>
      <footer></footer>
    </>
  );
}
